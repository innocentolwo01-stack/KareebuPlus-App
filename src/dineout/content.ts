import type { DineOutDiscoveryItem, DineOutMarketContent, DineOutRestaurant } from './types';

const media={
  hero:{image:require('../../assets/kareebu-plus/dineout/dineout-hero.jpg'),alt:'A welcoming restaurant dining room',source:'kareebu-owned',rightsStatus:'owned'},
  city:{image:require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'),alt:'Restaurant table with plated food',source:'kareebu-owned',rightsStatus:'owned'},
  local:{image:require('../../assets/kareebu-plus/dineout/restaurant-acacia-grill.jpg'),alt:'A plated restaurant meal',source:'kareebu-owned',rightsStatus:'owned'},
  grill:{image:require('../../assets/kareebu-plus/dineout/restaurant-kampala-bistro.jpg'),alt:'Restaurant grill dining',source:'kareebu-owned',rightsStatus:'owned'},
  cafe:{image:require('../../assets/kareebu-plus/food-exact/categories/coffee.png'),alt:'Cafe dining placeholder',source:'kareebu-owned',rightsStatus:'owned'},
  lakeside:{image:require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'),alt:'A plated restaurant meal',source:'kareebu-owned',rightsStatus:'owned'},
  brunch:{image:require('../../assets/kareebu-plus/dineout/editorial-weekend-brunch.jpg'),alt:'Weekend brunch table',source:'kareebu-owned',rightsStatus:'owned'},
  weekend:{image:require('../../assets/kareebu-plus/dineout/editorial-weekend-dining.jpg'),alt:'Weekend dining experience',source:'kareebu-owned',rightsStatus:'owned'},
  retreat:{image:require('../../assets/kareebu-plus/dineout/editorial-peaceful-retreats.jpg'),alt:'Peaceful restaurant terrace',source:'kareebu-owned',rightsStatus:'owned'},
} as const;

const categories:DineOutDiscoveryItem[]=[
  {id:'offers',title:'Offers',subtitle:'Configured dining savings',kind:'category',visualKey:'dineout.offers',query:'offers'},
  {id:'casual',title:'Casual Dining',subtitle:'Relaxed everyday places',kind:'category',visualKey:'dineout.casual',query:'casual'},
  {id:'premium',title:'Premium Dining',subtitle:'Elevated dining experiences',kind:'category',visualKey:'dineout.premium',query:'premium'},
  {id:'brunch',title:'Brunch',subtitle:'Slow mornings and weekends',kind:'category',visualKey:'dineout.brunch',query:'brunch'},
  {id:'buffets',title:'Buffets',subtitle:'A little of everything',kind:'category',visualKey:'dineout.buffet',query:'buffet'},
  {id:'business',title:'Business Lunch',subtitle:'Lunch that works',kind:'category',visualKey:'dineout.business',query:'business'},
  {id:'date-night',title:'Date Night',subtitle:'Places for two',kind:'category',visualKey:'dineout.dateNight',query:'date night'},
  {id:'family',title:'Family Dining',subtitle:'Tables for everyone',kind:'category',visualKey:'dineout.family',query:'family'},
];
const cuisine=(id:string,title:string,visualKey:string):DineOutDiscoveryItem=>({id,title,subtitle:`Discover ${title} dining`,kind:'cuisine',visualKey,query:title});
const baseCuisines=[cuisine('african','African','food.african'),cuisine('indian','Indian','food.indian'),cuisine('italian','Italian','food.pizza'),cuisine('steak','Steak & Grill','food.grill'),cuisine('healthy','Healthy','food.healthy'),cuisine('coffee','Coffee & Dessert','food.breakfast')];
const guide=(id:string,title:string,subtitle:string,image:keyof typeof media):DineOutDiscoveryItem=>({id,title,subtitle,kind:'guide',image:media[image],query:id});
const guides=[guide('new','New restaurants to try','Fresh names and newly configured venues','city'),guide('best-brunch','Best brunches','Make a weekend morning of it','brunch'),guide('date-night','Date-night restaurants','Atmosphere worth planning for','weekend'),guide('outdoor','Outdoor dining','Terraces, gardens and open-air tables','retreat')];

function restaurant(id:string,name:string,city:string,area:string,cuisines:string[],hero:keyof typeof media,tags:string[],coordinates:{latitude:number;longitude:number},source:string):DineOutRestaurant{return{id,name,city,area,cuisines,priceLevel:'$$',hero:media[hero],gallery:[media[hero],media.grill,media.local],logo:undefined,rating:undefined,reviewCount:undefined,ratingIsLive:false,openingHours:undefined,availability:'unknown',offers:[],kareebuPlus:false,reservationSupport:'enquiry',amenities:['Dine-in','Directions','Contact restaurant'],editorialTags:tags,coordinates,referenceFixture:true,partnerStatus:'unknown',liveAvailability:false,source,lastVerifiedAt:'2026-08-17'}}

const highlights=[
  {id:'editors-pick',label:"Editor's Pick",query:'premium'},
  {id:'new',label:'New on Kareebu',query:'new'},
  {id:'date-night',label:'Date Night',query:'date night'},
  {id:'family',label:'Family Dining',query:'family'},
];

const MARKET:Record<string,DineOutMarketContent>={
  Uganda:{country:'Uganda',city:'Kampala',currency:'UGX',areas:['Kololo','Bugolobi','Ntinda','Muyenga','Kisementi','Kampala CBD'],categories,cuisines:[cuisine('ugandan','Ugandan','food.ugandan'),...baseCuisines],guides,restaurants:[
    restaurant('ug-cafe-javas','Cafe Javas','Kampala','Kisementi',['Cafe','International','Breakfast'],'cafe',['casual','brunch','family','new'],{latitude:.3476,longitude:32.5825},'https://cafejavas.co.ug/'),
    restaurant('ug-kololo-table','Kololo Table','Kampala','Kololo',['African','Contemporary'],'local',['premium','date night','african'],{latitude:.338,longitude:32.595},'Kareebu reference fixture'),
    restaurant('ug-acacia-grill','Acacia Grill','Kampala','Kisementi',['Steak & Grill','African'],'grill',['casual','business','steak'],{latitude:.35,longitude:32.585},'Kareebu reference fixture'),
    restaurant('ug-lakeside','Lakeside Dining','Kampala','Muyenga',['International','Seafood'],'lakeside',['premium','outdoor','date night'],{latitude:.29,longitude:32.61},'Kareebu reference fixture'),
  ],highlights,savings:[]},
  Kenya:{country:'Kenya',city:'Nairobi',currency:'KES',areas:['Westlands','Kilimani','Karen','Nairobi CBD','Lavington','Gigiri'],categories,cuisines:[cuisine('kenyan','Kenyan','food.kenyan'),...baseCuisines],guides,restaurants:[
    restaurant('ke-artcaffe','Artcaffé','Nairobi','Westlands',['Cafe','International','Breakfast'],'cafe',['casual','brunch','family','new'],{latitude:-1.267,longitude:36.81},'https://artcaffe.co.ke/pages/locations'),
    restaurant('ke-westlands-table','Westlands Table','Nairobi','Westlands',['Contemporary','International'],'city',['premium','business','date night'],{latitude:-1.263,longitude:36.802},'Kareebu reference fixture'),
    restaurant('ke-karen-grill','Karen Grill','Nairobi','Karen',['Steak & Grill','African'],'grill',['casual','family','steak'],{latitude:-1.319,longitude:36.708},'Kareebu reference fixture'),
    restaurant('ke-kilimani-brunch','Kilimani Brunch Room','Nairobi','Kilimani',['Breakfast','Healthy'],'brunch',['brunch','healthy','new'],{latitude:-1.292,longitude:36.785},'Kareebu reference fixture'),
  ],highlights,savings:[]},
  Tanzania:{country:'Tanzania',city:'Dar es Salaam',currency:'TZS',areas:['Masaki','Oyster Bay','Mikocheni','City Centre','Msasani','Mbezi'],categories,cuisines:[cuisine('tanzanian','Tanzanian','food.tanzanian'),...baseCuisines],guides,restaurants:[
    restaurant('tz-masaki-table','Masaki Table','Dar es Salaam','Masaki',['International','Seafood'],'lakeside',['premium','date night','outdoor'],{latitude:-6.754,longitude:39.278},'Kareebu reference fixture'),
    restaurant('tz-oyster-bay-grill','Oyster Bay Grill','Dar es Salaam','Oyster Bay',['Steak & Grill','African'],'grill',['casual','business','steak'],{latitude:-6.77,longitude:39.283},'Kareebu reference fixture'),
    restaurant('tz-mikocheni-cafe','Mikocheni Cafe','Dar es Salaam','Mikocheni',['Cafe','Breakfast'],'cafe',['brunch','family','new'],{latitude:-6.766,longitude:39.229},'Kareebu reference fixture'),
    restaurant('tz-city-kitchen','Dar City Kitchen','Dar es Salaam','City Centre',['Tanzanian','African'],'local',['african','casual','local'],{latitude:-6.816,longitude:39.289},'Kareebu reference fixture'),
  ],highlights,savings:[]},
};

export function dineOutContent(country:string,city:string):DineOutMarketContent{const base=MARKET[country]??MARKET.Uganda!;return{...base,city:city||base.city,restaurants:base.restaurants.map(item=>({...item,city:city||base.city}))}}
