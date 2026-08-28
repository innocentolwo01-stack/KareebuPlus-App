import type { TaxonomyDomain, TaxonomyNode, TaxonomyNodeType, TaxonomyPath } from './types';

const rows: TaxonomyNode[] = [];
const rowIndexById = new Map<string, number>();

function mergeUnique(existing?: string[], incoming?: string[]) {
  if (!existing?.length) return incoming;
  if (!incoming?.length) return existing;
  return [...new Set([...existing, ...incoming])];
}

function defaultPromotionService(domain: TaxonomyDomain) {
  return domain === 'global' ? 'global'
    : domain === 'goout' ? 'goout'
    : domain === 'dineout' ? 'dineout'
    : domain === 'services' ? 'services'
    : domain === 'pharmacy' ? 'pharmacy'
    : domain === 'groceries' ? 'groceries'
    : 'shops';
}

function add(
  id: string,
  title: string,
  domain: TaxonomyDomain,
  type: TaxonomyNodeType,
  parentId: string | undefined,
  visualKey: string,
  description: string,
  options: Partial<TaxonomyNode> = {},
) {
  const existingIndex = rowIndexById.get(id);
  if (existingIndex !== undefined) {
    const existing = rows[existingIndex]!;
    const existingParent = existing.parentId ?? null;
    const incomingParent = parentId ?? null;
    if (existing.domain !== domain || existingParent !== incomingParent) {
      throw new Error(
        `Taxonomy ancestry conflict for ${id}: ` +
        `${existing.domain}/${existingParent ?? 'root'} vs ${domain}/${incomingParent ?? 'root'}`,
      );
    }

    // A node can first be declared as a child and later expanded into a branch.
    // Merge that declaration into one canonical row instead of registering it twice.
    rows[existingIndex] = {
      ...existing,
      id,
      slug: id.split('.').pop() ?? id,
      title,
      shortTitle: options.shortTitle ?? title,
      domain,
      type,
      parentId,
      visualKey,
      description,
      searchPlaceholder: options.searchPlaceholder ?? existing.searchPlaceholder,
      merchandisingProfile: options.merchandisingProfile ?? existing.merchandisingProfile,
      promotionService: options.promotionService ?? existing.promotionService,
      heroPlacement: options.heroPlacement ?? existing.heroPlacement,
      inlinePlacement: options.inlinePlacement ?? existing.inlinePlacement,
      productTerms: mergeUnique(existing.productTerms, options.productTerms),
      merchantCategories: mergeUnique(existing.merchantCategories, options.merchantCategories),
      brands: mergeUnique(existing.brands, options.brands),
      leaf: options.leaf ?? existing.leaf,
      productionStatus: options.productionStatus ?? existing.productionStatus,
    };
    return;
  }

  rowIndexById.set(id, rows.length);
  rows.push({
    id,
    slug: id.split('.').pop() ?? id,
    title,
    shortTitle: options.shortTitle ?? title,
    domain,
    type,
    parentId,
    visualKey,
    description,
    searchPlaceholder: options.searchPlaceholder ?? `Search ${title.toLowerCase()}`,
    merchandisingProfile: options.merchandisingProfile ?? 'high',
    promotionService: options.promotionService ?? defaultPromotionService(domain),
    heroPlacement: options.heroPlacement ?? 'LANDING_HERO',
    inlinePlacement: options.inlinePlacement ?? 'LANDING_INLINE_1',
    productTerms: options.productTerms,
    merchantCategories: options.merchantCategories,
    brands: options.brands,
    leaf: options.leaf,
    productionStatus: options.productionStatus ?? 'fixture-backed',
  });
}

function branch(
  domain: TaxonomyDomain,
  rootId: string,
  parentId: string | undefined,
  title: string,
  visualKey: string,
  description: string,
  children: Array<[string, string, string?, string[]?]>,
  options: Partial<TaxonomyNode> = {},
) {
  add(rootId, title, domain, parentId ? 'category' : 'vertical', parentId, visualKey, description, options);
  for (const [slug, childTitle, childVisual, terms] of children) {
    add(`${rootId}.${slug}`, childTitle, domain, 'subcategory', rootId, childVisual ?? `${domain}.${slug}`, `Explore ${childTitle.toLowerCase()}.`, { ...options, productTerms: terms });
  }
}

// -----------------------------------------------------------------------------
// Pharmacy & wellness — intentionally deep. Empty nodes can be suppressed by
// the runtime when a live merchant has no matching assortment.
// -----------------------------------------------------------------------------
add('pharmacy', 'Pharmacy & Wellness', 'pharmacy', 'vertical', undefined, 'commerce.pharmacy', 'Medicines, wellness, personal care and family health in one place.', { merchandisingProfile:'high', heroPlacement:'PHARMACY_HERO', inlinePlacement:'PHARMACY_WELLNESS', merchantCategories:['Pharmacy','Nutrition','Eye care'] });
branch('pharmacy','pharmacy.medicines','pharmacy','Medicines & Health','pharmacy.medicines','Browse everyday medicines and health essentials by need.',[
  ['pain-relief','Pain Relief','pharmacy.pain-relief',['pain','paracetamol','ibuprofen','headache']],
  ['cold-flu-cough','Cold, Flu & Cough','pharmacy.cold-flu',['cold','flu','cough','sore throat','congestion']],
  ['allergy-hayfever','Allergy & Hayfever','pharmacy.allergy',['allergy','hayfever','antihistamine']],
  ['digestive-health','Digestive Health','pharmacy.digestive',['digestive','heartburn','indigestion','constipation','diarrhoea']],
  ['headache-migraine','Headache & Migraine','pharmacy.pain-relief',['headache','migraine']],
  ['muscle-joint-care','Muscle & Joint Care','pharmacy.pain-relief',['muscle','joint','sprain','support']],
  ['skin-conditions','Skin Conditions','beauty.skincare',['skin','eczema','rash','acne']],
  ['eye-care','Eye Care','pharmacy.personal-care',['eye','lens','drops']],
  ['ear-care','Ear Care','pharmacy.personal-care',['ear','drops']],
  ['oral-health','Oral Health','pharmacy.personal-care',['oral','dental','mouth']],
  ['sleep-relaxation','Sleep & Relaxation','pharmacy.vitamins',['sleep','relaxation']],
  ['travel-health','Travel Health','pharmacy.first-aid',['travel','mosquito','rehydration']],
  ['first-aid','First Aid','pharmacy.first-aid',['first aid','plaster','bandage','antiseptic']],
  ['womens-health',"Women's Health",'pharmacy.womens-health',['women','feminine']],
  ['mens-health',"Men's Health",'pharmacy.mens-health',['men','grooming']],
  ['childrens-medicines',"Children's Medicines",'pharmacy.baby-care',['children','kids','baby']],
]);
branch('pharmacy','pharmacy.medicines.cold-flu-cough','pharmacy.medicines','Cold, Flu & Cough','pharmacy.cold-flu','Browse cold, flu and cough needs without losing pharmacy context.',[
  ['cold','Cold','pharmacy.cold-flu',['cold']],['flu','Flu','pharmacy.cold-flu',['flu']],['cough','Cough','pharmacy.cold-flu',['cough']],['dry-cough','Dry Cough','pharmacy.cold-flu',['dry cough']],['chesty-cough','Chesty Cough','pharmacy.cold-flu',['chesty cough']],['sore-throat','Sore Throat','pharmacy.first-aid',['sore throat','lozenge']],['nasal-congestion','Nasal Congestion','pharmacy.cold-flu',['congestion','nasal']]
]);
branch('pharmacy','pharmacy.medicines.digestive-health','pharmacy.medicines','Digestive Health','pharmacy.digestive','Digestive-health categories.',[
  ['heartburn','Heartburn','pharmacy.digestive',['heartburn']],['indigestion','Indigestion','pharmacy.digestive',['indigestion']],['constipation','Constipation','pharmacy.digestive',['constipation']],['diarrhoea','Diarrhoea','pharmacy.digestive',['diarrhoea']],['ibs-support','IBS Support','pharmacy.digestive',['ibs']]
]);
branch('pharmacy','pharmacy.medicines.first-aid','pharmacy.medicines','First Aid','pharmacy.first-aid','First-aid supplies and home-health essentials.',[
  ['dressings','Dressings','pharmacy.first-aid',['dressing']],['plasters','Plasters','pharmacy.first-aid',['plaster']],['antiseptic','Antiseptic','pharmacy.first-aid',['antiseptic']],['supports','Supports','pharmacy.pain-relief',['support','brace']]
]);
branch('pharmacy','pharmacy.vitamins-supplements','pharmacy','Vitamins & Supplements','pharmacy.vitamins','Daily wellness and supplement categories.',[
  ['multivitamins','Multivitamins','pharmacy.vitamins',['multivitamin']],['vitamin-d','Vitamin D','pharmacy.vitamins',['vitamin d']],['vitamin-c','Vitamin C','pharmacy.vitamins',['vitamin c']],['vitamin-b','Vitamin B','pharmacy.vitamins',['vitamin b']],['iron','Iron','pharmacy.vitamins',['iron']],['magnesium','Magnesium','pharmacy.vitamins',['magnesium']],['calcium','Calcium','pharmacy.vitamins',['calcium']],['omega-3','Omega 3','pharmacy.vitamins',['omega']],['joint-support','Joint Support','pharmacy.vitamins',['joint']],['energy','Energy','pharmacy.vitamins',['energy']],['immunity','Immunity','pharmacy.vitamins',['immune']],['digestive-support','Digestive Support','pharmacy.vitamins',['probiotic','digestive']],['womens-supplements',"Women's Supplements",'pharmacy.womens-health',['women']],['mens-supplements',"Men's Supplements",'pharmacy.mens-health',['men']],['childrens-vitamins',"Children's Vitamins",'pharmacy.baby-care',['children','kids']]
]);
branch('pharmacy','pharmacy.personal-care','pharmacy','Personal Care','pharmacy.personal-care','Everyday personal-care essentials.',[
  ['bath-body','Bath & Body','beauty.body',['body','bath']],['dental','Dental','pharmacy.personal-care',['dental','tooth']],['deodorants','Deodorants','pharmacy.personal-care',['deodorant']],['feminine-care','Feminine Care','pharmacy.womens-health',['feminine']],['mens-grooming',"Men's Grooming",'beauty.mens-grooming',['men','grooming']],['foot-care','Foot Care','pharmacy.personal-care',['foot']],['hand-care','Hand Care','pharmacy.personal-care',['hand']],['hair-removal','Hair Removal','pharmacy.personal-care',['hair removal']]
]);
branch('pharmacy','pharmacy.skincare','pharmacy','Skincare','beauty.skincare','Skincare from pharmacy and wellness sellers.',[
  ['cleansers','Cleansers','beauty.skincare',['cleanser']],['moisturisers','Moisturisers','beauty.skincare',['moisturiser']],['serums','Serums','beauty.skincare',['serum']],['sunscreen','Sunscreen','beauty.skincare',['sunscreen','spf']],['acne-care','Acne Care','beauty.skincare',['acne']],['dry-skin','Dry Skin','beauty.skincare',['dry skin']],['sensitive-skin','Sensitive Skin','beauty.skincare',['sensitive']]
]);
branch('pharmacy','pharmacy.haircare','pharmacy','Haircare','beauty.hair','Hair and scalp care.',[
  ['shampoo','Shampoo','beauty.hair',['shampoo']],['conditioner','Conditioner','beauty.hair',['conditioner']],['treatments','Treatments','beauty.hair',['hair treatment']],['hair-loss','Hair Loss','beauty.hair',['hair loss']],['scalp-care','Scalp Care','beauty.hair',['scalp']]
]);
branch('pharmacy','pharmacy.baby-child','pharmacy','Baby & Child','pharmacy.baby-care','Baby care, feeding and children’s health.',[
  ['baby-toiletries','Baby Toiletries','pharmacy.baby-care',['baby toiletry']],['nappies','Nappies','pharmacy.baby-care',['nappy','diaper']],['wipes','Wipes','pharmacy.baby-care',['wipe']],['feeding','Feeding','pharmacy.baby-care',['feeding']],['baby-skincare','Baby Skincare','pharmacy.baby-care',['baby skin']],['childrens-health',"Children's Health",'pharmacy.baby-care',['child','kids']]
]);
branch('pharmacy','pharmacy.home-health','pharmacy','Home Health','pharmacy.home-health','Home monitoring and wellness equipment where stocked.',[
  ['blood-pressure','Blood Pressure','pharmacy.first-aid',['blood pressure']],['diabetes-care','Diabetes Care','pharmacy.first-aid',['diabetes','glucose']],['thermometers','Thermometers','pharmacy.cold-flu',['thermometer']],['supports','Supports & Mobility','pharmacy.pain-relief',['support','mobility']],['monitoring','Home Health Monitoring','pharmacy.first-aid',['monitor']]
]);
add('pharmacy.sexual-wellness','Sexual Wellness','pharmacy','category','pharmacy','pharmacy.personal-care','Sexual-wellness products from approved pharmacy sellers.',{productTerms:['sexual wellness','condom','intimate care']});
add('pharmacy.fitness-nutrition','Fitness & Nutrition','pharmacy','category','pharmacy','pharmacy.vitamins','Fitness and nutrition products from approved pharmacy sellers.',{productTerms:['fitness','nutrition','protein','supplement']});

// Beauty
add('beauty','Beauty','beauty','vertical',undefined,'commerce.beauty','Makeup, skincare, hair, fragrance and personal care.',{merchandisingProfile:'high',heroPlacement:'BEAUTY_FEATURED'});
branch('beauty','beauty.makeup','beauty','Makeup','beauty.makeup','Makeup discovery by area and need.',[
  ['face','Face','beauty.makeup',['foundation','concealer','powder','blush','bronzer','highlighter','primer']],['eyes','Eyes','beauty.makeup',['mascara','eyeliner','eyeshadow']],['lips','Lips','beauty.makeup',['lipstick','lip gloss','lip']],['brows','Brows','beauty.makeup',['brow']],['tools','Tools & Brushes','beauty.makeup',['brush','sponge','tool']]
]);
branch('beauty','beauty.makeup.face','beauty.makeup','Face','beauty.makeup','Face makeup categories.',[
  ['foundation','Foundation','beauty.makeup',['foundation']],['concealer','Concealer','beauty.makeup',['concealer']],['powder','Powder','beauty.makeup',['powder']],['blush','Blush','beauty.makeup',['blush']],['bronzer','Bronzer','beauty.makeup',['bronzer']],['highlighter','Highlighter','beauty.makeup',['highlighter']],['primer','Primer','beauty.makeup',['primer']],['setting-spray','Setting Spray','beauty.makeup',['setting spray']]
]);
branch('beauty','beauty.skincare','beauty','Skincare','beauty.skincare','Build a skincare routine by product type.',[
  ['cleansers','Cleansers','beauty.skincare',['cleanser']],['toners','Toners','beauty.skincare',['toner']],['serums','Serums','beauty.skincare',['serum']],['moisturisers','Moisturisers','beauty.skincare',['moisturiser']],['sunscreen','Sunscreen','beauty.skincare',['sunscreen']],['masks','Masks','beauty.skincare',['mask']],['eye-care','Eye Care','beauty.skincare',['eye cream']],['acne-care','Acne Care','beauty.skincare',['acne']]
]);
branch('beauty','beauty.hair','beauty','Hair','beauty.hair','Haircare and styling.',[
  ['shampoo','Shampoo','beauty.hair',['shampoo']],['conditioner','Conditioner','beauty.hair',['conditioner']],['treatments','Treatments','beauty.hair',['treatment']],['styling','Styling','beauty.hair',['styling']],['hair-colour','Hair Colour','beauty.hair',['hair colour']],['scalp-care','Scalp Care','beauty.hair',['scalp']]
]);
branch('beauty','beauty.fragrance','beauty','Fragrance','beauty.fragrance','Discover fragrance by audience and format.',[
  ['women','Women’s Fragrance','beauty.fragrance',['women fragrance','perfume']],['men','Men’s Fragrance','beauty.fragrance',['men fragrance','cologne']],['unisex','Unisex','beauty.fragrance',['unisex fragrance']],['body-mist','Body Mist','beauty.fragrance',['body mist']],['gift-sets','Gift Sets','beauty.fragrance',['fragrance gift']]
]);
add('beauty.personal-care','Personal Care','beauty','category','beauty','beauty.body','Everyday body and personal care.',{productTerms:['body','personal care']});
add('beauty.tools','Beauty Tools','beauty','category','beauty','beauty.makeup','Brushes, tools and beauty accessories.',{productTerms:['brush','beauty tool']});

// Fashion
add('fashion','Fashion','fashion','vertical',undefined,'commerce.fashion','Clothing, footwear and accessories.',{merchandisingProfile:'high'});
branch('fashion','fashion.women','fashion','Women','fashion.women','Women’s fashion collections.',[
  ['dresses','Dresses','fashion.women',['dress']],['tops','Tops','fashion.women',['top','blouse']],['bottoms','Bottoms','fashion.women',['skirt','trouser']],['outerwear','Outerwear','fashion.women',['jacket','coat']],['activewear','Activewear','fashion.sportswear',['activewear']],['lingerie','Lingerie','fashion.women',['lingerie']],['shoes','Shoes','fashion.shoes',['shoe']],['bags','Bags','fashion.bags',['bag']],['accessories','Accessories','fashion.accessories',['accessory']]
]);
branch('fashion','fashion.women.dresses','fashion.women','Dresses','fashion.women','Shop dresses by occasion and length.',[
  ['mini','Mini Dresses','fashion.women',['mini dress']],['midi','Midi Dresses','fashion.women',['midi dress']],['maxi','Maxi Dresses','fashion.women',['maxi dress']],['occasion','Occasion Dresses','fashion.women',['occasion dress']],['workwear','Workwear Dresses','fashion.women',['work dress']]
]);
branch('fashion','fashion.men','fashion','Men','fashion.men','Men’s clothing and accessories.',[
  ['t-shirts','T-Shirts','fashion.men',['t-shirt']],['shirts','Shirts','fashion.men',['shirt']],['trousers','Trousers','fashion.men',['trouser']],['jeans','Jeans','fashion.men',['jean']],['outerwear','Outerwear','fashion.men',['jacket','coat']],['sportswear','Sportswear','fashion.sportswear',['sportswear']],['shoes','Shoes','fashion.shoes',['shoe']],['accessories','Accessories','fashion.accessories',['accessory']]
]);
add('fashion.kids','Kids','fashion','category','fashion','fashion.children','Children’s clothing and footwear.',{productTerms:['kids','children']});
add('fashion.shoes','Shoes','fashion','category','fashion','fashion.shoes','Footwear for everyday and sport.',{productTerms:['shoe','trainer','sneaker']});
add('fashion.bags','Bags','fashion','category','fashion','fashion.bags','Bags from fashion sellers.',{productTerms:['bag','handbag','backpack']});
add('fashion.jewellery-watches','Jewellery & Watches','fashion','category','fashion','fashion.accessories','Jewellery and watches from fashion sellers.',{productTerms:['jewellery','jewelry','watch']});
add('fashion.accessories','Accessories','fashion','category','fashion','fashion.accessories','Bags, watches, jewellery and accessories.',{productTerms:['bag','watch','jewellery','accessory']});
add('fashion.skincare','Skincare','fashion','category','fashion','beauty.skincare','Skincare from beauty sellers.',{productTerms:['skincare','cleanser','moisturiser','serum']});
add('fashion.makeup','Makeup','fashion','category','fashion','beauty.makeup','Makeup from beauty sellers.',{productTerms:['makeup','foundation','lipstick','mascara']});
add('fashion.haircare','Haircare','fashion','category','fashion','beauty.hair','Haircare from beauty sellers.',{productTerms:['haircare','shampoo','conditioner']});
add('fashion.fragrance','Fragrance','fashion','category','fashion','beauty.fragrance','Fragrance from beauty sellers.',{productTerms:['fragrance','perfume','cologne']});
add('fashion.beauty-tools','Beauty Tools','fashion','category','fashion','beauty.makeup','Beauty tools and accessories.',{productTerms:['beauty tool','brush','sponge']});
add('fashion.sportswear','Sportswear','fashion','category','fashion','fashion.sportswear','Performance and active clothing.',{productTerms:['sportswear','activewear']});

// Electronics
add('electronics','Electronics','electronics','vertical',undefined,'commerce.electronics','Phones, computing, audio, gaming and home electronics.',{merchandisingProfile:'high',heroPlacement:'ELECTRONICS_HERO'});
branch('electronics','electronics.phones','electronics','Phones','electronics.phones','Phones and mobile devices.',[
  ['smartphones','Smartphones','electronics.phones',['smartphone','iphone','android']],['feature-phones','Feature Phones','electronics.phones',['feature phone']],['refurbished','Refurbished Phones','electronics.phones',['refurbished phone']],['accessories','Phone Accessories','electronics.accessories',['case','charger','cable','screen protector','power bank']]
]);
branch('electronics','electronics.accessories','electronics','Mobile Accessories','electronics.accessories','Mobile accessories and charging.',[
  ['cases','Cases','electronics.accessories',['case']],['chargers','Chargers','electronics.power',['charger']],['cables','Cables','electronics.power',['cable']],['power-banks','Power Banks','electronics.power',['power bank']],['screen-protectors','Screen Protectors','electronics.accessories',['screen protector']],['car-accessories','Car Accessories','electronics.accessories',['car charger','car mount']]
]);
branch('electronics','electronics.computers','electronics','Computers','electronics.computing','Computers, tablets and networking.',[
  ['laptops','Laptops','electronics.computing',['laptop']],['desktops','Desktops','electronics.computing',['desktop']],['monitors','Monitors','electronics.computing',['monitor']],['tablets','Tablets','electronics.computing',['tablet']],['storage','Storage','electronics.computing',['ssd','storage']],['networking','Networking','electronics.computing',['router','network']],['accessories','Computer Accessories','electronics.accessories',['keyboard','mouse','adapter']]
]);
branch('electronics','electronics.audio','electronics','Audio','electronics.audio','Personal and home audio.',[
  ['headphones','Headphones','electronics.audio',['headphone']],['earbuds','Earbuds','electronics.audio',['earbud']],['speakers','Speakers','electronics.audio',['speaker']],['home-audio','Home Audio','electronics.audio',['soundbar','home audio']]
]);
branch('electronics','electronics.gaming','electronics','Gaming','electronics.gaming','Consoles, games and gaming accessories.',[
  ['consoles','Consoles','electronics.gaming',['console','playstation','xbox','switch']],['games','Games','electronics.gaming',['game']],['controllers','Controllers','electronics.gaming',['controller']],['headsets','Gaming Headsets','electronics.audio',['gaming headset']],['pc-gaming','PC Gaming','electronics.computing',['gaming pc','gaming laptop']],['accessories','Gaming Accessories','electronics.accessories',['gaming accessory']]
],{inlinePlacement:'ELECTRONICS_GAMING'});
add('electronics.tv','TV & Home Entertainment','electronics','category','electronics','electronics.tvs','TV and home entertainment.',{productTerms:['tv','television','soundbar']});
add('electronics.phone-accessories','Phone Accessories','electronics','category','electronics','electronics.accessories','Accessories for phones and mobile devices.',{productTerms:['phone case','charger','cable','screen protector','power bank']});
add('electronics.computer-accessories','Computer Accessories','electronics','category','electronics','electronics.accessories','Accessories for computers and workstations.',{productTerms:['keyboard','mouse','computer accessory','adapter']});
add('electronics.cameras','Cameras','electronics','category','electronics','electronics.computing','Cameras and imaging.',{productTerms:['camera']});
add('electronics.smart-home','Smart Home','electronics','category','electronics','electronics.appliances','Connected home products.',{productTerms:['smart home','camera','bulb']});
add('electronics.wearables','Wearables','electronics','category','electronics','electronics.phones','Smartwatches and wearable technology.',{productTerms:['watch','wearable']});
add('electronics.appliances','Appliances','electronics','category','electronics','electronics.appliances','Useful home appliances.',{productTerms:['appliance','kettle','microwave']});
add('electronics.kitchen-appliances','Kitchen Appliances','electronics','category','electronics','electronics.appliances','Kitchen appliances from electronics sellers.',{productTerms:['kitchen appliance','kettle','microwave','blender']});

// Groceries
add('groceries','Groceries','groceries','vertical',undefined,'commerce.groceries','Fresh food, pantry, household and everyday essentials.',{merchandisingProfile:'very-high',heroPlacement:'GROCERY_HERO'});
branch('groceries','groceries.fresh-produce','groceries','Fresh Produce','groceries.fresh','Fruit and vegetables.',[
  ['fruit','Fruit','groceries.fresh',['fruit','banana','apple']],['vegetables','Vegetables','groceries.fresh',['vegetable','tomato','cucumber']],['herbs','Herbs','groceries.fresh',['herb']]
]);
branch('groceries','groceries.fresh-produce.vegetables','groceries.fresh-produce','Vegetables','groceries.fresh','Shop vegetables by type and cooking need.',[
  ['leafy-greens','Leafy Greens','groceries.leafy-greens',['spinach','kale','greens','lettuce']],
  ['root-vegetables','Root Vegetables','groceries.root-vegetables',['carrot','beetroot','radish','root vegetable']],
  ['tomatoes','Tomatoes','groceries.tomatoes',['tomato']],
  ['onions-garlic-ginger','Onions, Garlic & Ginger','groceries.onions-garlic-ginger',['onion','garlic','ginger']],
  ['peppers-chillies','Peppers & Chillies','groceries.peppers',['pepper','chilli','chili']],
  ['salad-vegetables','Salad Vegetables','groceries.cucumber',['cucumber','lettuce','salad','courgette','zucchini']],
  ['fresh-herbs','Fresh Herbs','groceries.herbs',['herb','coriander','parsley','basil','mint']],
  ['mushrooms','Mushrooms','groceries.mushrooms',['mushroom']],
  ['ready-to-cook','Ready-to-Cook Vegetables','groceries.ready-to-cook',['prepared vegetables','mixed vegetables','ready to cook']],
],{merchandisingProfile:'very-high',inlinePlacement:'LANDING_INLINE_1'});
add('groceries.meat','Meat','groceries','category','groceries','groceries.meat-fish','Fresh meat.',{productTerms:['beef','goat','meat']});
add('groceries.chicken','Chicken','groceries','category','groceries','butchery.chicken','Chicken and poultry.',{productTerms:['chicken']});
add('groceries.fish-seafood','Fish & Seafood','groceries','category','groceries','butchery.fish','Fish and seafood.',{productTerms:['fish','seafood']});
branch('groceries','groceries.dairy','groceries','Dairy & Eggs','groceries.dairy','Milk, yoghurt, cheese and eggs.',[
  ['milk','Milk','groceries.dairy',['milk']],['yogurt','Yogurt','groceries.dairy',['yogurt','yoghurt']],['cheese','Cheese','groceries.dairy',['cheese']],['eggs','Eggs','groceries.dairy',['egg']]
]);
add('groceries.bakery','Bakery','groceries','category','groceries','groceries.bakery','Bread and bakery.',{productTerms:['bread','bakery']});
add('groceries.rice-pasta-pulses','Rice, Pasta & Pulses','groceries','category','groceries','groceries.cooking','Pantry staples.',{productTerms:['rice','pasta','beans','pulses']});
add('groceries.breakfast','Breakfast','groceries','category','groceries','food.breakfast','Breakfast essentials.',{productTerms:['cereal','breakfast']});
branch('groceries','groceries.coffee-tea','groceries','Coffee & Tea','food.coffee','Coffee, tea and hot drinks.',[
  ['coffee','Coffee','food.coffee',['coffee']],['tea','Tea','food.coffee',['tea']],['hot-chocolate','Hot Chocolate','food.coffee',['hot chocolate']]
]);
branch('groceries','groceries.beverages','groceries','Water & Beverages','groceries.drinks','Water, juices and soft drinks.',[
  ['water','Water','groceries.drinks',['water']],['juice','Juices','groceries.drinks',['juice']],['soft-drinks','Soft Drinks','groceries.drinks',['cola','soda','soft drink']]
]);
branch('groceries','groceries.snacks','groceries','Snacks','groceries.snacks','Sweet and savoury snacks.',[
  ['salty','Salty Snacks','groceries.snacks',['crisps','chips','salty']],['sweet','Sweet Snacks','groceries.snacks',['biscuit','sweet']],['chocolate','Chocolate','groceries.snacks',['chocolate']]
]);
add('groceries.frozen','Frozen','groceries','category','groceries','groceries.frozen','Frozen foods.',{productTerms:['frozen']});
branch('groceries','groceries.household','groceries','Household','groceries.household','Cleaning and home essentials.',[
  ['cleaning','Cleaning','groceries.household',['cleaning']],['laundry','Laundry','groceries.household',['laundry']],['paper','Paper & Tissue','groceries.household',['tissue','paper']]
]);
add('groceries.personal-care','Personal Care','groceries','category','groceries','groceries.personal-care','Personal care essentials.',{productTerms:['personal care','toiletry']});
add('groceries.baby','Baby','groceries','category','groceries','groceries.baby','Baby essentials.',{productTerms:['baby','nappy','wipe']});
add('groceries.pet','Pet Supplies','groceries','category','groceries','groceries.pet','Pet food and care.',{productTerms:['pet','dog','cat']});
add('groceries.health','Health','groceries','category','groceries','pharmacy.vitamins','Health and wellness essentials.',{productTerms:['vitamin','health']});
add('groceries.flowers','Flowers','groceries','category','groceries','shops.giftsFlowers','Flowers and gifting.',{productTerms:['flower','bouquet']});
add('groceries.special-offers','Special Offers','groceries','collection','groceries','shops.specialty','Configured supermarket offers.',{productTerms:[]});

// Pets and home
add('pets','Pet Supplies','pets','vertical',undefined,'shops.petSupplies','Food, care, toys and home pet essentials.',{merchandisingProfile:'medium',heroPlacement:'PET_FEATURED'});
branch('pets','pets.dogs','pets','Dogs','pets.dogs','Dog food, care and accessories.',[['food','Dog Food','pets.dogs',['dog food']],['treats','Dog Treats','pets.dogs',['dog treat']],['toys','Dog Toys','pets.dogs',['dog toy']],['grooming','Dog Grooming','pets.dogs',['dog grooming']],['health','Dog Health','pets.dogs',['dog health']]]);
branch('pets','pets.cats','pets','Cats','pets.cats','Cat food, litter and care.',[['food','Cat Food','pets.cats',['cat food']],['litter','Cat Litter','pets.cats',['cat litter']],['treats','Cat Treats','pets.cats',['cat treat']],['toys','Cat Toys','pets.cats',['cat toy']],['grooming','Cat Grooming','pets.cats',['cat grooming']]]);
add('pets.birds','Birds','pets','category','pets','pets.birds','Bird food and care.',{productTerms:['bird']});
add('pets.small-pets','Small Pets','pets','category','pets','pets.small-pets','Small-pet essentials.',{productTerms:['small pet']});

add('home','Home & Kitchen','home','vertical',undefined,'home.cleaning','Kitchen, storage, cleaning and home essentials.',{merchandisingProfile:'medium-high'});
for (const [slug,title,key,terms] of [
  ['kitchen','Kitchen','home.kitchen',['kitchen']],['storage','Storage','home.storage',['storage']],['decor','Decor','home.decor',['decor']],['bedding','Bedding','home.bedding',['bedding']],['bathroom','Bathroom','home.bathroom',['bathroom']],['lighting','Lighting','home.lighting',['lighting']],['appliances','Appliances','electronics.appliances',['appliance']],['cleaning','Cleaning','home.cleaning',['cleaning']],['garden','Garden','home.garden',['garden']],['diy','DIY','home.diy',['diy','tool']]
] as const) add(`home.${slug}`,title,'home','category','home',key,`Explore ${title.toLowerCase()}.`,{productTerms:[...terms]});

// Butchery / gifts
add('butchery','Butchery & Seafood','butchery','vertical',undefined,'shops.butcherySeafood','Fresh meat, poultry, fish and seafood.',{merchandisingProfile:'medium'});
for (const [slug,title,key,terms] of [['beef','Beef','butchery.beef',['beef']],['goat','Goat','butchery.goat',['goat']],['chicken','Chicken','butchery.chicken',['chicken']],['fish','Fish','butchery.fish',['fish']],['seafood','Seafood','butchery.seafood',['seafood']],['bbq','BBQ Picks','butchery.bbq',['bbq']]] as const) add(`butchery.${slug}`,title,'butchery','category','butchery',key,`Explore ${title.toLowerCase()}.`,{productTerms:[...terms]});
add('gifts','Gifts & Flowers','gifts','vertical',undefined,'shops.giftsFlowers','Flowers, hampers and gifts by occasion.',{merchandisingProfile:'medium'});
for (const [slug,title] of [['birthday','Birthday'],['anniversary','Anniversary'],['congratulations','Congratulations'],['thank-you','Thank You'],['new-baby','New Baby'],['just-because','Just Because'],['flowers','Flowers'],['hampers','Hampers'],['chocolates','Chocolates'],['cakes','Cakes']] as const) add(`gifts.${slug}`,title,'gifts','occasion','gifts',slug==='flowers'?'shops.giftsFlowers':'shops.specialty',`Discover ${title.toLowerCase()} gifts.`,{productTerms:[title.toLowerCase()]});

// GoOut / DineOut / Services
add('goout','GoOut','goout','vertical',undefined,'services.goOut','Activities, attractions, wellness and events.',{merchandisingProfile:'high',heroPlacement:'GOOUT_HERO'});
branch('goout','goout.spa-wellness','goout','Spa & Wellness','services.goOut','Spa and wellness experiences.',[
  ['massage','Massage','services.goOut',['massage']],['spa-days','Spa Days','services.goOut',['spa']],['beauty-treatments','Beauty Treatments','services.goOut',['beauty treatment']],['wellness','Wellness','services.goOut',['wellness']],['couples','Couples','services.goOut',['couples spa']],['hotel-spa','Hotel Spa','services.goOut',['hotel spa']]
],{inlinePlacement:'GOOUT_WELLNESS'});
for (const [slug,title] of [['attractions-leisure','Attractions & Leisure'],['theme-parks','Theme Parks & Fun'],['kids-activities','Kids Activities'],['cinema','Cinema'],['restaurants-dining','Restaurants & Dining'],['events','Events'],['nightlife','Nightlife'],['outdoor','Parks & Outdoors'],['sports','Sports & Recreation'],['museums-culture','Museums & Culture'],['experiences','Experiences'],['shopping-malls','Shopping & Malls'],['day-trips','Day Trips']] as const) add(`goout.${slug}`,title,'goout','activity_type','goout','services.goOut',`Discover configured ${title.toLowerCase()} in your city.`,{productTerms:[title.toLowerCase()],inlinePlacement:slug==='events'?'GOOUT_EVENT':'GOOUT_CATEGORY'});

add('dineout','DineOut','dineout','vertical',undefined,'dineout.casual','Restaurants by occasion, cuisine and area.',{merchandisingProfile:'high',heroPlacement:'DINEOUT_HERO'});
for (const [slug,title,type] of [['brunch','Brunch','occasion'],['casual','Casual Dining','occasion'],['premium','Premium','occasion'],['business-lunch','Business Lunch','occasion'],['family','Family','occasion'],['date-night','Date Night','occasion'],['buffets','Buffets','occasion'],['african','African','cuisine'],['ugandan','Ugandan','cuisine'],['kenyan','Kenyan','cuisine'],['tanzanian','Tanzanian','cuisine'],['indian','Indian','cuisine'],['italian','Italian','cuisine'],['chinese','Chinese','cuisine']] as const) add(`dineout.${slug}`,title,'dineout',type as TaxonomyNodeType,'dineout',slug==='brunch'?'dineout.brunch':slug==='premium'?'dineout.premium':'dineout.casual',`Discover ${title.toLowerCase()} dining.`,{productTerms:[title.toLowerCase()],inlinePlacement:slug==='brunch'?'DINEOUT_BRUNCH':'DINEOUT_CATEGORY'});

add('services','Home & Care','services','vertical',undefined,'services.homeCare','Home services and care.',{merchandisingProfile:'medium'});
branch('services','services.cleaning','services','Cleaning','home.cleaning','Home cleaning services.',[
  ['home-cleaning','Home Cleaning','home.cleaning',['home cleaning']],['deep-cleaning','Deep Cleaning','home.cleaning',['deep cleaning']],['sofa-cleaning','Sofa Cleaning','home.cleaning',['sofa cleaning']],['carpet-cleaning','Carpet Cleaning','home.cleaning',['carpet cleaning']]
]);
for (const [slug,title,key] of [['laundry','Laundry','home.laundry'],['handyman','Handyman','home.handyman'],['ac','AC Cleaning','home.ac'],['pest-control','Pest Control','home.pest-control'],['moving','Pack & Move','home.moving']] as const) add(`services.${slug}`,title,'services','category','services',key,`Explore ${title.toLowerCase()} services.`,{productTerms:[title.toLowerCase()]});

// Global — marketplace is a scope, department taxonomy remains reusable.
add('global','Kareebu Global','global','vertical',undefined,'global.shopping','Shop international marketplaces with a local-currency landed estimate.',{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_HERO'});
for (const marketplace of ['amazon','ebay','shein','temu','aliexpress','etsy'] as const) add(`global.marketplace.${marketplace}`, marketplace==='ebay'?'eBay':marketplace==='shein'?'SHEIN':marketplace==='aliexpress'?'AliExpress':marketplace.charAt(0).toUpperCase()+marketplace.slice(1), 'global','marketplace','global','global.shopping',`Browse ${marketplace} through Kareebu Global where supported.`,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_MARKETPLACE_PROMO',productTerms:[]});

for (const localDomain of ['electronics','beauty','fashion','home','pets'] as const) {
  const sourceRoot = rows.find(node=>node.id===localDomain)!;
  const globalRoot=`global.${localDomain}`;
  add(globalRoot,sourceRoot.title,'global','department','global',sourceRoot.visualKey,sourceRoot.description,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:[localDomain]});
  const sourceChildren=rows.filter(node=>node.parentId===localDomain);
  for(const source of sourceChildren){
    add(`${globalRoot}.${source.slug}`,source.title,'global','category',globalRoot,source.visualKey,source.description,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:source.productTerms});
    const grand=rows.filter(node=>node.parentId===source.id);
    for(const child of grand){
      add(`${globalRoot}.${source.slug}.${child.slug}`,child.title,'global','subcategory',`${globalRoot}.${source.slug}`,child.visualKey,child.description,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:child.productTerms});
      const great=rows.filter(node=>node.parentId===child.id);
      for(const leaf of great) add(`${globalRoot}.${source.slug}.${child.slug}.${leaf.slug}`,leaf.title,'global','child_category',`${globalRoot}.${source.slug}.${child.slug}`,leaf.visualKey,leaf.description,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:leaf.productTerms,leaf:true});
    }
  }
}
// High-intent Global brand landings. These are browse facets over the reference/live
// catalogue, not claims of direct brand partnership. Brand nodes remain true catalogue
// scopes, and major phone families can go one level deeper where the fixture/live data
// contains those model names.
for (const [slug,title,brand,terms] of [
  ['apple','Apple iPhone','Apple',['apple','iphone']],
  ['samsung','Samsung Galaxy','Samsung',['samsung','galaxy']],
  ['google','Google Pixel','Google',['google','pixel']],
  ['xiaomi','Xiaomi','Xiaomi',['xiaomi']],
  ['oneplus','OnePlus','OnePlus',['oneplus']],
  ['motorola','Motorola','Motorola',['motorola']],
  ['tecno','Tecno','Tecno',['tecno']],
  ['infinix','Infinix','Infinix',['infinix']],
  ['oppo','Oppo','Oppo',['oppo']],
  ['vivo','Vivo','Vivo',['vivo']],
  ['huawei','Huawei','Huawei',['huawei']],
  ['nokia','Nokia','Nokia',['nokia']],
] as const) add(`global.electronics.phones.smartphones.${slug}`,title,'global','brand','global.electronics.phones.smartphones','electronics.phones',`Browse ${title} smartphone listings across supported Global sources.`,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:[...terms],brands:[brand],leaf:!['apple','samsung','google'].includes(slug)});

for (const [slug,title,terms] of [
  ['iphone-16','iPhone 16 Series',['iphone 16']],
  ['iphone-15','iPhone 15 Series',['iphone 15']],
  ['iphone-14','iPhone 14 Series',['iphone 14']],
  ['iphone-se','iPhone SE',['iphone se']],
] as const) add(`global.electronics.phones.smartphones.apple.${slug}`,title,'global','child_category','global.electronics.phones.smartphones.apple','electronics.phones',`Browse ${title} listings across supported Global sources.`,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:[...terms],brands:['Apple'],leaf:true});

for (const [slug,title,terms] of [
  ['galaxy-s','Galaxy S Series',['galaxy s25','galaxy s24']],
  ['galaxy-a','Galaxy A Series',['galaxy a56','galaxy a36']],
  ['galaxy-z','Galaxy Z Foldables',['galaxy z flip','galaxy z fold']],
] as const) add(`global.electronics.phones.smartphones.samsung.${slug}`,title,'global','child_category','global.electronics.phones.smartphones.samsung','electronics.phones',`Browse ${title} listings across supported Global sources.`,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:[...terms],brands:['Samsung'],leaf:true});

for (const [slug,title,terms] of [
  ['pixel-9','Pixel 9 Series',['pixel 9']],
  ['pixel-8a','Pixel 8a',['pixel 8a']],
] as const) add(`global.electronics.phones.smartphones.google.${slug}`,title,'global','child_category','global.electronics.phones.smartphones.google','electronics.phones',`Browse ${title} listings across supported Global sources.`,{merchandisingProfile:'very-high',heroPlacement:'GLOBAL_CATEGORY_PROMO',productTerms:[...terms],brands:['Google'],leaf:true});

add('global.office-school','Office & School','global','department','global','electronics.computing','Study, stationery and workspace essentials.',{merchandisingProfile:'very-high',productTerms:['office','school','stationery']});
add('global.baby','Baby','global','department','global','pharmacy.baby-care','Baby and nursery essentials.',{merchandisingProfile:'very-high',productTerms:['baby']});


add('global.health-fitness','Health & Fitness','global','department','global','fashion.sportswear','Training, recovery and wellness products.',{merchandisingProfile:'very-high',productTerms:['fitness','sports','wellness','supplement']});
add('global.personal-care','Personal Care','global','department','global','beauty.personal-care','Everyday care and grooming.',{merchandisingProfile:'very-high',productTerms:['personal care','grooming']});
add('global.toys-games','Toys & Games','global','department','global','shops.specialty','Toys, games and creative play.',{merchandisingProfile:'very-high',productTerms:['toy','game']});
add('global.automotive','Automotive','global','department','global','electronics.accessories','Car accessories and everyday automotive tech.',{merchandisingProfile:'very-high',productTerms:['car','automotive']});
add('global.accessories','Accessories','global','department','global','fashion.accessories','Bags, watches and everyday accessories.',{merchandisingProfile:'very-high',productTerms:['accessory','bag','watch']});

const byId = new Map(rows.map(node=>[node.id,node]));

export type TaxonomyIntegrityIssue = {
  code: 'duplicate-id' | 'duplicate-child' | 'missing-parent' | 'cycle';
  nodeId: string;
  detail: string;
};

export const TAXONOMY_NODES: readonly TaxonomyNode[] = rows;
export const taxonomyNode = (id?: string | null) => id ? byId.get(id) : undefined;
export const taxonomyChildren = (id: string) => {
  const seen = new Set<string>();
  return rows.filter(node => {
    if (node.parentId !== id || seen.has(node.id)) return false;
    seen.add(node.id);
    return true;
  });
};

export function taxonomyIntegrityIssues(nodes: readonly TaxonomyNode[] = TAXONOMY_NODES): TaxonomyIntegrityIssue[] {
  const issues: TaxonomyIntegrityIssue[] = [];
  const ids = new Map<string, number>();
  const nodeById = new Map<string, TaxonomyNode>();

  for (const node of nodes) {
    ids.set(node.id, (ids.get(node.id) ?? 0) + 1);
    if (!nodeById.has(node.id)) nodeById.set(node.id, node);
  }

  for (const [id, count] of ids) {
    if (count > 1) issues.push({ code: 'duplicate-id', nodeId: id, detail: `${id} is registered ${count} times` });
  }

  const childrenByParent = new Map<string, Set<string>>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    if (!nodeById.has(node.parentId)) {
      issues.push({ code: 'missing-parent', nodeId: node.id, detail: `${node.id} references missing parent ${node.parentId}` });
      continue;
    }
    const children = childrenByParent.get(node.parentId) ?? new Set<string>();
    if (children.has(node.id)) {
      issues.push({ code: 'duplicate-child', nodeId: node.id, detail: `${node.id} appears more than once under ${node.parentId}` });
    }
    children.add(node.id);
    childrenByParent.set(node.parentId, children);
  }

  const reportedCycles = new Set<string>();
  for (const node of nodes) {
    const chain: string[] = [];
    const positions = new Map<string, number>();
    let current: TaxonomyNode | undefined = node;
    while (current) {
      const prior = positions.get(current.id);
      if (prior !== undefined) {
        const cycle = [...chain.slice(prior), current.id];
        const signature = [...new Set(cycle)].sort().join('|');
        if (!reportedCycles.has(signature)) {
          reportedCycles.add(signature);
          issues.push({ code: 'cycle', nodeId: current.id, detail: `Taxonomy cycle: ${cycle.join(' -> ')}` });
        }
        break;
      }
      positions.set(current.id, chain.length);
      chain.push(current.id);
      current = current.parentId ? nodeById.get(current.parentId) : undefined;
    }
  }

  return issues;
}
export const taxonomyRoot = (domain: TaxonomyDomain) => taxonomyNode(domain);
export const taxonomyLeaf = (id: string) => {
  const node=taxonomyNode(id);
  return Boolean(node?.leaf || taxonomyChildren(id).length===0);
};
export const taxonomyAncestors = (id: string) => {
  const ancestors: TaxonomyNode[]=[];
  let node=taxonomyNode(id);
  const seen=new Set<string>();
  while(node?.parentId && !seen.has(node.parentId)){
    seen.add(node.parentId);
    const parent=taxonomyNode(node.parentId);
    if(!parent)break;
    ancestors.unshift(parent);
    node=parent;
  }
  return ancestors;
};
export const taxonomyPath = (id: string): TaxonomyPath | undefined => {
  const node=taxonomyNode(id);
  if(!node)return undefined;
  const children=taxonomyChildren(id);
  return {node,ancestors:taxonomyAncestors(id),children,isLeaf:Boolean(node.leaf||children.length===0)};
};
export function normaliseTaxonomyId(domain: TaxonomyDomain, value?: string | null) {
  if(!value)return domain;
  if(byId.has(value))return value;
  const slug=value.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const exact=`${domain}.${slug}`;
  if(byId.has(exact))return exact;
  return domain;
}
export function taxonomyProductTerms(id: string) {
  const node=taxonomyNode(id);
  if(!node)return [];
  return node.productTerms?.length ? node.productTerms : [node.title.toLowerCase()];
}
export function globalProductCategoryForTaxonomy(id: string): string | undefined {
  const parts=id.split('.');
  if(parts[0]!=='global')return undefined;
  const department=parts[1];
  if(department==='electronics')return 'electronics';
  if(department==='beauty')return 'beauty';
  if(department==='fashion')return 'fashion';
  if(department==='home')return 'home';
  if(department==='pets')return 'pets';
  if(department==='baby')return 'kids';
  if(department==='office-school')return 'books';
  if(department==='health-fitness')return 'sports';
  if(department==='personal-care')return 'beauty';
  if(department==='toys-games')return 'kids';
  if(department==='automotive')return 'automotive';
  if(department==='accessories')return 'accessories';
  return undefined;
}
