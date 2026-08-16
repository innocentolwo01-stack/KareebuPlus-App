import fs from 'node:fs';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
const ts=require('typescript');

function read(file,required=true){
  if(!fs.existsSync(file)){
    if(required) throw new Error(`Missing ${file}`);
    return '';
  }
  return fs.readFileSync(file,'utf8');
}

function locateFunction(source,name){
  const re=new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`);
  const match=re.exec(source);
  if(!match) return null;

  const functionStart=match.index;
  const openParen=source.indexOf('(',functionStart);
  let depth=0;
  let closeParen=-1;

  for(let index=openParen;index<source.length;index+=1){
    const ch=source[index];
    if(ch==='(') depth+=1;
    else if(ch===')'){
      depth-=1;
      if(depth===0){
        closeParen=index;
        break;
      }
    }
  }

  if(closeParen<0) return null;

  let bodyOpen=closeParen+1;
  while(bodyOpen<source.length && /\s/.test(source[bodyOpen])) bodyOpen+=1;
  if(source[bodyOpen]!=='{') return null;

  const rest=source.slice(bodyOpen+1);
  const next=/\n(?:export\s+)?function\s+[A-Za-z0-9_]+\s*\(/.exec(rest);
  const end=next ? bodyOpen+1+next.index : source.length;

  return {
    closeParen,
    bodyOpen,
    end,
    text:source.slice(functionStart,end),
  };
}

function hookInsideBody(source,name,hook){
  const target=locateFunction(source,name);
  if(!target) return false;

  const hookIndex=source.indexOf(hook,target.bodyOpen+1);
  return (
    hookIndex>target.bodyOpen &&
    hookIndex<target.end &&
    hookIndex>target.closeParen
  );
}

function syntaxClean(file){
  const source=read(file);
  const result=ts.transpileModule(source,{
    compilerOptions:{
      jsx:ts.JsxEmit.ReactJSX,
      target:ts.ScriptTarget.ES2022,
      module:ts.ModuleKind.CommonJS,
    },
    fileName:file,
    reportDiagnostics:true,
  });

  const errors=(result.diagnostics??[]).filter(
    (diagnostic)=>diagnostic.category===ts.DiagnosticCategory.Error
  );

  if(errors.length){
    for(const diagnostic of errors){
      console.error(
        `SYNTAX — ${file} TS${diagnostic.code}: ` +
        ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')
      );
    }
    return false;
  }

  return true;
}

let pass=0;
let total=0;
function check(label,condition){
  total++;
  if(condition) pass++;
  console.log(`${condition?'PASS':'FAIL'} — ${label}`);
}

const nav=read('src/navigation/AppNavigation.tsx');
const screens=read('src/screens.tsx');
const components=read('src/components.tsx');
const food=read('src/food/discovery/surfaces.tsx',false);
const onboarding=read('src/onboarding/KareebuLaunchGate.tsx',false);
const rides=read('src/ride/kareebuRidesHome.tsx',false);
const boda=read('src/ride/kareebuBodaHome.tsx',false);
const discovery=read('src/discovery/KareebuCareemDiscoveryScreen.tsx',false);

check('screens.tsx is syntactically valid before ownership assertions',syntaxClean('src/screens.tsx'));
if(food) check('Food discovery surfaces are syntactically valid',syntaxClean('src/food/discovery/surfaces.tsx'));
if(onboarding) check('Onboarding launch gate is syntactically valid',syntaxClean('src/onboarding/KareebuLaunchGate.tsx'));
check('navigation module is syntactically valid',syntaxClean('src/navigation/AppNavigation.tsx'));

check('V7.4.2 malformed parameter insertion is absent',
  !/useRegisterBackControl\([^;]+;\s*data,\s*actions\s*}\s*:/.test(screens));

check('universal Back remains available as fallback',
  nav.includes('export function UniversalBackButton'));
check('registered custom Back suppresses fallback',
  nav.includes('navigation.registeredBackControls > 0'));
check('Back ownership registers before paint',
  nav.includes('useLayoutEffect(() =>') && nav.includes('Register before paint'));
check('shared Header registers Back ownership',
  components.includes('useRegisterBackControl(Boolean(resolvedBack))'));

const owners=[
  ['CountryScreen',"useRegisterBackControl(data.locationReturn !== 'home');"],
  ['CityScreen','useRegisterBackControl(true);'],
  ['GlobalSearchScreen','useRegisterBackControl(true);'],
  ['KareebuAssistantScreen','useRegisterBackControl(true);'],
  ['LocationPickerScreen','useRegisterBackControl(true);'],
  ['WhereToScreen','useRegisterBackControl(true);'],
  ['ChooseRideScreen','useRegisterBackControl(true);'],
];

for(const [name,hook] of owners){
  check(`${name} owns its custom Back inside its function body`,
    hookInsideBody(screens,name,hook));
}

if(food){
  check('Food search/list/filter header owns Back inside its function body',
    hookInsideBody(food,'SurfaceHeader','useRegisterBackControl(true);'));
}

if(onboarding){
  check('onboarding Back ownership is conditional and inside its body',
    hookInsideBody(
      onboarding,
      'OnboardingChrome',
      'useRegisterBackControl(Boolean(back));'
    ));
}

if(rides){
  check('Rides Back owner remains registered',
    rides.includes('useRegisterBackControl(true)'));
}

if(boda){
  check('Boda Back owner remains registered',
    boda.includes('useRegisterBackControl(true)'));
}

if(discovery){
  check('Careem-style discovery Back owner remains registered',
    discovery.includes('useRegisterBackControl(true)'));
}

const functionMatches=[...screens.matchAll(
  /(?:export\s+)?function\s+([A-Za-z0-9_]+)\s*\(/g
)];

for(let index=0;index<functionMatches.length;index++){
  const name=functionMatches[index][1];
  const target=locateFunction(screens,name);
  if(!target) continue;

  if(
    target.text.includes('name="arrow-left"') ||
    target.text.includes("name='arrow-left'")
  ){
    check(
      `literal arrow-left owner ${name} is registered inside its body`,
      /useRegisterBackControl\(/.test(
        screens.slice(target.bodyOpen+1,target.end)
      )
    );
  }
}

console.log(`Kareebu single-Back ownership checks: ${pass}/${total}.`);
if(pass!==total) process.exit(1);
