import React from 'react';
import { Image, StyleProp, ImageStyle } from 'react-native';
import type { KareebuDomainId } from '../catalog/master/kareebuUnifiedCatalog';
import type { BrandIconSemantic } from '../components';
import { CategoryArtwork } from '../components/CategoryArtwork';
import { categoryVisual } from '../visuals/categoryVisuals';

/**
 * Discovery artwork now resolves through the canonical Kareebu semantic visual
 * registry. Legacy placeholder category assets are intentionally not referenced here.
 */
function visualKeyFor(title:string,domainId:KareebuDomainId):string|null{
  const v=title.toLowerCase();

  if(/offer|discount|member|saving/.test(v)) return 'shops.specialty';
  if(/dine|restaurant|fine dining|casual|rooftop|brunch|occasion|date night/.test(v)) return 'dineout.casual';

  if(/burger|sandwich|hot dog/.test(v)) return 'food.burgers';
  if(/pizza|italian/.test(v)) return 'food.pizza';
  if(/chicken|wing/.test(v)) return 'food.chicken';
  if(/dessert|cake|sweet|ice cream|pastr|donut/.test(v)) return 'food.dessert';
  if(/coffee|tea|breakfast/.test(v)) return 'food.coffee';
  if(/healthy|salad|vegan|vegetarian|diet|gluten|keto/.test(v)) return 'food.healthy';
  if(/biryani|indian|pakistan|rice|noodle|asian|african|ugandan|ethiopian|middle eastern|arabic|turkish|persian/.test(v)) return 'food.african';
  if(/buffet|family meal|group|party|meal/.test(v)) return 'dineout.brunch';

  if(/pharm|medicine|pain|cold|flu|cough|allergy|first aid|vaccine/.test(v)) return /pain/.test(v)?'pharmacy.pain-relief':/allergy/.test(v)?'pharmacy.allergy':/first aid/.test(v)?'pharmacy.first-aid':'pharmacy.cold-flu';
  if(/vitamin|supplement|omega|probiotic/.test(v)) return 'pharmacy.vitamins';
  if(/baby|nappy|diaper/.test(v)) return 'pharmacy.baby-care';
  if(/skin|beauty|makeup/.test(v)) return 'beauty.skincare';
  if(/fragrance|perfume/.test(v)) return 'beauty.fragrance';
  if(/hair|groom/.test(v)) return 'beauty.hair';
  if(/sport|fitness|running|yoga/.test(v)) return 'fashion.sportswear';

  if(/clean|deep clean|furniture clean/.test(v)) return 'home.cleaning';
  if(/laundry|wash|dry clean|iron/.test(v)) return 'home.laundry';
  if(/plumb|tap|pipe|drain|sink|toilet|water system/.test(v)) return 'home.plumbing';
  if(/electrical|power|socket|switch|light|solar|inverter|ups|generator/.test(v)) return 'home.electrical';
  if(/handyman|carpentry|assembly|mount|locksmith|paint|wall repair/.test(v)) return 'home.handyman';
  if(/appliance|ac |cooling|fridge|freezer|washer|dryer|oven|microwave/.test(v)) return 'electronics.appliances';
  if(/pest|cockroach|ant|bed bug|rodent|mosquito/.test(v)) return 'home.pest-control';
  if(/move|packer|storage|home living|home & living/.test(v)) return 'home.moving';

  if(/fruit|vegetable|fresh food|produce/.test(v)) return 'groceries.fresh';
  if(/dairy|egg|milk|yogurt/.test(v)) return 'groceries.dairy';
  if(/drink|water|juice|beverage/.test(v)) return 'groceries.drinks';
  if(/snack|crisp|chocolate/.test(v)) return 'groceries.snacks';
  if(/bakery|bread/.test(v)) return 'groceries.bakery';
  if(/grocery|pantry|frozen/.test(v)) return 'shops.supermarket';

  if(/women/.test(v)) return 'fashion.women';
  if(/men/.test(v)) return 'fashion.men';
  if(/shoe|footwear|trainer/.test(v)) return 'fashion.shoes';
  if(/bag|accessor|wallet|sunglass|belt|jewel|watch/.test(v)) return 'fashion.accessories';
  if(/fashion|clothing|dress|shirt|jean/.test(v)) return 'fashion.women';
  if(/gift|flower|celebration/.test(v)) return 'shops.giftsFlowers';
  if(/toy/.test(v)) return 'general.toys';
  if(/kids|children/.test(v)) return 'fashion.children';

  if(/mobile|phone/.test(v)) return 'electronics.phones';
  if(/comput|laptop|tablet|monitor|storage|network/.test(v)) return 'electronics.computing';
  if(/audio|headphone|earbud|speaker/.test(v)) return 'electronics.audio';
  if(/gaming|console|controller/.test(v)) return 'electronics.gaming';
  if(/tv|television/.test(v)) return 'electronics.tvs';
  if(/camera/.test(v)) return 'electronics.cameras';
  if(/tech|electronic/.test(v)) return 'electronics.phones';

  if(/spa|wellness/.test(v)) return 'services.goOut';
  if(/attraction|activity|cinema|event|theme park/.test(v)) return 'services.goOut';

  if(domainId==='groceries') return 'shops.supermarket';
  if(domainId==='electronics') return 'electronics.phones';
  if(domainId==='home-care') return 'home.cleaning';
  if(domainId==='fix') return 'home.handyman';
  if(domainId==='dineout'||domainId==='food') return 'dineout.casual';
  if(domainId==='shops') return 'shops.specialty';
  return null;
}

function fallbackVisualKey(fallback:BrandIconSemantic,domainId:KareebuDomainId){
  const bySemantic:Partial<Record<BrandIconSemantic,string>>={
    food:'commerce.restaurants',groceries:'commerce.groceries',pharmacies:'commerce.pharmacy',electronics:'commerce.electronics',
    shops:'commerce.fashion',homeCare:'commerce.home',fix:'home.handyman',forGood:'shops.giftsFlowers',dineout:'dineout.casual',
  };
  return bySemantic[fallback] ?? (domainId==='food'||domainId==='dineout'?'commerce.restaurants':domainId==='groceries'?'commerce.groceries':domainId==='electronics'?'commerce.electronics':domainId==='home-care'||domainId==='fix'?'commerce.home':'commerce.fashion');
}

export function DiscoveryArt({
  title,
  domainId,
  size=54,
  fallback='shops',
  style,
}:{
  title:string;
  domainId:KareebuDomainId;
  size?:number;
  fallback?:BrandIconSemantic;
  style?:StyleProp<ImageStyle>;
}){
  const key=visualKeyFor(title,domainId);
  const resolvedKey=key ?? fallbackVisualKey(fallback,domainId);
  const visual=categoryVisual(resolvedKey);
  if(visual.image) return <Image source={visual.image} resizeMode="cover" style={[{width:size,height:size,borderRadius:16},style]}/>;
  return <CategoryArtwork visualKey={resolvedKey} size="standard" style={style as any}/>;
}
