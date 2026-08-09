import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoundedCard, SectionTitle } from '../components';
import { COLORS, FONT, TYPE } from '../theme';
import type { ProductMetadata } from './types';

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;
  return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{String(value)}</Text></View>;
}

function BulletList({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <View style={styles.bulletList}>{items.map((item) => <View key={item} style={styles.bulletRow}><View style={styles.bullet}/><Text style={styles.bulletText}>{item}</Text></View>)}</View>;
}

function Chips({ values }: { values: Array<string | null | undefined> }) {
  const items = values.filter((value): value is string => Boolean(value));
  if (!items.length) return null;
  return <View style={styles.chips}>{items.map((item) => <View key={item} style={styles.chip}><Text style={styles.chipText}>{item}</Text></View>)}</View>;
}

export function ProductMetadataSections({ description, metadata }: { description?: string; metadata: ProductMetadata }) {
  const dimensions = metadata.dimensions
    ? `${metadata.dimensions.length} × ${metadata.dimensions.width} × ${metadata.dimensions.height} ${metadata.dimensions.unit}`
    : undefined;
  const rating = metadata.averageRating !== undefined
    ? `${metadata.averageRating.toFixed(1)}${metadata.ratingCount ? ` (${metadata.ratingCount})` : ''}`
    : undefined;

  return <View style={styles.wrapper}>
    <Chips values={[
      metadata.verifiedSeller ? 'Verified seller' : null,
      metadata.freeDelivery ? 'Free delivery' : null,
      metadata.organic ? 'Organic' : null,
      metadata.halal ? 'Halal' : null,
      metadata.vegetarian ? 'Vegetarian' : null,
      metadata.prescriptionRequired ? 'Prescription required' : null,
    ]}/>

    {description ? <View><SectionTitle title="About this product"/><RoundedCard style={styles.card}><Text style={styles.description}>{description}</Text></RoundedCard></View> : null}

    <View>
      <SectionTitle title="Product information"/>
      <RoundedCard style={styles.card}>
        <DetailRow label="Brand" value={metadata.brand?.name}/>
        <DetailRow label="Manufacturer" value={metadata.manufacturer}/>
        <DetailRow label="Pack / unit" value={[metadata.unitValue, metadata.unitType].filter(Boolean).join(' ')}/>
        <DetailRow label="Net weight" value={metadata.netWeight}/>
        <DetailRow label="Dimensions" value={dimensions}/>
        <DetailRow label="Country of origin" value={metadata.countryOfOrigin}/>
        <DetailRow label="SKU" value={metadata.sku}/>
        <DetailRow label="Barcode" value={metadata.barcode}/>
        <DetailRow label="Stock" value={metadata.stock !== undefined ? `${metadata.stock} available` : undefined}/>
        <DetailRow label="Maximum per order" value={metadata.maximumCartQuantity}/>
        <DetailRow label="Rating" value={rating}/>
        <DetailRow label="Tax" value={metadata.taxRatePercent !== undefined ? `${metadata.taxRatePercent}%` : undefined}/>
      </RoundedCard>
    </View>

    {metadata.genericNames?.length ? <View><SectionTitle title="Generic / common name"/><RoundedCard style={styles.card}><BulletList items={metadata.genericNames}/></RoundedCard></View> : null}

    {(metadata.nutritionFacts?.length || metadata.nutritionSummary?.length) ? <View>
      <SectionTitle title="Nutritional information"/>
      <RoundedCard style={styles.card}>
        {metadata.nutritionFacts?.map((fact) => <View key={fact.label} style={styles.nutritionRow}><Text style={styles.nutritionLabel}>{fact.label}</Text><Text style={styles.nutritionValue}>{fact.value}</Text></View>)}
        <BulletList items={metadata.nutritionSummary}/>
      </RoundedCard>
    </View> : null}

    {metadata.ingredients?.length ? <View><SectionTitle title="Ingredients"/><RoundedCard style={styles.card}><BulletList items={metadata.ingredients}/></RoundedCard></View> : null}

    {metadata.allergens?.length ? <View>
      <SectionTitle title="Allergen information"/>
      <RoundedCard style={[styles.card, styles.warningCard]}><View style={styles.warningHeader}><Ionicons name="alert-circle-outline" size={20} color={COLORS.red}/><Text style={styles.warningTitle}>Contains / may contain</Text></View><BulletList items={metadata.allergens}/></RoundedCard>
    </View> : null}

    {(metadata.storageInstructions || metadata.careInstructions) ? <View><SectionTitle title="Storage & care"/><RoundedCard style={styles.card}><DetailRow label="Storage" value={metadata.storageInstructions}/><DetailRow label="Care" value={metadata.careInstructions}/></RoundedCard></View> : null}

    {(metadata.warranty || metadata.returnPolicy) ? <View><SectionTitle title="After purchase"/><RoundedCard style={styles.card}><DetailRow label="Warranty" value={metadata.warranty}/><DetailRow label="Returns" value={metadata.returnPolicy}/></RoundedCard></View> : null}
  </View>;
}

const styles = StyleSheet.create({
  wrapper:{gap:18},
  card:{padding:15,gap:0,shadowOpacity:0},
  description:{...TYPE.body,color:COLORS.black,lineHeight:22},
  detailRow:{minHeight:46,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:18,borderBottomWidth:1,borderBottomColor:COLORS.line},
  detailLabel:{...TYPE.small,color:COLORS.muted,flex:1},
  detailValue:{fontFamily:FONT.bold,fontSize:13,fontWeight:'800',color:COLORS.black,textAlign:'right',flex:1.25},
  chips:{flexDirection:'row',flexWrap:'wrap',gap:8},
  chip:{borderRadius:999,backgroundColor:'#F3F1EC',paddingHorizontal:11,paddingVertical:7},
  chipText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'800',color:COLORS.black},
  bulletList:{gap:8,paddingVertical:3},
  bulletRow:{flexDirection:'row',alignItems:'flex-start',gap:9},
  bullet:{width:5,height:5,borderRadius:3,backgroundColor:COLORS.black,marginTop:7},
  bulletText:{...TYPE.body,color:COLORS.black,flex:1,lineHeight:21},
  nutritionRow:{minHeight:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:16,borderBottomWidth:1,borderBottomColor:COLORS.line},
  nutritionLabel:{...TYPE.body,color:COLORS.black},
  nutritionValue:{fontFamily:FONT.bold,fontSize:14,fontWeight:'800',color:COLORS.black},
  warningCard:{backgroundColor:'#FFF7F6'},
  warningHeader:{flexDirection:'row',alignItems:'center',gap:7,marginBottom:9},
  warningTitle:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',color:COLORS.red},
});
