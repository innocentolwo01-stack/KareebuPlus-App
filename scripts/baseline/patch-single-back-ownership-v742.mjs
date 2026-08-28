import fs from 'node:fs';

function read(file){ return fs.readFileSync(file,'utf8'); }
function write(file,value){ fs.writeFileSync(file,value); }

function addImport(source, anchor, line, label){
  if(source.includes(line)) return source;
  if(!source.includes(anchor)) throw new Error(`Could not locate ${label}.`);
  return source.replace(anchor, `${anchor}\n${line}`);
}

function locateFunction(source,name){
  const re=new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`);
  const match=re.exec(source);
  if(!match) throw new Error(`Could not locate ${name}.`);

  const functionStart=match.index;
  const openParen=source.indexOf('(',functionStart);
  if(openParen<0) throw new Error(`Could not locate ${name} parameter list.`);

  let depth=0;
  let closeParen=-1;

  for(let index=openParen;index<source.length;index+=1){
    const ch=source[index];
    if(ch==='('){
      depth+=1;
    }else if(ch===')'){
      depth-=1;
      if(depth===0){
        closeParen=index;
        break;
      }
    }
  }

  if(closeParen<0) throw new Error(`Could not close ${name} parameter list.`);

  let bodyOpen=closeParen+1;
  while(bodyOpen<source.length && /\s/.test(source[bodyOpen])) bodyOpen+=1;

  // These target screens are ordinary function declarations whose body
  // follows immediately after the fully balanced parameter list.
  if(source[bodyOpen]!=='{'){
    throw new Error(
      `Expected ${name} body after its complete parameter list; found ${JSON.stringify(source.slice(bodyOpen,bodyOpen+32))}.`
    );
  }

  // Find the next top-level function declaration only for validation chunks.
  const rest=source.slice(bodyOpen+1);
  const next=/\n(?:export\s+)?function\s+[A-Za-z0-9_]+\s*\(/.exec(rest);
  const end=next ? bodyOpen+1+next.index : source.length;

  return {
    functionStart,
    openParen,
    closeParen,
    bodyOpen,
    end,
    text:source.slice(functionStart,end),
  };
}

function insertHook(source,name,hook){
  const target=locateFunction(source,name);

  if(target.text.includes(hook)) return source;
  if(target.text.includes('useRegisterBackControl(')){
    throw new Error(`${name} already contains a different Back-ownership registration.`);
  }

  // Critical: insert AFTER the actual function-body brace, never inside
  // destructured parameters or their TypeScript object annotation.
  return (
    source.slice(0,target.bodyOpen+1) +
    `\n  ${hook}` +
    source.slice(target.bodyOpen+1)
  );
}

function assertHookInsideBody(source,name,hook){
  const target=locateFunction(source,name);
  const hookIndex=source.indexOf(hook,target.bodyOpen+1);

  if(hookIndex<0 || hookIndex>=target.end){
    throw new Error(`${name} Back hook is not inside its function body.`);
  }

  if(hookIndex<=target.closeParen){
    throw new Error(`${name} Back hook was inserted inside the parameter list.`);
  }
}

function patchNavigation(){
  const file='src/navigation/AppNavigation.tsx';
  let source=read(file);

  if(!source.includes('useLayoutEffect')){
    source=source.replace(
      '  useEffect,\n  useMemo,',
      '  useEffect,\n  useLayoutEffect,\n  useMemo,'
    );
  }

  const old=`export function useRegisterBackControl(enabled = true) {
  const navigation = useAppNavigation();

  useEffect(() => {
    if (!enabled || !navigation) return;
    return navigation.registerBackControl();
  }, [enabled, navigation?.registerBackControl]);
}`;

  const next=`export function useRegisterBackControl(enabled = true) {
  const navigation = useAppNavigation();

  // Register before paint so the universal fallback never briefly appears
  // beside a screen-owned Back button.
  useLayoutEffect(() => {
    if (!enabled || !navigation) return;
    return navigation.registerBackControl();
  }, [enabled, navigation?.registerBackControl]);
}`;

  if(source.includes(old)){
    source=source.replace(old,next);
  }else if(!source.includes('Register before paint so the universal fallback never briefly appears')){
    throw new Error('Could not upgrade useRegisterBackControl to layout ownership.');
  }

  write(file,source);
  console.log('PASS — Back ownership registers before paint.');
}

function patchScreens(){
  const file='src/screens.tsx';
  let source=read(file);

  source=addImport(
    source,
    "import { COLORS, FONT, SHADOW, TYPE } from './theme';",
    "import { useRegisterBackControl } from './navigation/AppNavigation';",
    'screens navigation hook import'
  );

  const hooks={
    CountryScreen:"useRegisterBackControl(data.locationReturn !== 'home');",
    CityScreen:'useRegisterBackControl(true);',
    GlobalSearchScreen:'useRegisterBackControl(true);',
    KareebuAssistantScreen:'useRegisterBackControl(true);',
    LocationPickerScreen:'useRegisterBackControl(true);',
    WhereToScreen:'useRegisterBackControl(true);',
    ChooseRideScreen:'useRegisterBackControl(true);',
  };

  for(const [name,hook] of Object.entries(hooks)){
    source=insertHook(source,name,hook);
  }

  // Do not trust string presence alone. Prove every hook sits after the
  // complete parameter list and inside the body.
  for(const [name,hook] of Object.entries(hooks)){
    assertHookInsideBody(source,name,hook);
  }

  // Reject the exact malformed V7.4.2 signature pattern.
  if(/useRegisterBackControl\([^;]+;\s*data,\s*actions\s*}\s*:/.test(source)){
    throw new Error('Detected V7.4.2 malformed Back hook inside destructured parameters.');
  }

  write(file,source);
  console.log('PASS — custom Back owners in src/screens.tsx are registered inside function bodies.');
}

function patchFood(){
  const file='src/food/discovery/surfaces.tsx';
  if(!fs.existsSync(file)) return;
  let source=read(file);

  source=addImport(
    source,
    "import { formatMoney } from '../../locale';",
    "import { useRegisterBackControl } from '../../navigation/AppNavigation';",
    'Food surface navigation hook import'
  );

  source=insertHook(source,'SurfaceHeader','useRegisterBackControl(true);');
  assertHookInsideBody(source,'SurfaceHeader','useRegisterBackControl(true);');

  write(file,source);
  console.log('PASS — Food discovery custom header owns Back inside its body.');
}

function patchOnboarding(){
  const file='src/onboarding/KareebuLaunchGate.tsx';
  if(!fs.existsSync(file)) return;
  let source=read(file);

  if(!source.includes("from '../navigation/AppNavigation'")){
    const anchor="import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';";
    if(!source.includes(anchor)) throw new Error('Could not locate onboarding import anchor.');
    source=source.replace(
      anchor,
      `${anchor}\nimport { useRegisterBackControl } from '../navigation/AppNavigation';`
    );
  }

  source=insertHook(
    source,
    'OnboardingChrome',
    'useRegisterBackControl(Boolean(back));'
  );
  assertHookInsideBody(
    source,
    'OnboardingChrome',
    'useRegisterBackControl(Boolean(back));'
  );

  write(file,source);
  console.log('PASS — onboarding custom Back owns the fallback slot inside its body.');
}

patchNavigation();
patchScreens();
patchFood();
patchOnboarding();

console.log('PASS — Kareebu single-Back ownership patch complete with body-safe insertion.');
