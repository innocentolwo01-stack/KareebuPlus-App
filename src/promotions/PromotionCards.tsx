import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { PromotionCampaign } from './types';
import { COLORS, RADIUS, SHADOW, TYPE } from '../theme';
import { PromotionalImageBanner } from './PromotionalImageBanner';
import { promotionalAssetForSource } from './promotionalContentRegistry';

const treatments = {
  yellow: COLORS.yellow,
  cream: COLORS.yellowWash,
  charcoal: COLORS.black,
  green: COLORS.greenSoft,
  photo: COLORS.black,
  rose: '#F9E6E9',
  blue: '#E6F0FF',
} as const;
const dark = (item:PromotionCampaign) => item.backgroundTreatment === 'charcoal' || item.backgroundTreatment === 'photo';

function CampaignBackdrop({ campaign }: { campaign:PromotionCampaign }) {
  const background = campaign.backgroundImage ?? (campaign.backgroundTreatment === 'photo' ? campaign.image : undefined);
  if (!background) return null;
  return <><Image source={background} resizeMode="cover" style={styles.photo}/><View style={styles.scrim}/></>;
}

function CampaignArt({ campaign, compact = false }: { campaign:PromotionCampaign; compact?:boolean }) {
  const art = campaign.foregroundImage ?? (campaign.backgroundTreatment === 'photo' ? undefined : campaign.image);
  if (!art) return null;
  return <View style={compact ? styles.compactArtWrap : styles.heroArtWrap}><Image source={art} resizeMode="contain" style={compact ? styles.compactArt : styles.heroArt}/></View>;
}

export function PromotionHero({ campaign, onPress }: { campaign:PromotionCampaign; onPress:(campaign:PromotionCampaign)=>void }) {
  if(campaign.imageOnly&&campaign.image){const registered=promotionalAssetForSource(campaign.image);return <PromotionalImageBanner image={campaign.image} aspectRatio={registered?.aspectRatio} accessibilityLabel={registered?.accessibilityLabel??`${campaign.headline}. ${campaign.ctaLabel}`} onPress={()=>onPress(campaign)}/>;}
  const isDark=dark(campaign);
  return <Pressable accessibilityRole="button" accessibilityLabel={`${campaign.headline}. ${campaign.ctaLabel}`} onPress={()=>onPress(campaign)} style={({pressed})=>[styles.hero,{backgroundColor:treatments[campaign.backgroundTreatment]},pressed&&styles.pressed]}>
    <CampaignBackdrop campaign={campaign}/>
    <View style={styles.heroCopy}>
      <View style={styles.identityRow}>{campaign.logo?<Image source={campaign.logo} resizeMode="contain" style={styles.logo}/>:null}{campaign.badge?<Text style={[styles.badge,isDark&&styles.textLight]}>{campaign.badge}</Text>:null}</View>
      <Text numberOfLines={3} style={[styles.heroTitle,isDark&&styles.textLight]}>{campaign.headline}</Text>
      <Text numberOfLines={3} style={[styles.heroBody,isDark&&styles.bodyLight]}>{campaign.body}</Text>
      <View style={[styles.cta,isDark&&styles.ctaLight]}><Text style={styles.ctaText}>{campaign.ctaLabel}</Text><Feather name="arrow-right" size={15} color={COLORS.black}/></View>
    </View>
    <CampaignArt campaign={campaign}/>
  </Pressable>;
}

export function CompactPromotion({ campaign, onPress }: { campaign:PromotionCampaign; onPress:(campaign:PromotionCampaign)=>void }) {
  if(campaign.imageOnly&&campaign.image){const registered=promotionalAssetForSource(campaign.image);return <PromotionalImageBanner image={campaign.image} aspectRatio={registered?.aspectRatio} accessibilityLabel={registered?.accessibilityLabel??`${campaign.headline}. ${campaign.ctaLabel}`} onPress={()=>onPress(campaign)}/>;}
  const isDark=dark(campaign);
  return <Pressable accessibilityRole="button" accessibilityLabel={`${campaign.headline}. ${campaign.ctaLabel}`} onPress={()=>onPress(campaign)} style={({pressed})=>[styles.compact,{backgroundColor:treatments[campaign.backgroundTreatment]},pressed&&styles.pressed]}>
    <CampaignBackdrop campaign={campaign}/>
    <CampaignArt campaign={campaign} compact/>
    <View style={[styles.flex,{zIndex:2}]}>
      <View style={styles.identityRow}>{campaign.logo?<Image source={campaign.logo} resizeMode="contain" style={styles.logoCompact}/>:null}{campaign.badge?<Text style={[styles.compactBadge,isDark&&styles.textLight]}>{campaign.badge}</Text>:null}</View>
      <Text style={[styles.compactTitle,isDark&&styles.textLight]}>{campaign.headline}</Text>
      <Text numberOfLines={2} style={[styles.compactBody,isDark&&styles.bodyLight]}>{campaign.body}</Text>
      <Text style={[styles.compactCta,isDark&&styles.yellowText]}>{campaign.ctaLabel}</Text>
    </View>
    <Feather name="chevron-right" size={20} color={isDark?COLORS.white:COLORS.black} style={styles.chevron}/>
  </Pressable>;
}

export function DoublePromotionGrid({ campaigns, onPress }: { campaigns:PromotionCampaign[]; onPress:(campaign:PromotionCampaign)=>void }) {
  return <View style={styles.grid}>{campaigns.slice(0,2).map(campaign=><Pressable accessibilityRole="button" key={campaign.id} onPress={()=>onPress(campaign)} style={({pressed})=>[styles.tile,{backgroundColor:treatments[campaign.backgroundTreatment]},pressed&&styles.pressed]}>
    <CampaignBackdrop campaign={campaign}/><CampaignArt campaign={campaign} compact/>
    <View style={styles.tileCopy}><Text numberOfLines={2} style={[styles.tileTitle,dark(campaign)&&styles.textLight]}>{campaign.headline}</Text><Text numberOfLines={2} style={[styles.tileBody,dark(campaign)&&styles.bodyLight]}>{campaign.body}</Text><Text style={[styles.tileCta,dark(campaign)&&styles.yellowText]}>{campaign.ctaLabel}</Text></View>
  </Pressable>)}</View>;
}

export function MembershipPromotion(props:{campaign:PromotionCampaign;onPress:(campaign:PromotionCampaign)=>void}) { return <CompactPromotion {...props}/>; }

const styles=StyleSheet.create({
  flex:{flex:1},pressed:{opacity:.9,transform:[{scale:.994}]},textLight:{color:COLORS.white},bodyLight:{color:'rgba(255,255,255,.88)'},yellowText:{color:COLORS.yellow},
  hero:{minHeight:174,aspectRatio:2.08,borderRadius:RADIUS.xl,overflow:'hidden',flexDirection:'row',position:'relative',...SHADOW},photo:{...StyleSheet.absoluteFill,width:'100%',height:'100%'},scrim:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,.36)'},
  heroCopy:{flex:1,zIndex:2,padding:18,justifyContent:'center',alignItems:'flex-start',maxWidth:'70%'},identityRow:{minHeight:18,flexDirection:'row',alignItems:'center',gap:8,marginBottom:5},logo:{width:76,height:27},logoCompact:{width:55,height:22},badge:{...TYPE.label,color:COLORS.black,letterSpacing:.9},compactBadge:{...TYPE.caption,fontWeight:'900',letterSpacing:.6,color:COLORS.black},heroTitle:{...TYPE.screenTitle,color:COLORS.black,maxWidth:275},heroBody:{...TYPE.small,color:'#3E413F',maxWidth:255,marginTop:5},
  heroArtWrap:{width:'38%',height:'100%',alignItems:'center',justifyContent:'center',paddingRight:4,zIndex:1},heroArt:{width:'100%',height:'92%'},cta:{height:34,borderRadius:17,backgroundColor:COLORS.white,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:6,marginTop:11},ctaLight:{backgroundColor:COLORS.yellow},ctaText:{...TYPE.action,color:COLORS.black},
  compact:{minHeight:112,borderRadius:RADIUS.lg,padding:13,flexDirection:'row',alignItems:'center',gap:11,overflow:'hidden',...SHADOW},compactArtWrap:{width:76,height:76,borderRadius:20,backgroundColor:'rgba(255,255,255,.48)',alignItems:'center',justifyContent:'center',zIndex:2},compactArt:{width:70,height:70},compactTitle:{...TYPE.cardTitle,color:COLORS.black},compactBody:{...TYPE.small,color:COLORS.muted,marginTop:3},compactCta:{...TYPE.action,color:COLORS.black,marginTop:5},chevron:{zIndex:2},
  grid:{flexDirection:'row',gap:10},tile:{flex:1,minHeight:176,borderRadius:RADIUS.lg,padding:12,overflow:'hidden',...SHADOW},tileCopy:{marginTop:'auto',zIndex:2},tileTitle:{...TYPE.cardTitle,color:COLORS.black},tileBody:{...TYPE.caption,color:COLORS.muted,marginTop:3},tileCta:{...TYPE.small,color:COLORS.black,fontWeight:'800',marginTop:6},
});
