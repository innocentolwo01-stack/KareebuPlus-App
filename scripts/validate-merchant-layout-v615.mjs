import fs from 'node:fs';

const source = fs.readFileSync('src/screens.tsx','utf8');
let passed=0;
const checks=[];
function ok(condition,label){
  checks.push({condition,label});
  if(condition)passed+=1;
  console.log(`${condition?'PASS':'FAIL'} — ${label}`);
}
function between(start,end){
  const a=source.indexOf(start);
  const b=source.indexOf(end,a+start.length);
  return a>=0&&b>a?source.slice(a,b):'';
}
const restaurant=between('export function RestaurantScreen(', '\nexport function FoodItemScreen(');
const store=between('export function StorefrontScreen(', '\nexport function LocationPickerScreen(');

ok(source.includes('height*0.38'),'hero matches approved compact first-viewport ratio');
ok(source.includes('Math.max(330,Math.min(420'),'hero has approved phone bounds');
ok(source.includes('v615PlusPill'),'Kareebu Plus identity pill is present');
ok(source.includes('v615ActionRow'),'Schedule / group-order control row is present');
ok(source.includes('v615StatsPanel'),'three-column merchant stats panel is present');
ok(source.includes('v615OfferStrip'),'outlined offer strip is present');
ok(source.includes('v615MenuRow'),'approved flat menu-row system is present');
ok(source.includes('v615ProductRow'),'approved flat product-row system is present');
ok(source.includes('V615RestaurantDishPhoto'),'menu items use real dish photography');
ok(source.includes('V615StoreProductPhoto'),'store items use real retail/product photography');
ok(source.includes("breakfast: 'https://images.unsplash.com"),'dedicated breakfast photo is present');
ok(source.includes("wrap: 'https://images.unsplash.com"),'dedicated wrap/rolex-style photo is present');

ok(restaurant.includes('>Schedule<')||restaurant.includes("'Schedule'"),'restaurant has Schedule control');
ok(restaurant.includes('Group order'),'restaurant has Group order control');
ok(restaurant.includes('Price For One'),'restaurant has Price For One stat');
ok(restaurant.includes('Delivery Fee'),'restaurant has Delivery Fee stat');
ok(restaurant.includes('Deliver Now'),'restaurant has Deliver Now stat');
ok(restaurant.includes('Alert.alert'),'restaurant Schedule control is functional');
ok(restaurant.includes('Share.share'),'restaurant Group order is functional');
ok(restaurant.includes('styles.v615OfferStrip'),'restaurant uses approved offer strip');
ok(restaurant.includes('styles.v615MenuRow'),'restaurant uses approved menu rows');
ok(!restaurant.includes('styles.v614PlainInfoRow'),'restaurant old info-row hierarchy is removed');
ok(!restaurant.includes('styles.v614MenuRow'),'restaurant V6.14 menu rows are removed');

ok(store.includes('Group order'),'store has group-order control');
ok(store.includes('Minimum Order'),'store adapts middle stat semantically');
ok(store.includes('Delivery Fee'),'store has delivery-fee stat');
ok(store.includes('styles.v615StatsPanel'),'store shares approved three-column layout');
ok(store.includes('styles.v615OfferStrip'),'store shares approved offer strip');
ok(store.includes('styles.v615ProductRow'),'store uses approved product rows');
ok(!store.includes('styles.v614PlainInfoRow'),'store old info-row hierarchy is removed');
ok(!store.includes('styles.v614ProductRow'),'store V6.14 product rows are removed');

ok(source.includes('width:56,height:56'),'floating utility buttons retain approved 56px geometry');
ok(source.includes('width:104,height:104'),'merchant logo retains approved overlap geometry');
ok(!source.includes('StyleSheet.absoluteFillObject'),'unsupported React Native StyleSheet API remains absent');

console.log(`Kareebu+ V6.15 approved merchant-layout checks complete: ${passed}/${checks.length}.`);
if(checks.some((item)=>!item.condition))process.exit(1);
