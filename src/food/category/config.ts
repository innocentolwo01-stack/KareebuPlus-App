import type { ImageSourcePropType } from 'react-native';
import type { FoodCategoryLandingConfig, FoodCategoryBrand } from './types';
import { categoryLandingConfig } from '../../categoryLanding/registry';

const HERO_VISUALS:Record<string,ImageSourcePropType>={
 Offers:require('../../../assets/kareebu-plus/food-exact/categories/offers.png'),
 'New Additions':require('../../../assets/kareebu-plus/food-exact/categories/new-additions.png'),
 Pizza:require('../../../assets/kareebu-plus/food-exact/categories/pizza.png'),
 Burgers:require('../../../assets/kareebu-plus/food-exact/categories/burger.png'),
 Chicken:require('../../../assets/kareebu-plus/food-exact/categories/chicken-wings.png'),
 Healthy:require('../../../assets/kareebu-plus/food-exact/categories/healthy.png'),
 Breakfast:require('../../../assets/kareebu-plus/food-exact/categories/coffee.png'),
 Desserts:require('../../../assets/kareebu-plus/food-exact/categories/dessert.png'),
 Indian:require('../../../assets/kareebu-plus/food-exact/categories/indian.png'),
 African:require('../../../assets/kareebu-plus/food-exact/categories/catering.png'),
};

const MARKET_POPULAR_RESTAURANTS:Record<string,Array<Omit<FoodCategoryBrand,'market'|'referenceFixture'|'partnerStatus'|'liveAvailability'>>>={
 Uganda:[{id:'cafe-javas',name:'Café Javas',restaurantId:'cafe-javas'},{id:'chicken-tonight',name:'Chicken Tonight Uganda',restaurantId:'chicken-tonight'},{id:'java-house',name:'Java House Uganda',restaurantId:'java-house'},{id:'pizza-inn',name:'Pizza Inn',restaurantId:'pizza-inn'}],
 Kenya:[{id:'pizza-inn-ke',name:'Pizza Inn Kenya'},{id:'java-house-ke',name:'Java House Kenya',restaurantId:'java-house'},{id:'kfc-ke',name:'KFC Kenya'}],
 Tanzania:[{id:'mamboz-tz',name:'Mamboz'},{id:'pizza-hut-tz',name:'Pizza Hut Tanzania',image:require('../../../assets/kareebu-plus/home-brands/pizzahut.png')},{id:'kfc-tz',name:'KFC Tanzania'}],
};

const COPY:Record<string,{subtitle:string;editorial:string}>={
 Offers:{subtitle:'Current restaurant offers, when supplied.',editorial:'More restaurant offers'},
 'New Additions':{subtitle:'New restaurants appear when catalogue dates are available.',editorial:'New restaurant listings'},
 Pizza:{subtitle:'Restaurants that declare pizza as a speciality.',editorial:'More pizza restaurants'},
 Burgers:{subtitle:'Restaurants that declare burgers as a speciality.',editorial:'More burger restaurants'},
 Chicken:{subtitle:'Restaurants that declare chicken as a speciality.',editorial:'More chicken restaurants'},
 Healthy:{subtitle:'Restaurants that declare healthy food as a speciality.',editorial:'More healthy-food restaurants'},
 African:{subtitle:'Restaurants that declare African or local food as a speciality.',editorial:'More African-food restaurants'},
 Ugandan:{subtitle:'Restaurants that declare Ugandan or local food as a speciality.',editorial:'More Ugandan-food restaurants'},
 Kenyan:{subtitle:'Restaurants that declare Kenyan food as a speciality.',editorial:'More Kenyan-food restaurants'},
 Tanzanian:{subtitle:'Restaurants that declare Tanzanian food as a speciality.',editorial:'More Tanzanian-food restaurants'},
 Indian:{subtitle:'Restaurants that declare Indian food as a speciality.',editorial:'More Indian-food restaurants'},
 Breakfast:{subtitle:'Restaurants that declare breakfast or coffee as a speciality.',editorial:'More breakfast restaurants'},
 'Grills & BBQ':{subtitle:'Restaurants that declare grills or barbecue as a speciality.',editorial:'More grill restaurants'},
 Seafood:{subtitle:'Restaurants that declare seafood as a speciality.',editorial:'More seafood restaurants'},
 'Cafés & Coffee':{subtitle:'Restaurants that declare café or coffee as a speciality.',editorial:'More cafés and coffee shops'},
 'Desserts & Treats':{subtitle:'Restaurants that declare desserts as a speciality.',editorial:'More dessert restaurants'},
  'Fast Food':{subtitle:'Restaurants that declare fast food as a speciality.',editorial:'More fast-food restaurants'},
  'Local favourites':{subtitle:'Restaurants that declare Ugandan or local dishes as a speciality.',editorial:'More local-food restaurants'},
};

export function foodCategoryConfig(category:string,country:string,city:string,restaurantIds:string[]):FoodCategoryLandingConfig{
  const universal=categoryLandingConfig('food',category,country,city);
  const copy=COPY[category]??{subtitle:`Restaurants that declare ${category.toLowerCase()} as a speciality.`,editorial:`More ${category.toLowerCase()} restaurants`};
  const brands=(MARKET_POPULAR_RESTAURANTS[country]??MARKET_POPULAR_RESTAURANTS.Uganda).map(brand=>({...brand,market:country,referenceFixture:true as const,partnerStatus:'unknown' as const,liveAvailability:false as const}));
  const standardSections:FoodCategoryLandingConfig['sections']=[
    {id:'featured',type:'featured_seller',title:`Restaurants for ${category}`,restaurantIds:restaurantIds.slice(0,1),enabled:true,priority:100},
    {id:'brands',type:'brand_carousel',title:'Restaurants in this category',subtitle:'Official restaurant identities from the current catalogue',brands,enabled:true,priority:90},
    {id:'trending',type:'trending_sellers',title:`More ${category.toLowerCase()} restaurants`,subtitle:`Catalogue specialities matching ${category.toLowerCase()}`,restaurantIds:restaurantIds.slice(0,6),enabled:true,priority:80},
    {id:'editorial',type:'editorial_seller_carousel',title:copy.editorial,restaurantIds:restaurantIds.slice().reverse().slice(0,6),enabled:true,priority:70},
    {id:'all',type:'all_restaurants',title:'All Restaurants',restaurantIds,enabled:true,priority:10},
  ];
  const offerSections:FoodCategoryLandingConfig['sections']=[
    {id:'deals',type:'deal_grid',title:'Unmissable Deals',enabled:true,priority:110},
    {id:'featured',type:'featured_seller',title:'Featured Offers',restaurantIds:restaurantIds.slice(0,1),enabled:true,priority:100},
    {id:'more',type:'trending_sellers',title:'More Deals',subtitle:'Configured offers from restaurants in your market',restaurantIds:restaurantIds.slice(0,6),enabled:true,priority:80},
    {id:'all',type:'all_restaurants',title:'All Restaurants',restaurantIds,enabled:true,priority:10},
  ];
  const newSections:FoodCategoryLandingConfig['sections']=[
    {id:'new',type:'new_sellers',title:'Newly Dropped',subtitle:`New reference listings in ${city}`,restaurantIds:restaurantIds.slice().reverse().slice(0,6),enabled:true,priority:100},
    {id:'all',type:'all_restaurants',title:'All Restaurants',restaurantIds,enabled:true,priority:10},
  ];
  return {
    id:`food-category-${category.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${country.toLowerCase()}`,
    category,market:country,city,kind:universal.kind,search:universal.search,
    hero:{slot:`FOOD_CATEGORY_${category.toUpperCase().replace(/[^A-Z0-9]+/g,'_')}_HERO`,title:category,subtitle:copy.subtitle,creative:HERO_VISUALS[category]??HERO_VISUALS.African,category,market:country,enabled:true},
    filters:universal.filters,
    editorialTitle:copy.editorial,
    sections:universal.kind==='offers'?offerSections:universal.kind==='new-additions'?newSections:standardSections,
  };
}
