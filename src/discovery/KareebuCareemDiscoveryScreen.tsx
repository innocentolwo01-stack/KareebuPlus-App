import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  KareebuDomainId,
  UnifiedCatalogItem,
} from '../catalog/master/kareebuUnifiedCatalog';
import { useAppNavigation } from '../navigation/AppNavigation';
import { COLORS, FONT, SHADOW, TYPE } from '../theme';
import { useKareebuDiscoveryController } from './controller';
import { KAREEBU_DISCOVERY_DOMAIN_CONFIG } from './domainConfig';
import { renderKareebuDiscoveryWidget } from './renderer';
import type { KareebuDiscoverySort } from './types';
import { PromotionHero } from '../promotions/PromotionCards';
import { promotionsFor } from '../promotions/catalog';
import type { PromotionCampaign, PromotionService } from '../promotions/types';
import { KareebuPageHeader } from '../components/KareebuPageHeader';
import { searchContext } from '../search/context';
import { CategoryLandingBanner } from '../components/CategoryLandingBanner';
import { mainCategoryBanner } from '../assets/categoryBannerResolver';

const SORTS: Array<{id:KareebuDiscoverySort;label:string;body:string}> = [
  {id:'recommended',label:'Default order',body:'Catalogue order without invented ranking signals'},
];

export function KareebuCareemDiscoveryScreen({
  domainId,
  city,
  country,
  initialVerticalTitle,
  onOpenItem,
  onOpenMembership,
  onOpenPromotion,
  onOpenVertical,
}:{
  domainId:KareebuDomainId;
  city:string;
  country:string;
  initialVerticalTitle?:string;
  onOpenItem:(item:UnifiedCatalogItem)=>void;
  onOpenMembership:()=>void;
  onOpenPromotion:(campaign:PromotionCampaign)=>void;
  onOpenVertical?:(id:string,title:string)=>void;
}){
  const insets=useSafeAreaInsets();
  const navigation=useAppNavigation();

  const controller=useKareebuDiscoveryController({
    domainId,
    city,
    country,
    initialVerticalTitle,
    onOpenItem,
    onOpenMembership,
    onOpenVertical,
  });
  const config=KAREEBU_DISCOVERY_DOMAIN_CONFIG[domainId];
  const promotionService:PromotionService=domainId==='home-care'||domainId==='fix'?'services':domainId==='electronics'?'shops':domainId;
  const heroPromotion=promotionsFor({service:promotionService,country,city},'hero')[0];
  const scope=domainId==='dineout'?'dineout':domainId==='home-care'||domainId==='fix'?'services':domainId;
  const homeCareBanner=domainId==='home-care'||domainId==='fix'?mainCategoryBanner('home-care'):undefined;

  return <View style={styles.root}>
    <KareebuPageHeader title={controller.document.header.locationEyebrow} country={country} city={city} locationEnabled searchEnabled searchContext={searchContext(scope,{market:country,city})} searchValue={controller.query} onSearchChange={controller.setQuery} onBack={()=>navigation?.goBack()} rightIcon="options-outline" rightLabel="Filters and sorting" onRightAction={()=>controller.setFiltersOpen(true)}/>

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content,{paddingBottom:Math.max(102,insets.bottom+86)}]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {homeCareBanner?<View style={styles.promotion}><CategoryLandingBanner banner={homeCareBanner} accessibilityLabel="Home and Care services"/></View>:heroPromotion?<View style={styles.promotion}><PromotionHero campaign={heroPromotion} onPress={onOpenPromotion}/></View>:null}
      {controller.document.widgets.map((widget)=>(
        <React.Fragment key={widget.id}>{renderKareebuDiscoveryWidget(widget,controller)}</React.Fragment>
      ))}
    </ScrollView>

    <Modal transparent visible={controller.filtersOpen} animationType="slide" onRequestClose={()=>controller.setFiltersOpen(false)}>
      <Pressable style={styles.modalBackdrop} onPress={()=>controller.setFiltersOpen(false)}/>
      <View style={[styles.sheet,{paddingBottom:Math.max(16,insets.bottom+8)}]}>
        <View style={styles.sheetHandle}/>
        <View style={styles.sheetHeader}>
          <View><Text style={styles.sheetTitle}>Filters & sorting</Text><Text style={styles.sheetSubtitle}>{config.title}</Text></View>
          <Pressable onPress={()=>controller.setFiltersOpen(false)} style={styles.sheetClose}><Feather name="x" size={21} color={COLORS.black}/></Pressable>
        </View>

        <Text style={styles.sheetLabel}>Sort by</Text>
        <View style={styles.sortList}>
          {SORTS.map((sort)=>{
            const active=controller.sort===sort.id;
            return <Pressable key={sort.id} onPress={()=>controller.setSort(sort.id)} style={({pressed})=>[styles.sortRow,pressed&&styles.pressed]}>
              <View style={styles.flex}><Text style={styles.sortTitle}>{sort.label}</Text><Text style={styles.sortBody}>{sort.body}</Text></View>
              <View style={[styles.radio,active&&styles.radioActive]}>{active?<View style={styles.radioDot}/>:null}</View>
            </Pressable>;
          })}
        </View>

        <Text style={[styles.sheetLabel,styles.sheetLabelFilters]}>Filter</Text>
        <View style={styles.sheetFilters}>
          {config.filters.map((filter)=>{
            const active=controller.activeFilters.includes(filter.id);
            return <Pressable key={filter.id} onPress={()=>controller.toggleFilter(filter.id)} style={({pressed})=>[styles.sheetFilter,active&&styles.sheetFilterActive,pressed&&styles.pressed]}>
              <Feather name={filter.icon as any} size={17} color={COLORS.black}/>
              <Text style={[styles.sheetFilterText,active&&styles.sheetFilterTextActive]}>{filter.label}</Text>
              {active?<Feather name="check" size={16} color={COLORS.black}/>:null}
            </Pressable>;
          })}
        </View>

        <View style={styles.sheetActions}>
          <Pressable onPress={controller.clearFilters} style={styles.clearButton}><Text style={styles.clearButtonText}>Clear</Text></Pressable>
          <Pressable onPress={()=>controller.setFiltersOpen(false)} style={styles.showButton}><Text style={styles.showButtonText}>Show results</Text></Pressable>
        </View>
      </View>
    </Modal>
  </View>;
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.white},
  flex:{flex:1},
  pressed:{opacity:.7},
  header:{backgroundColor:COLORS.yellow,paddingHorizontal:14,paddingBottom:22},
  headerRow:{flexDirection:'row',alignItems:'center',gap:12},
  headerAction:{width:50,height:50,borderRadius:14,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'rgba(0,0,0,.06)',...SHADOW},
  headerLocation:{flex:1,minWidth:0},
  locationEyebrow:{fontFamily:FONT.bold,fontSize:21,lineHeight:25,fontWeight:'900',letterSpacing:-.7,color:COLORS.black},
  locationLine:{marginTop:3,flexDirection:'row',alignItems:'center',gap:5},
  locationText:{flexShrink:1,...TYPE.small,color:'#303436',fontWeight:'800'},
  search:{marginTop:14,height:52,borderRadius:14,backgroundColor:COLORS.white,borderWidth:1,borderColor:'rgba(0,0,0,.06)',paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:10,...SHADOW},
  searchInput:{flex:1,fontFamily:FONT.regular,fontSize:15.5,lineHeight:20,color:COLORS.black,paddingVertical:0},
  whiteBridge:{position:'absolute',left:0,right:0,bottom:-1,height:16,backgroundColor:COLORS.white,borderTopLeftRadius:28,borderTopRightRadius:28},
  scroll:{flex:1},
  content:{paddingTop:7},
  promotion:{paddingHorizontal:14,paddingTop:7,paddingBottom:10},
  modalBackdrop:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,.42)'},
  sheet:{position:'absolute',left:0,right:0,bottom:0,maxHeight:'88%',backgroundColor:COLORS.white,borderTopLeftRadius:26,borderTopRightRadius:26,paddingHorizontal:16,paddingTop:9},
  sheetHandle:{alignSelf:'center',width:44,height:5,borderRadius:3,backgroundColor:'#D4D7D9',marginBottom:13},
  sheetHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  sheetTitle:{...TYPE.screenTitle,color:COLORS.black},
  sheetSubtitle:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  sheetClose:{width:40,height:40,borderRadius:20,backgroundColor:COLORS.surfaceStrong,alignItems:'center',justifyContent:'center'},
  sheetLabel:{...TYPE.label,color:COLORS.muted,textTransform:'uppercase',letterSpacing:.8,marginTop:18,marginBottom:5},
  sheetLabelFilters:{marginTop:20},
  sortList:{borderTopWidth:1,borderTopColor:COLORS.line},
  sortRow:{minHeight:58,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10},
  sortTitle:{...TYPE.bodyStrong,color:COLORS.black},
  sortBody:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:'#A9ADB0',alignItems:'center',justifyContent:'center'},
  radioActive:{borderColor:COLORS.black},
  radioDot:{width:11,height:11,borderRadius:6,backgroundColor:COLORS.yellow},
  sheetFilters:{flexDirection:'row',flexWrap:'wrap',gap:8},
  sheetFilter:{minHeight:42,borderRadius:21,borderWidth:1,borderColor:COLORS.lineDark,backgroundColor:COLORS.white,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:7},
  sheetFilterActive:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellowDeep},
  sheetFilterText:{...TYPE.small,color:COLORS.black,fontWeight:'700'},
  sheetFilterTextActive:{fontWeight:'900'},
  sheetActions:{marginTop:20,flexDirection:'row',gap:9},
  clearButton:{height:50,minWidth:90,borderRadius:15,borderWidth:1,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center',paddingHorizontal:18},
  clearButtonText:{...TYPE.button,color:COLORS.black},
  showButton:{flex:1,height:50,borderRadius:15,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  showButtonText:{...TYPE.button,color:COLORS.black},
});
