import React, { memo, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DemoShop } from '../demoData';
import { CategoryArtwork, KareebuSearchField } from '../components';
import type { SearchContext } from '../search/context';
import { formatMoney } from '../locale';
import type { CommerceCartLine } from '../parity/types';
import type { PromotionCampaign } from '../promotions/types';
import { PromotionSurface } from '../promotions/PromotionSurface';
import { COLORS, FONT, RADIUS, SHADOW, SPACE, TYPE } from '../theme';
import type { CommerceProduct } from './catalog';
import { MerchantCampaignBanner } from './MerchantCampaignBanner';
import { commerceProductVisual } from './productVisuals';
import { SellerLogo } from './SellerLogo';
import { useRegisterBackControl } from '../navigation/AppNavigation';
import {
  buildMerchantStorefrontPlan,
  merchantBrowseFacets,
  productsForMerchantCategory,
  productsForMerchantFacet,
  storefrontCategoryById,
  type MerchantBrowseFacet,
  type MerchantCategory,
  type MerchantStorefrontPlan,
  type StorefrontModule,
} from './merchantStorefront';

export type MerchantStorefrontScreenProps = {
  country: string;
  city: string;
  store: DemoShop;
  storeName: string;
  products: CommerceProduct[];
  cartLines: CommerceCartLine[];
  favourite: boolean;
  activeCategoryId?: string | null;
  searchContext: SearchContext;
  onBack: () => void;
  onInfo: () => void;
  onToggleFavourite: () => void;
  onOpenProduct: (product: CommerceProduct) => void;
  onOpenCategory: (category: MerchantCategory) => void;
  onQuickAdd: (product: CommerceProduct) => void;
  onOpenCart: () => void;
  onOpenPromotion: (campaign: PromotionCampaign, plan: MerchantStorefrontPlan) => void;
};

function quantityFor(productId: string, lines: CommerceCartLine[]) {
  return lines.filter(line => line.productId === productId).reduce((sum, line) => sum + line.quantity, 0);
}


function merchantCategoryVisualKey(category: Pick<MerchantCategory,'id'|'label'>, storeCategory=''): string {
  const id=category.id.toLowerCase();
  const label=category.label.toLowerCase();
  const storeType=storeCategory.toLowerCase();
  if(id==='fresh'||id==='fruit'||id==='vegetables'||/fresh|fruit|vegetable|produce/.test(label))return 'groceries.fresh';
  if(id==='dairy')return 'groceries.dairy';
  if(id==='eggs')return 'groceries.dairyEggs';
  if(id==='bakery')return 'groceries.bakery';
  if(id==='pantry'||id==='breakfast'||id==='coffee-tea')return 'groceries.cooking';
  if(id==='beverages')return 'groceries.drinks';
  if(id==='snacks')return 'groceries.snacks';
  if(id==='household'||id==='cleaning')return 'groceries.household';
  if(id==='baby'||id==='baby-care')return 'pharmacy.baby-care';
  if(id==='pets'||id==='dog'||id==='cat'||id==='food'||id==='toys'||id==='grooming'||id==='beds')return 'commerce.pets';
  if(id==='personal-care')return 'pharmacy.personal-care';
  if(id==='wellness')return 'pharmacy.vitamins';
  if(id==='first-aid'||id==='everyday-health')return id==='first-aid'?'pharmacy.first-aid':'pharmacy.medicines';
  if(id==='skincare')return 'beauty.skincare';
  if(id==='makeup')return 'beauty.makeup';
  if(id==='hair')return 'beauty.hair';
  if(id==='fragrance')return 'beauty.fragrance';
  if(id==='mobile')return 'electronics.phones';
  if(storeType.includes('electronics')&&(id==='accessories'||id==='wearables'||id==='cameras'||id==='storage'||id==='smart-home'))return 'electronics.accessories';
  if(id==='audio')return 'electronics.audio';
  if(id==='computing')return 'electronics.computing';
  if(id==='gaming')return 'electronics.gaming';
  if(id==='tv')return 'electronics.tvs';
  if(id==='appliances')return 'electronics.appliances';
  if(id==='kitchen'||id==='decor'||id==='furniture'||id==='storage'||storeType.includes('home'))return 'commerce.home';
  return 'commerce.groceries';
}

function merchantFacetVisualKey(facet: MerchantBrowseFacet): string {
  const id=facet.id.toLowerCase();
  if(id==='tomatoes')return 'groceries.tomatoes';
  if(id==='salad-veg')return 'groceries.cucumber';
  if(id==='bananas')return 'groceries.bananas';
  if(id==='leafy-greens')return 'groceries.leafy-greens';
  if(id==='roots')return 'groceries.root-vegetables';
  if(id==='onions-garlic')return 'groceries.onions-garlic-ginger';
  if(id==='peppers')return 'groceries.peppers';
  if(id==='herbs')return 'groceries.herbs';
  if(id==='mushrooms')return 'groceries.mushrooms';
  if(id==='ready-to-cook')return 'groceries.ready-to-cook';
  if(['citrus','tropical','apples-pears','berries','fruit','vegetables'].includes(id))return 'groceries.fresh';
  if(id==='meat'||id==='fish')return 'groceries.meatFish';
  if(id==='smartphones')return 'electronics.phones';
  if(id==='chargers')return 'electronics.power';
  if(id==='cases')return 'electronics.accessories';
  if(['cleansers','moisturisers','serums','sun-care'].includes(id))return 'beauty.skincare';
  return 'commerce.groceries';
}

const ProductCard = memo(function ProductCard({
  product,
  country,
  quantity,
  onOpen,
  onAdd,
}: {
  product: CommerceProduct;
  country: string;
  quantity: number;
  onOpen: () => void;
  onAdd: () => void;
}) {
  const visual = commerceProductVisual({
    id: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    detail: product.detail,
    brand: product.brand,
    imageKey: product.metadata.imageKey,
  });
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${product.name}. ${formatMoney(country, product.basePrice)}.`} onPress={onOpen} style={({ pressed }) => [styles.productCard, pressed && styles.pressed]}>
      <View style={[styles.productArt, { backgroundColor: visual.background }]}>
        {visual.image?<Image source={visual.image} resizeMode="contain" style={styles.productImage}/>:<View style={{width:96,height:96,borderRadius:18,backgroundColor:'#F4F1EB'}}/>}
        <Pressable accessibilityRole="button" accessibilityLabel={`Add ${product.name}`} onPress={event => { event.stopPropagation?.(); onAdd(); }} style={[styles.addButton, quantity > 0 && styles.addButtonActive]}>
          <Text style={[styles.addText, quantity > 0 && styles.addTextActive]}>{quantity > 0 ? quantity : '+'}</Text>
        </Pressable>
      </View>
      {product.brand ? <Text numberOfLines={1} style={styles.productBrand}>{product.brand}</Text> : null}
      <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
      <Text numberOfLines={1} style={styles.productMeta}>{product.subcategory || product.detail}</Text>
      <Text style={styles.productPrice}>{formatMoney(country, product.basePrice)}</Text>
    </Pressable>
  );
});

function ProductRail({ title, subtitle, products, country, lines, onOpenProduct, onQuickAdd }: {
  title: string;
  subtitle?: string;
  products: CommerceProduct[];
  country: string;
  lines: CommerceCartLine[];
  onOpenProduct: (product: CommerceProduct) => void;
  onQuickAdd: (product: CommerceProduct) => void;
}) {
  if (!products.length) return null;
  return (
    <View style={styles.module}>
      <View style={styles.sectionHeader}>
        <View style={styles.flex}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
        <Feather name="arrow-right" size={20} color={COLORS.black} />
      </View>
      <FlatList
        horizontal
        data={products}
        keyExtractor={item => `${title}-${item.id}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalRail}
        renderItem={({ item }) => (
          <View style={styles.railProductWrap}>
            <ProductCard product={item} country={country} quantity={quantityFor(item.id, lines)} onOpen={() => onOpenProduct(item)} onAdd={() => onQuickAdd(item)} />
          </View>
        )}
      />
    </View>
  );
}

function CategoryGrid({ categories, store: _store, onOpen }: { categories: MerchantCategory[]; store: DemoShop; onOpen: (category: MerchantCategory) => void }) {
  if (!categories.length) return null;
  return (
    <View style={styles.categoryGrid}>
      {categories.map(category => (
        <Pressable key={category.id} accessibilityRole="button" accessibilityLabel={`${category.label}. ${category.count} products.`} onPress={() => onOpen(category)} style={({ pressed }) => [styles.categoryTile, pressed && styles.pressed]}>
          <View style={styles.categoryArt}><CategoryArtwork visualKey={merchantCategoryVisualKey(category,_store.category)} size="standard"/></View>
          <View style={styles.categoryCopy}><Text numberOfLines={2} style={styles.categoryLabel}>{category.label}</Text><Text style={styles.categoryCount}>{category.count} items</Text></View>
        </Pressable>
      ))}
    </View>
  );
}

function BrandRail({ brands }: { brands: string[] }) {
  if (!brands.length) return null;
  return (
    <FlatList
      horizontal
      data={brands}
      keyExtractor={brand => brand}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalRail}
      renderItem={({ item }) => (
        <View accessibilityLabel={`${item} brand`} style={styles.brandCard}><Text numberOfLines={2} adjustsFontSizeToFit style={styles.brandText}>{item}</Text></View>
      )}
    />
  );
}

function StorefrontHero({store,plan,onOpen}:{store:DemoShop;plan:MerchantStorefrontPlan;onOpen:(category:MerchantCategory)=>void}) {
  const first=plan.categories[0];
  if(!first)return null;
  const title=plan.merchantType==='supermarket'||plan.merchantType==='convenience-store'?'Your weekly shop, organised':plan.merchantType==='electronics'?'Tech, organised by department':plan.merchantType==='pharmacy'?'Health & wellness, easier to browse':plan.merchantType==='beauty'?'Beauty, organised around your routine':plan.merchantType==='fashion'?'Shop style by department':plan.merchantType==='pet-store'?'Everything for pets in one store':'Browse this store by department';
  const departmentNames=plan.categories.slice(0,4).map(item=>item.label).join(' · ');
  return <View style={styles.pageGutter}><View style={styles.storefrontHero}>
    <View style={styles.storefrontHeroCopy}><Text style={styles.kicker}>SHOP {store.name.toUpperCase()}</Text><Text style={styles.storefrontHeroTitle}>{title}</Text><Text style={styles.storefrontHeroBody}>{departmentNames || 'Browse the available catalogue by department.'}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Open ${first.label}`} onPress={()=>onOpen(first)} style={styles.storefrontHeroCta}><Text style={styles.storefrontHeroCtaText}>Start with {first.label}</Text><Feather name="arrow-right" size={15} color={COLORS.black}/></Pressable></View>
    <View style={styles.storefrontHeroArt}><CategoryArtwork visualKey={merchantCategoryVisualKey(first,store.category)} size="hero"/></View>
  </View></View>;
}

function CategoryHero({ category, store }: { category: MerchantCategory; store: DemoShop }) {
  return (
    <View style={styles.categoryHero}>
      <View style={styles.categoryHeroCopy}>
        <Text style={styles.kicker}>SHOP {store.name.toUpperCase()}</Text>
        <Text style={styles.categoryHeroTitle}>{category.label}</Text>
        <Text style={styles.categoryHeroBody}>Choose a type below, compare products and keep every result inside {store.name}. {category.count} items are represented in this store catalogue.</Text>
        <View style={styles.categoryHeroPill}><Text style={styles.categoryHeroPillText}>Browse department</Text><Feather name="arrow-down" size={13} color={COLORS.black}/></View>
      </View>
      <View style={styles.categoryHeroArt}><CategoryArtwork visualKey={merchantCategoryVisualKey(category,store.category)} size="hero"/></View>
    </View>
  );
}

function FacetRail({facets,totalCount,selectedId,onSelect}:{facets:MerchantBrowseFacet[];totalCount:number;selectedId:string|null;onSelect:(id:string|null)=>void}) {
  if(!facets.length)return null;
  return <View style={styles.facetSection}>
    <View style={styles.sectionHeader}><View style={styles.flex}><Text style={styles.sectionTitle}>Shop by type</Text><Text style={styles.sectionSubtitle}>Choose a specific aisle, then compare products inside it</Text></View>{selectedId?<Pressable accessibilityRole="button" onPress={()=>onSelect(null)} style={styles.resetFacet}><Text style={styles.resetFacetText}>All {totalCount}</Text></Pressable>:null}</View>
    <View style={styles.facetGrid}>{facets.map(item=>{
      const active=selectedId===item.id;
      return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{selected:active}} onPress={()=>onSelect(active?null:item.id)} style={[styles.facetCard,active&&styles.facetCardActive]}>
        <View style={[styles.facetIcon,active&&styles.facetIconActive]}><CategoryArtwork visualKey={merchantFacetVisualKey(item)} size="standard"/></View>
        <Text numberOfLines={2} style={styles.facetLabel}>{item.label}</Text>
        <Text style={styles.facetCount}>{item.count} {item.count===1?'item':'items'}</Text>
      </Pressable>;
    })}</View>
  </View>;
}

function ProductSortBar({sort,onChange}:{sort:'relevant'|'price'|'name';onChange:(value:'relevant'|'price'|'name')=>void}) {
  return <View style={styles.sortSection}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRail}>
    {([['relevant','Recommended'],['price','Lowest price'],['name','A–Z']] as const).map(([value,label])=><Pressable key={value} accessibilityRole="button" accessibilityState={{selected:sort===value}} onPress={()=>onChange(value)} style={[styles.sortChip,sort===value&&styles.sortChipActive]}><Text style={[styles.sortChipText,sort===value&&styles.sortChipTextActive]}>{label}</Text></Pressable>)}
  </ScrollView></View>;
}

function ModuleRenderer({ module, plan, props }: { module: StorefrontModule; plan: MerchantStorefrontPlan; props: MerchantStorefrontScreenProps }) {
  const { store, country, city, cartLines, onOpenProduct, onQuickAdd, onOpenCategory, onOpenPromotion } = props;
  if (module.type === 'merchant-campaign') return <View style={styles.module}><MerchantCampaignBanner shop={store} compact onPress={() => { const first=plan.categories[0]; if(first) onOpenCategory(first); }} /></View>;
  if (module.type === 'category-grid') return <View style={styles.module}><View style={styles.sectionHeader}><View style={styles.flex}><Text style={styles.sectionTitle}>{module.title}</Text>{module.subtitle ? <Text style={styles.sectionSubtitle}>{module.subtitle}</Text> : null}</View></View><CategoryGrid categories={plan.categories} store={store} onOpen={onOpenCategory} /></View>;
  if (module.type === 'brand-rail') return <View style={styles.module}><View style={styles.sectionHeader}><View style={styles.flex}><Text style={styles.sectionTitle}>{module.title}</Text>{module.subtitle ? <Text style={styles.sectionSubtitle}>{module.subtitle}</Text> : null}</View></View><BrandRail brands={module.brands}/></View>;
  if (module.type === 'product-rail') return <ProductRail title={module.title} subtitle={module.subtitle} products={module.products} country={country} lines={cartLines} onOpenProduct={onOpenProduct} onQuickAdd={onQuickAdd}/>;
  return (
    <View style={styles.module}>
      <PromotionSurface
        service="shops"
        placement={module.placement}
        country={country}
        city={city}
        merchantType={plan.merchantType}
        sellerId={store.id}
        categoryId={module.categoryId}
        layout={module.layout}
        sessionId={`merchant-${store.id}`}
        onPress={campaign => onOpenPromotion(campaign, plan)}
      />
    </View>
  );
}

export function MerchantStorefrontScreen(props: MerchantStorefrontScreenProps) {
  const { country, city, store, storeName, products, cartLines, favourite, activeCategoryId, searchContext, onBack, onInfo, onToggleFavourite, onOpenProduct, onOpenCategory, onQuickAdd, onOpenCart } = props;
  const insets = useSafeAreaInsets();
  useRegisterBackControl(true);
  const [query, setQuery] = useState('');
  const [activeFacetId,setActiveFacetId]=useState<string|null>(null);
  const [sort,setSort]=useState<'relevant'|'price'|'name'>('relevant');
  const plan = useMemo(() => buildMerchantStorefrontPlan(store, products), [store, products]);
  const activeCategory = useMemo(() => storefrontCategoryById(plan, activeCategoryId), [plan, activeCategoryId]);
  const facets=useMemo(()=>activeCategory?merchantBrowseFacets(activeCategory,products):[],[activeCategory,products]);
  const activeCategoryProductCount=useMemo(()=>activeCategory?productsForMerchantCategory(products,activeCategory).length:products.length,[activeCategory,products]);
  const activeFacet=useMemo(()=>facets.find(item=>item.id===activeFacetId),[activeFacetId,facets]);
  useEffect(()=>{setActiveFacetId(null);setSort('relevant');},[activeCategory?.id]);
  const scopedProducts = useMemo(() => activeCategory ? productsForMerchantFacet(products, activeCategory, activeFacet) : products, [activeCategory,activeFacet,products]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches=term?scopedProducts.filter(product => `${product.name} ${product.category} ${product.subcategory} ${product.brand ?? ''} ${product.detail}`.toLowerCase().includes(term)):[...scopedProducts];
    if(sort==='price')matches.sort((a,b)=>a.basePrice-b.basePrice);
    if(sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
    return matches;
  }, [query, scopedProducts,sort]);
  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const visibleModules = activeCategory
    ? plan.modules.filter(module => module.type === 'product-rail' ? !module.categoryId || module.categoryId === activeCategory.id : module.type === 'promotion' ? !module.categoryId || module.categoryId === activeCategory.id : module.type === 'brand-rail')
    : plan.modules;

  const header = (
    <View>
      <View style={[styles.merchantHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.merchantTopRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.iconButton}><Feather name="arrow-left" size={23} color={COLORS.black}/></Pressable>
          <View style={styles.logo}><SellerLogo name={store.name}/></View>
          <View style={styles.headerIdentity}>
            <Text numberOfLines={1} style={styles.headerStoreName}>{storeName}</Text>
            <Text numberOfLines={1} style={styles.headerLocation}>{store.location ?? city}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Store information" onPress={onInfo} style={styles.iconButton}><Feather name="info" size={21} color={COLORS.black}/></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={favourite ? 'Remove store from favourites' : 'Add store to favourites'} onPress={onToggleFavourite} style={styles.iconButton}><Ionicons name={favourite ? 'heart' : 'heart-outline'} size={22} color={favourite ? COLORS.red : COLORS.black}/></Pressable>
        </View>
        <View style={styles.searchWrap}>
          <KareebuSearchField context={searchContext} value={query} onChangeText={setQuery} elevated={false}/>
        </View>
      </View>

      <View style={styles.deliveryCard}>
        <View style={styles.deliveryCell}><Text style={styles.deliveryLabel}>Delivery</Text><Text style={styles.deliveryValue}>{store.contentTrust?.liveAvailability ? store.eta : 'Confirmed at checkout'}</Text></View>
        <View style={styles.deliveryDivider}/>
        <View style={styles.deliveryCell}><Text style={styles.deliveryLabel}>Delivery fee</Text><Text style={styles.deliveryValue}>{store.contentTrust?.liveAvailability ? (store.deliveryFee === 0 ? 'Free' : formatMoney(country, store.deliveryFee)) : 'Confirmed at checkout'}</Text></View>
        <View style={styles.deliveryDivider}/>
        <View style={styles.deliveryCell}><Text style={styles.deliveryLabel}>Minimum</Text><Text style={styles.deliveryValue}>{store.contentTrust?.liveAvailability ? formatMoney(country, store.minOrder) : 'Confirmed at checkout'}</Text></View>
      </View>
      {!store.contentTrust?.liveAvailability ? <Text style={styles.referenceNote}>Availability, fees and commercial offers are confirmed before checkout.</Text> : null}

      {!activeCategory ? <StorefrontHero store={store} plan={plan} onOpen={onOpenCategory}/> : null}
      {activeCategory ? <View style={styles.pageGutter}><CategoryHero category={activeCategory} store={store}/></View> : null}
      {activeCategory ? <FacetRail facets={facets} totalCount={activeCategoryProductCount} selectedId={activeFacetId} onSelect={setActiveFacetId}/> : null}
      {activeCategory ? <ProductSortBar sort={sort} onChange={setSort}/> : null}

      <View style={styles.modules}>
        {visibleModules.map(module => <ModuleRenderer key={module.id} module={module} plan={plan} props={props}/>) }
      </View>

      <View style={styles.allProductsHeader}>
        <View style={styles.flex}><Text style={styles.sectionTitle}>{activeCategory ? (activeFacet ? activeFacet.label : `All ${activeCategory.label}`) : 'All Products'}</Text><Text style={styles.sectionSubtitle}>{filtered.length} products in this department</Text></View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={header}
        columnWrapperStyle={styles.productGridRow}
        contentContainerStyle={{ paddingBottom: Math.max(120, 90 + insets.bottom) }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        renderItem={({ item }) => (
          <View style={styles.gridProductWrap}>
            <ProductCard product={item} country={country} quantity={quantityFor(item.id, cartLines)} onOpen={() => onOpenProduct(item)} onAdd={() => onQuickAdd(item)}/>
          </View>
        )}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="search-outline" size={40} color={COLORS.muted}/><Text style={styles.emptyTitle}>No matching products</Text><Text style={styles.emptyBody}>Try another product, brand or category within {storeName}.</Text></View>}
      />

      {cartCount > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`View basket. ${cartCount} items. ${formatMoney(country, cartTotal)}.`} onPress={onOpenCart} style={[styles.basketBar, { bottom: Math.max(8, insets.bottom + 6) }]}>
          <View style={styles.basketCount}><Text style={styles.basketCountText}>{cartCount}</Text></View>
          <View style={styles.flex}><Text style={styles.basketTitle}>View basket</Text><Text style={styles.basketMeta}>{storeName}</Text></View>
          <Text style={styles.basketTotal}>{formatMoney(country, cartTotal)}</Text>
          <Feather name="chevron-right" size={20} color={COLORS.white}/>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:COLORS.white},flex:{flex:1},pressed:{opacity:.84,transform:[{scale:.99}]},
  merchantHeader:{backgroundColor:COLORS.yellow,paddingHorizontal:16,paddingBottom:18,borderBottomLeftRadius:28,borderBottomRightRadius:28},
  merchantTopRow:{minHeight:60,flexDirection:'row',alignItems:'center',gap:10},
  iconButton:{width:44,height:44,borderRadius:15,backgroundColor:'rgba(255,255,255,.84)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(23,23,23,.08)'},
  logo:{width:54,height:54,borderRadius:14,backgroundColor:COLORS.white,overflow:'hidden'},headerIdentity:{flex:1,minWidth:0},
  headerStoreName:{fontFamily:FONT.bold,fontSize:19,fontWeight:'900',color:COLORS.black},headerLocation:{...TYPE.small,color:COLORS.black,opacity:.72,marginTop:2},
  searchWrap:{marginTop:10},
  deliveryCard:{marginHorizontal:16,marginTop:14,minHeight:84,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',padding:12,...SHADOW},deliveryCell:{flex:1,alignItems:'center',gap:5},deliveryDivider:{width:1,height:44,backgroundColor:COLORS.line},deliveryLabel:{...TYPE.caption,color:COLORS.muted,textAlign:'center'},deliveryValue:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black,textAlign:'center'},referenceNote:{...TYPE.caption,color:COLORS.muted,marginHorizontal:20,marginTop:8,textAlign:'center'},
  pageGutter:{paddingHorizontal:16},storefrontHero:{minHeight:204,borderRadius:24,backgroundColor:COLORS.yellow,padding:20,marginTop:16,overflow:'hidden',flexDirection:'row',alignItems:'center',...SHADOW},storefrontHeroCopy:{flex:1,zIndex:2},storefrontHeroTitle:{fontFamily:FONT.bold,fontSize:25,lineHeight:29,fontWeight:'900',color:COLORS.black,marginTop:5},storefrontHeroBody:{...TYPE.small,color:'#4B4429',lineHeight:18,marginTop:8,maxWidth:215},storefrontHeroCta:{alignSelf:'flex-start',marginTop:14,minHeight:38,borderRadius:19,backgroundColor:COLORS.white,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:7},storefrontHeroCtaText:{fontFamily:FONT.bold,fontSize:11.5,fontWeight:'900',color:COLORS.black},storefrontHeroArt:{width:132,height:132,alignItems:'center',justifyContent:'center',marginRight:-12},categoryHero:{minHeight:216,borderRadius:24,backgroundColor:COLORS.yellowWash,padding:20,marginTop:16,overflow:'hidden',flexDirection:'row',alignItems:'center'},categoryHeroCopy:{flex:1,zIndex:2},kicker:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:.9,color:COLORS.black,opacity:.64},categoryHeroTitle:{fontFamily:FONT.bold,fontSize:28,lineHeight:32,fontWeight:'900',color:COLORS.black,marginTop:5},categoryHeroBody:{...TYPE.small,color:COLORS.muted,marginTop:7,maxWidth:210,lineHeight:18},categoryHeroPill:{alignSelf:'flex-start',marginTop:12,borderRadius:14,backgroundColor:COLORS.white,paddingHorizontal:10,paddingVertical:7,flexDirection:'row',alignItems:'center',gap:5},categoryHeroPillText:{...TYPE.caption,fontWeight:'900',color:COLORS.black},categoryHeroArt:{width:142,height:142,alignItems:'center',justifyContent:'center',marginRight:-8},
  modules:{gap:22,paddingTop:18},module:{gap:10},sectionHeader:{paddingHorizontal:16,flexDirection:'row',alignItems:'center',gap:10},sectionTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:25,fontWeight:'900',color:COLORS.black},sectionSubtitle:{...TYPE.small,color:COLORS.muted,marginTop:3},horizontalRail:{gap:10,paddingHorizontal:16,paddingVertical:3},
  railProductWrap:{width:172},productCard:{flex:1,minWidth:0},productArt:{height:160,borderRadius:18,alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'},productImage:{width:'86%',height:'84%'},addButton:{position:'absolute',right:8,bottom:8,width:42,height:42,borderRadius:14,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center',...SHADOW},addButtonActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},addText:{fontFamily:FONT.regular,fontSize:24,color:COLORS.black,lineHeight:28},addTextActive:{fontFamily:FONT.bold,fontSize:14,color:COLORS.white},productBrand:{...TYPE.caption,color:COLORS.muted,marginTop:8},productName:{fontFamily:FONT.medium,fontSize:14,lineHeight:18,fontWeight:'700',color:COLORS.black,marginTop:3,minHeight:36},productMeta:{...TYPE.caption,color:COLORS.muted,marginTop:3},productPrice:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',color:COLORS.black,marginTop:5},
  categoryGrid:{paddingHorizontal:16,flexDirection:'row',flexWrap:'wrap',gap:10},categoryTile:{width:'31.4%',minHeight:132,borderRadius:19,backgroundColor:COLORS.surface,padding:8,borderWidth:1,borderColor:COLORS.line},categoryArt:{height:78,borderRadius:15,alignItems:'center',justifyContent:'center',overflow:'hidden',backgroundColor:COLORS.white},categoryCopy:{paddingTop:7},categoryLabel:{fontFamily:FONT.bold,fontSize:12.5,lineHeight:15.5,fontWeight:'900',color:COLORS.black},categoryCount:{...TYPE.caption,fontSize:10,color:COLORS.muted,marginTop:2},
  brandCard:{width:116,height:82,borderRadius:17,backgroundColor:COLORS.surfaceStrong,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',padding:10},brandText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900',color:COLORS.black,textAlign:'center'},
  facetSection:{marginTop:18,gap:9},facetGrid:{paddingHorizontal:16,flexDirection:'row',flexWrap:'wrap',gap:10},facetCard:{width:'31.4%',minHeight:132,borderRadius:19,backgroundColor:COLORS.surface,padding:8,borderWidth:1,borderColor:COLORS.line},facetCardActive:{backgroundColor:'#FFF5C5',borderColor:'#EFCB37'},facetIcon:{width:'100%',height:78,borderRadius:15,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',overflow:'hidden'},facetIconActive:{borderWidth:1,borderColor:'#EFCB37'},facetLabel:{fontFamily:FONT.bold,fontSize:12.5,lineHeight:15.5,fontWeight:'900',color:COLORS.black,marginTop:7},facetCount:{...TYPE.caption,fontSize:10,color:COLORS.muted,marginTop:2},resetFacet:{height:34,borderRadius:17,backgroundColor:COLORS.surfaceStrong,paddingHorizontal:11,alignItems:'center',justifyContent:'center'},resetFacetText:{...TYPE.caption,fontWeight:'900',color:COLORS.black},
  sortSection:{marginTop:13},sortRail:{gap:8,paddingHorizontal:16,paddingRight:28},sortChip:{height:36,borderRadius:18,backgroundColor:COLORS.surfaceStrong,paddingHorizontal:14,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:COLORS.line},sortChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},sortChipText:{fontFamily:FONT.medium,fontSize:12,color:COLORS.black},sortChipTextActive:{fontFamily:FONT.bold,color:COLORS.white},
  allProductsHeader:{marginTop:26,paddingHorizontal:16,paddingBottom:12},productGridRow:{gap:12,paddingHorizontal:16,marginBottom:18},gridProductWrap:{flex:1,minWidth:0},
  empty:{marginHorizontal:16,padding:32,borderRadius:20,backgroundColor:COLORS.surface,alignItems:'center',gap:7},emptyTitle:{...TYPE.sectionTitle},emptyBody:{...TYPE.body,color:COLORS.muted,textAlign:'center'},
  basketBar:{position:'absolute',left:14,right:14,minHeight:64,borderRadius:20,backgroundColor:COLORS.black,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10,...SHADOW},basketCount:{width:32,height:32,borderRadius:11,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},basketCountText:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900',color:COLORS.black},basketTitle:{fontFamily:FONT.bold,fontSize:15,fontWeight:'900',color:COLORS.white},basketMeta:{fontFamily:FONT.regular,fontSize:10,color:'rgba(255,255,255,.7)',marginTop:2},basketTotal:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',color:COLORS.white},
});
