import React from 'react';
import { Image, StyleProp, ImageStyle } from 'react-native';
import type { KareebuDomainId } from '../catalog/master/kareebuUnifiedCatalog';
import { BrandIcon, type BrandIconSemantic } from '../components';

const ART = {
  groceries:require('../../assets/kareebu-plus/discovery-3d/groceries.png'),
  fashion:require('../../assets/kareebu-plus/discovery-3d/fashion.png'),
  pharmacy:require('../../assets/kareebu-plus/discovery-3d/pharmacy.png'),
  electronics:require('../../assets/kareebu-plus/discovery-3d/electronics.png'),
  flowers:require('../../assets/kareebu-plus/discovery-3d/flowers.png'),
  beauty:require('../../assets/kareebu-plus/discovery-3d/beauty.png'),
  toys:require('../../assets/kareebu-plus/discovery-3d/toys.png'),
  fashionAccessories:require('../../assets/kareebu-plus/discovery-3d/fashion-accessories.png'),

  cleaning:require('../../assets/kareebu-plus/discovery-3d/cleaning.png'),
  laundry:require('../../assets/kareebu-plus/discovery-3d/laundry.png'),
  plumbing:require('../../assets/kareebu-plus/discovery-3d/plumbing.png'),
  electrical:require('../../assets/kareebu-plus/discovery-3d/electrical.png'),
  handyman:require('../../assets/kareebu-plus/discovery-3d/handyman.png'),
  maintenance:require('../../assets/kareebu-plus/discovery-3d/maintenance.png'),
  appliances:require('../../assets/kareebu-plus/discovery-3d/appliances.png'),
  pest:require('../../assets/kareebu-plus/discovery-3d/pest-control.png'),

  burger:require('../../assets/kareebu-plus/discovery-3d/burger.png'),
  pizza:require('../../assets/kareebu-plus/discovery-3d/pizza.png'),
  chicken:require('../../assets/kareebu-plus/discovery-3d/fried-chicken.png'),
  dessert:require('../../assets/kareebu-plus/discovery-3d/dessert.png'),
  coffee:require('../../assets/kareebu-plus/discovery-3d/coffee.png'),
  healthy:require('../../assets/kareebu-plus/discovery-3d/healthy-food.png'),
  biryani:require('../../assets/kareebu-plus/discovery-3d/biryani.png'),
  buffet:require('../../assets/kareebu-plus/discovery-3d/buffet.png'),

  medicines:require('../../assets/kareebu-plus/discovery-3d/medicines.png'),
  healthCover:require('../../assets/kareebu-plus/discovery-3d/health-cover.png'),
  doctor:require('../../assets/kareebu-plus/discovery-3d/doctor.png'),
  hospital:require('../../assets/kareebu-plus/discovery-3d/hospital.png'),
  supplements:require('../../assets/kareebu-plus/discovery-3d/supplements.png'),
  babyCare:require('../../assets/kareebu-plus/discovery-3d/baby-care.png'),
  personalCare:require('../../assets/kareebu-plus/discovery-3d/personal-care.png'),
  fitness:require('../../assets/kareebu-plus/discovery-3d/fitness.png'),

  offers:require('../../assets/kareebu-plus/discovery-3d/offers.png'),
  dineout:require('../../assets/kareebu-plus/discovery-3d/dineout.png'),
  entertainment:require('../../assets/kareebu-plus/discovery-3d/entertainment.png'),
  local:require('../../assets/kareebu-plus/discovery-3d/local-discovery.png'),
  healthCard:require('../../assets/kareebu-plus/discovery-3d/health-card.png'),
  support:require('../../assets/kareebu-plus/discovery-3d/support.png'),
  profile:require('../../assets/kareebu-plus/discovery-3d/profile.png'),
  settings:require('../../assets/kareebu-plus/discovery-3d/settings.png'),
} as const;

type ArtKey=keyof typeof ART;

function artKeyFor(title:string,domainId:KareebuDomainId):ArtKey|null{
  const v=title.toLowerCase();

  if(/offer|discount|member|saving/.test(v)) return 'offers';
  if(/dine|restaurant|fine dining|casual|rooftop|brunch|occasion|date night/.test(v)) return 'dineout';

  if(/burger|sandwich|hot dog/.test(v)) return 'burger';
  if(/pizza|italian/.test(v)) return 'pizza';
  if(/chicken|wing/.test(v)) return 'chicken';
  if(/dessert|cake|sweet|ice cream|pastr|donut/.test(v)) return 'dessert';
  if(/coffee|tea|breakfast/.test(v)) return 'coffee';
  if(/healthy|salad|vegan|vegetarian|diet|gluten|keto/.test(v)) return 'healthy';
  if(/biryani|indian|pakistan|rice|noodle|asian|african|ugandan|ethiopian|middle eastern|arabic|turkish|persian/.test(v)) return 'biryani';
  if(/buffet|family meal|group|party|meal/.test(v)) return 'buffet';

  if(/pharm|medicine|pain|cold|allergy|first aid|vaccine/.test(v)) return 'medicines';
  if(/vitamin|supplement|omega|probiotic/.test(v)) return 'supplements';
  if(/doctor|therapy|lab|test|diagnostic/.test(v)) return 'doctor';
  if(/hospital|clinic|healthcare/.test(v)) return 'hospital';
  if(/baby|nappy|diaper/.test(v)) return 'babyCare';
  if(/skin|beauty|salon|spa|makeup|fragrance|personal care|groom/.test(v)) return 'beauty';
  if(/sport|fitness|running|yoga/.test(v)) return 'fitness';

  if(/clean|deep clean|furniture clean/.test(v)) return 'cleaning';
  if(/laundry|wash|dry clean|iron/.test(v)) return 'laundry';
  if(/plumb|tap|pipe|drain|sink|toilet|water system/.test(v)) return 'plumbing';
  if(/electrical|power|socket|switch|light|solar|inverter|ups|generator/.test(v)) return 'electrical';
  if(/handyman|carpentry|assembly|mount|locksmith|paint|wall repair/.test(v)) return 'handyman';
  if(/appliance|ac |cooling|fridge|freezer|washer|dryer|oven|microwave/.test(v)) return 'appliances';
  if(/pest|cockroach|ant|bed bug|rodent|mosquito/.test(v)) return 'pest';
  if(/move|packer|storage|home living|home & living/.test(v)) return 'maintenance';

  if(/grocery|fresh food|fruit|vegetable|dairy|egg|bakery|pantry|snack|drink|frozen/.test(v)) return 'groceries';
  if(/fashion|women|men|footwear|clothing|dress|shirt|jean/.test(v)) return 'fashion';
  if(/bag|accessor|wallet|sunglass|belt/.test(v)) return 'fashionAccessories';
  if(/gift|flower|celebration/.test(v)) return 'flowers';
  if(/toy|kids/.test(v)) return 'toys';

  if(/mobile|phone|comput|laptop|tablet|audio|headphone|earbud|wearable|watch|tv|gaming|camera|network|storage|smart home|cctv|tech/.test(v)) return 'electronics';
  if(/book|entertainment|game|creative/.test(v)) return 'entertainment';
  if(/nearby|local|location/.test(v)) return 'local';

  if(domainId==='groceries') return 'groceries';
  if(domainId==='electronics') return 'electronics';
  if(domainId==='home-care') return 'cleaning';
  if(domainId==='fix') return 'handyman';
  if(domainId==='dineout'||domainId==='food') return 'dineout';
  if(domainId==='shops') return 'fashionAccessories';
  return null;
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
  const key=artKeyFor(title,domainId);
  if(!key) return <BrandIcon semantic={fallback} size={size}/>;
  return <Image source={ART[key]} resizeMode="contain" style={[{width:size,height:size},style]}/>;
}
