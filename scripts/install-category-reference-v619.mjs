import fs from 'node:fs';

function replaceOnce(source,before,after,label){
  if(source.includes(after))return source;
  if(!source.includes(before))throw new Error(`Could not locate ${label}.`);
  return source.replace(before,after);
}

function cleanGenerated(value){
  return value.replaceAll('\\`','`');
}

function replaceFunction(source,name,nextName,replacement){
  const start=source.indexOf(`export function ${name}(`);
  if(start<0)throw new Error(`Could not locate ${name}.`);
  const end=source.indexOf(`\nexport function ${nextName}(`,start);
  if(end<0)throw new Error(`Could not locate end of ${name}.`);
  return source.slice(0,start)+replacement+source.slice(end);
}

function patchScreens(){
  const file='src/screens.tsx';
  let source=fs.readFileSync(file,'utf8');

  const marketplaceImport = "import { MarketplaceCategoryGrid, MarketplaceCategoryHeader, MarketplaceMembershipStrip, MarketplacePromoBanner, MarketplacePromoGrid, MarketplaceRecommendedRail, marketplaceSemanticForCategory } from './marketplace/MarketplaceCategoryChrome';";
  if (!source.includes(marketplaceImport)) {
    source=replaceOnce(
      source,
      "import { COLORS, FONT, SHADOW, TYPE } from './theme';",
      "import { COLORS, FONT, SHADOW, TYPE } from './theme';\n"+marketplaceImport,
      'marketplace category chrome import in screens',
    );
  }

  const start=source.indexOf('export function ShopsScreen(');
  const end=source.indexOf('\nfunction ParcelCard(',start);
  if(start<0||end<0)throw new Error('Could not isolate ShopsScreen.');

  const replacement=String.raw`export function ShopsScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [activeCategory, setActiveCategory] = useState(data.shopCategoryPreset || 'All');
  const [activeFilter, setActiveFilter] = useState('Offers');
  const [query,setQuery]=useState('');
  const countryStores = useMemo(() => localeStores(data.country, data.city), [data.country, data.city]);
  const availableCategories = useMemo(() => Array.from(new Set(countryStores.map((shop) => shop.category))), [countryStores]);
  const priority = ['Pharmacy','Beauty','Nutrition','Eye care','Pets','Groceries','Marketplace','Electronics','Home'];
  const categories = ['All', ...priority.filter((category)=>availableCategories.includes(category)), ...availableCategories.filter((category)=>!priority.includes(category))];
  const filtered = useMemo(()=>{
    const term=query.trim().toLowerCase();
    return countryStores.filter((shop)=>{
      const q=!term||\`${'${'}localisedStoreName(shop,data.country)} ${'${'}shop.category} ${'${'}shop.deal}\`.toLowerCase().includes(term);
      const c=activeCategory==='All'||shop.category===activeCategory;
      const f=activeFilter==='Offers'?Boolean(shop.deal):activeFilter==='Free delivery'?shop.deliveryFee===0:activeFilter==='Under 30 mins'?Number(shop.eta.split('–')[0])<30:activeFilter==='Rating 4.7+'?shop.rating>=4.7:true;
      return q&&c&&f;
    });
  },[query,activeCategory,activeFilter,countryStores,data.country]);
  const topStores=(activeCategory==='All'?countryStores:countryStores.filter((shop)=>shop.category===activeCategory)).slice(0,8);
  const tiles=categories.slice(0,8).map((label)=>({id:label,label,semantic:marketplaceSemanticForCategory(label)}));
  const recommended=topStores.slice(0,6).map((shop)=>({
    id:shop.id,
    name:localisedStoreName(shop,data.country),
    meta:\`${'${'}shop.rating.toFixed(1)} ★ · ${'${'}shop.eta}\`,
    semantic:marketplaceSemanticForCategory(shop.category),
  }));
  const currentPromoCategory=activeCategory==='All'?'Shops':activeCategory;

  return (
    <ScreenShell>
      <ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <MarketplaceCategoryHeader
          location={data.deliveryPlace?.name || \`${'${'}data.city}, ${'${'}data.country}\`}
          searchPlaceholder={activeCategory==='Pharmacy'?'Search medicines, pharmacies or wellness':'Type to search...'}
          searchValue={query}
          onSearchChange={setQuery}
          onBack={()=>actions.go('home')}
          onMenu={()=>actions.go('categories')}
          onLocation={()=>{actions.setLocationReturn('shops');actions.go('locationPicker')}}
        />

        <View style={{paddingHorizontal:14,paddingTop:2}}>
          <MarketplacePromoBanner category={currentPromoCategory} onPress={()=>setActiveFilter('Offers')}/>

          <MarketplaceRecommendedRail
            title={activeCategory==='All'?'Recommended Shops':\`Recommended ${'${'}activeCategory}\`}
            merchants={recommended}
            onPress={(id)=>{actions.selectShop(id);actions.go('shop')}}
          />

          <MarketplaceCategoryGrid
            tiles={tiles}
            selectedId={activeCategory}
            onPress={(id)=>{setActiveCategory(id);setActiveFilter('Offers')}}
          />

          <MarketplacePromoGrid category={currentPromoCategory} onPress={()=>setActiveFilter('Offers')}/>

          <View style={styles.v40SectionHeader}>
            <Text style={styles.v40SectionTitle}>{activeCategory==='All'?'Browse stores':\`Browse ${'${'}activeCategory.toLowerCase()}\`}</Text>
            <TextButton label="See all" onPress={()=>setActiveFilter('All stores')} color={COLORS.red}/>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40FilterRow}>
            {['Offers','Free delivery','Under 30 mins','Rating 4.7+'].map((filter)=><FilterChip key={filter} label={filter} active={activeFilter===filter} onPress={()=>setActiveFilter(activeFilter===filter?'All stores':filter)}/>)}
          </ScrollView>

          <View style={styles.v40ShopList}>
            {filtered.map((shop)=>{
              const favorite=data.favoriteShopIds.includes(shop.id);
              return <Pressable key={shop.id} onPress={()=>{actions.selectShop(shop.id);actions.go('shop')}} style={({pressed})=>[styles.v40ShopRow,pressed&&styles.v26CardPressed]}>
                <View style={styles.v40ShopRowLogo}><PopularStoreLogo store={shop}/></View>
                <View style={styles.flex}>
                  <View style={styles.v40ShopNameRow}><Text numberOfLines={1} style={styles.v40ShopName}>{localisedStoreName(shop,data.country)}</Text><Text style={styles.v40ShopRating}>{shop.rating.toFixed(1)} <Text style={styles.star}>★</Text></Text></View>
                  <Text style={styles.v40ShopMeta}>{shop.eta} · Minimum order {formatMoney(data.country,shop.minOrder)}</Text>
                  <View style={styles.v40ShopBadges}><View style={styles.v40ShopDeal}><Ionicons name="pricetag-outline" size={12} color={COLORS.black}/><Text numberOfLines={1} style={styles.v40ShopDealText}>{shop.deal}</Text></View>{shop.deliveryFee===0?<View style={styles.v40ShopFree}><Ionicons name="bicycle-outline" size={12} color={COLORS.green}/><Text style={styles.v40ShopFreeText}>FREE DELIVERY</Text></View>:null}</View>
                </View>
                <Pressable onPress={()=>actions.toggleFavoriteShop(shop.id)} style={styles.v40ShopHeart}><Ionicons name={favorite?'heart':'heart-outline'} size={21} color={favorite?COLORS.red:COLORS.muted}/></Pressable>
              </Pressable>
            })}
          </View>

          {filtered.length===0?<RoundedCard style={styles.v30EmptyState}><Ionicons name="bag-handle-outline" size={32} color={COLORS.muted}/><Text style={styles.v30EmptyTitle}>No stores match</Text><Text style={styles.v30EmptyBody}>Try another category, filter or search.</Text></RoundedCard>:null}

          <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
`;
  source=source.slice(0,start)+cleanGenerated(replacement)+source.slice(end);
  fs.writeFileSync(file,source);
  console.log('PASS — Shops category/subcategory experience now uses the supplied reference system.');
}

function patchFrontend(){
  const file='src/v41/frontend.tsx';
  let source=fs.readFileSync(file,'utf8');

  const frontendMarketplaceImport = "import { MarketplaceCategoryGrid, MarketplaceCategoryHeader, MarketplaceMembershipStrip, MarketplacePromoBanner, MarketplacePromoGrid, MarketplaceRecommendedRail, marketplaceSemanticForCategory } from '../marketplace/MarketplaceCategoryChrome';";
  if (!source.includes(frontendMarketplaceImport)) {
    source=replaceOnce(
      source,
      "import { formatMoney } from '../locale';",
      "import { formatMoney } from '../locale';\n"+frontendMarketplaceImport,
      'marketplace category chrome import in frontend',
    );
  }

  const merchantMap=`stores.map((store)=>({id:store.id,name:store.name,meta:\`${'${'}store.rating.toFixed(1)} ★ · ${'${'}store.eta}\`,semantic:marketplaceSemanticForCategory(store.type)}))`;
  const tiles=`categories.map((item)=>({id:item.id,label:item.name,semantic:marketplaceSemanticForCategory(item.name)}))`;

  const categoriesFn=String.raw`export function CategoriesScreen({ data, actions }: { data: V41FrontendData; actions: V41FrontendActions }) {
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
    <MarketplaceCategoryHeader location={\`${'${'}data.city}, ${'${'}data.country}\`} searchPlaceholder="Type to search..." onSearchPress={()=>actions.go('search')} onBack={()=>actions.go('home')} onMenu={()=>actions.go('allStores')} onLocation={()=>actions.go('locationPicker')}/>
    <View style={{paddingHorizontal:14}}>
      <MarketplacePromoBanner category="Shops" onPress={()=>actions.go('offers')}/>
      <MarketplaceRecommendedRail merchants={${merchantMap}} onPress={(id)=>actions.go(id==='javas'?'food':'shops')}/>
      <MarketplaceCategoryGrid tiles={${tiles}} onPress={()=>actions.go('categoryItems')}/>
      <MarketplacePromoGrid category="Shops" onPress={()=>actions.go('campaigns')}/>
      <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
    </View>
  </ScrollView></ScreenShell>;
}
`;

  const categoryFn=String.raw`export function CategoryItemsScreen({ data, actions }: { data: V41FrontendData; actions: V41FrontendActions }) {
  const [filter,setFilter]=useState('Popular');
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
    <MarketplaceCategoryHeader location={\`${'${'}data.city}, ${'${'}data.country}\`} searchPlaceholder="Search this category..." onSearchPress={()=>actions.go('search')} onBack={()=>actions.go('categories')} onMenu={()=>actions.go('categories')} onLocation={()=>actions.go('locationPicker')}/>
    <View style={{paddingHorizontal:14}}>
      <MarketplacePromoBanner category="Groceries" onPress={()=>setFilter('Offers')}/>
      <MarketplaceRecommendedRail title="Recommended Shops" merchants={${merchantMap}} onPress={()=>actions.go('shops')}/>
      <MarketplaceCategoryGrid tiles={${tiles}} selectedId="grocery" onPress={()=>actions.go('categoryItems')}/>
      <MarketplacePromoGrid category="Groceries" onPress={()=>setFilter('Offers')}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{['Popular','Top rated','Under 30 min','Offers'].map(x=><V41Chip key={x} label={x} active={filter===x} onPress={()=>setFilter(x)}/>)}</ScrollView>
      <SectionTitle title="Popular products"/>
      <View style={styles.productGrid}>{demoProducts.map(p=><ProductCard key={p.id} product={p} country={data.country} onPress={()=>actions.go('shops')}/>)}</View>
      <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
    </View>
  </ScrollView></ScreenShell>;
}
`;

  const brandsFn=String.raw`export function BrandsScreen({ data, actions }: { data: V41FrontendData; actions: V41FrontendActions }) {
  const brands=[['Capital Shoppers','Groceries'],['Goodlife','Pharmacy'],['Jumia','Marketplace'],['Cafe Javas','Food'],['Pizza Inn','Food'],['Kareebu Local','Shops']];
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
    <MarketplaceCategoryHeader location={\`${'${'}data.city}, ${'${'}data.country}\`} searchPlaceholder="Search brands..." onSearchPress={()=>actions.go('search')} onBack={()=>actions.go('home')} onMenu={()=>actions.go('categories')} onLocation={()=>actions.go('locationPicker')}/>
    <View style={{paddingHorizontal:14}}>
      <MarketplacePromoBanner category="Brands" onPress={()=>actions.go('offers')}/>
      <MarketplaceRecommendedRail title="Recommended brands" merchants={brands.map(([name,type],index)=>({id:String(index),name,semantic:marketplaceSemanticForCategory(type),meta:'Popular on Kareebu+'}))} onPress={()=>actions.go('brandItems')}/>
      <MarketplaceCategoryGrid tiles={${tiles}} onPress={()=>actions.go('categoryItems')}/>
      <MarketplacePromoGrid category="Shops" onPress={()=>actions.go('campaigns')}/>
      <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
    </View>
  </ScrollView></ScreenShell>;
}
`;

  const brandItemsFn=String.raw`export function BrandItemsScreen({ data, actions }: { data: V41FrontendData; actions: V41FrontendActions }) {
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
    <MarketplaceCategoryHeader location={\`${'${'}data.city}, ${'${'}data.country}\`} searchPlaceholder="Search Goodlife Pharmacy..." onSearchPress={()=>actions.go('search')} onBack={()=>actions.go('brands')} onMenu={()=>actions.go('categories')} onLocation={()=>actions.go('locationPicker')}/>
    <View style={{paddingHorizontal:14}}>
      <MarketplacePromoBanner category="Pharmacy" onPress={()=>actions.go('offers')}/>
      <MarketplaceRecommendedRail title="Recommended in health" merchants={${merchantMap}} onPress={()=>actions.go('shops')}/>
      <MarketplaceCategoryGrid tiles={${tiles}} selectedId="pharmacy" onPress={()=>actions.go('categoryItems')}/>
      <MarketplacePromoGrid category="Pharmacy" onPress={()=>actions.go('campaigns')}/>
      <SectionTitle title="Featured products"/>
      <View style={styles.productGrid}>{demoProducts.filter(p=>p.id==='wellness-pack').concat(demoProducts.slice(0,3)).map((p,i)=><ProductCard key={\`${'${'}p.id}-${'${'}i}\`} product={p} country={data.country} onPress={()=>actions.go('shops')}/>)}</View>
      <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
    </View>
  </ScrollView></ScreenShell>;
}
`;

  const allStoresFn=String.raw`export function AllStoresScreen({ data, actions }: { data: V41FrontendData; actions: V41FrontendActions }) {
  const [filter,setFilter]=useState('All');
  const visible=stores.filter(s=>filter==='All'||s.type.toLowerCase().includes(filter.toLowerCase())||(filter==='Food'&&s.type==='Restaurant'));
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
    <MarketplaceCategoryHeader location={\`${'${'}data.city}, ${'${'}data.country}\`} searchPlaceholder="Search stores and restaurants..." onSearchPress={()=>actions.go('search')} onBack={()=>actions.go('home')} onMenu={()=>actions.go('categories')} onLocation={()=>actions.go('locationPicker')}/>
    <View style={{paddingHorizontal:14}}>
      <MarketplacePromoBanner category={filter==='All'?'Shops':filter} onPress={()=>actions.go('offers')}/>
      <MarketplaceRecommendedRail title="Recommended Shops" merchants={${merchantMap}} onPress={(id)=>{const store=stores.find(s=>s.id===id);actions.go(store?.type==='Restaurant'?'food':'shops')}}/>
      <MarketplaceCategoryGrid tiles={${tiles}} onPress={()=>actions.go('categoryItems')}/>
      <MarketplacePromoGrid category={filter==='All'?'Shops':filter} onPress={()=>actions.go('campaigns')}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{['All','Food','Grocery','Pharmacy','Shopping'].map(x=><V41Chip key={x} label={x} active={filter===x} onPress={()=>setFilter(x)}/>)}</ScrollView>
      <View style={styles.storeList}>{visible.map(s=><StoreCard key={s.id} store={s} onPress={()=>actions.go(s.type==='Restaurant'?'food':'shops')}/>)}</View>
      <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
    </View>
  </ScrollView></ScreenShell>;
}
`;

  const itemViewFn=String.raw`export function ItemViewAllScreen({ data, actions }: { data: V41FrontendData; actions: V41FrontendActions }) {
  const [sort,setSort]=useState('Recommended');
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
    <MarketplaceCategoryHeader location={\`${'${'}data.city}, ${'${'}data.country}\`} searchPlaceholder="Search products..." onSearchPress={()=>actions.go('search')} onBack={()=>actions.go('home')} onMenu={()=>actions.go('categories')} onLocation={()=>actions.go('locationPicker')}/>
    <View style={{paddingHorizontal:14}}>
      <MarketplacePromoBanner category="Shops" onPress={()=>actions.go('offers')}/>
      <MarketplaceRecommendedRail merchants={${merchantMap}} onPress={()=>actions.go('shops')}/>
      <MarketplaceCategoryGrid tiles={${tiles}} onPress={()=>actions.go('categoryItems')}/>
      <MarketplacePromoGrid category="Shops" onPress={()=>actions.go('campaigns')}/>
      <View style={styles.rowBetween}><Text style={styles.resultCount}>48 items</Text><Pressable onPress={()=>setSort(sort==='Recommended'?'Price: low to high':sort==='Price: low to high'?'Top rated':'Recommended')} style={styles.sortButton}><Ionicons name="swap-vertical-outline" size={17}/><Text style={styles.sortText}>{sort}</Text></Pressable></View>
      <View style={styles.productGrid}>{[...demoProducts,...demoProducts].map((p,i)=><ProductCard key={\`${'${'}p.id}-${'${'}i}\`} product={p} country={data.country} onPress={()=>actions.go('shops')}/>)}</View>
      <MarketplaceMembershipStrip onPress={()=>actions.go('plusManage')}/>
    </View>
  </ScrollView></ScreenShell>;
}
`;

  source=replaceFunction(source,'CategoriesScreen','CategoryItemsScreen',cleanGenerated(categoriesFn));
  source=replaceFunction(source,'CategoryItemsScreen','BrandsScreen',cleanGenerated(categoryFn));
  source=replaceFunction(source,'BrandsScreen','BrandItemsScreen',cleanGenerated(brandsFn));
  source=replaceFunction(source,'BrandItemsScreen','CampaignsScreen',cleanGenerated(brandItemsFn));
  source=replaceFunction(source,'AllStoresScreen','ItemViewAllScreen',cleanGenerated(allStoresFn));
  source=replaceFunction(source,'ItemViewAllScreen','SearchFiltersScreen',cleanGenerated(itemViewFn));

  fs.writeFileSync(file,source);
  console.log('PASS — V4.1 category/subcategory/brand/store pages use the shared reference layout.');
}

function patchFoodSurfaces(){
  const file='src/food/discovery/surfaces.tsx';
  let source=fs.readFileSync(file,'utf8');

  const foodMarketplaceImport = "import { MarketplaceCategoryHeader, MarketplacePromoBanner, MarketplacePromoGrid, MarketplaceRecommendedRail } from '../../marketplace/MarketplaceCategoryChrome';";
  if (!source.includes(foodMarketplaceImport)) {
    source=replaceOnce(
      source,
      "import { formatMoney } from '../../locale';",
      "import { formatMoney } from '../../locale';\n"+foodMarketplaceImport,
      'food marketplace category chrome import',
    );
  }

  const start=source.indexOf('export function FoodListingSurface(');
  // V6.19.2: these filter helpers intentionally live between the listing
  // function and FoodFiltersSurface. Stop before them so changing the listing
  // UI never deletes the filter implementation.
  const end=source.indexOf('\nconst SORTS',start);
  if(start<0||end<0)throw new Error('Could not isolate FoodListingSurface before filter helpers.');

  const replacement=String.raw`export function FoodListingSurface({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const title = controller.surface.kind === 'listing' ? controller.surface.title : 'Restaurants';
  const recommended=controller.listingRestaurants.slice(0,6).map((restaurant)=>({
    id:restaurant.id,
    name:restaurant.name,
    meta:\`${'${'}restaurant.rating.toFixed(1)} ★ · ${'${'}restaurant.eta}\`,
    semantic:'food' as const,
  }));

  return (
    <View style={styles.root}>
      <ScrollView style={styles.flex} contentContainerStyle={{paddingBottom:34}} showsVerticalScrollIndicator={false}>
        <MarketplaceCategoryHeader
          location={\`${'${'}controller.document.market.city}, ${'${'}controller.document.market.country}\`}
          searchPlaceholder={\`Search ${'${'}title.toLowerCase()}...\`}
          onSearchPress={controller.actions.openSearch}
          onBack={controller.back}
          onMenu={controller.openFilters}
        />

        <View style={{paddingHorizontal:14}}>
          <MarketplacePromoBanner category="Food" onPress={()=>controller.openPromo()}/>

          <MarketplaceRecommendedRail
            title={\`Recommended ${'${'}title}\`}
            merchants={recommended}
            onPress={(id)=>controller.actions.openRestaurant(id)}
          />

          <MarketplacePromoGrid category="Food" onPress={()=>controller.actions.openOffers()}/>

          <View style={styles.listingSummary}>
            <Text style={styles.listingCount}>{controller.listingRestaurants.length} restaurant{controller.listingRestaurants.length === 1 ? '' : 's'}</Text>
            {controller.hasAdvancedFilters ? <Pressable onPress={controller.clearAdvancedFilters}><Text style={styles.clearLink}>Clear filters</Text></Pressable> : null}
          </View>

          {controller.listingRestaurants.length ? (
            <View style={styles.listCard}>
              {controller.listingRestaurants.map((restaurant) => <RestaurantRow key={restaurant.id} restaurant={restaurant} controller={controller} />)}
            </View>
          ) : (
            <Empty title="No restaurants found" body="Try clearing a filter or choosing another Food category." />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
`;

  source=source.slice(0,start)+cleanGenerated(replacement)+source.slice(end);
  fs.writeFileSync(file,source);
  console.log('PASS — Food category listing/subcategory pages use the same top header and promotion system.');
}

patchScreens();
patchFrontend();
patchFoodSurfaces();
