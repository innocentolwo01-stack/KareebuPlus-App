import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header, PrimaryButton, RoundedCard, ScreenShell, SectionTitle } from '../components';
import { DEMO_SHOPS, DemoShop } from '../demoData';
import { formatMoney, primaryMobileMoneyFor, secondaryMobileMoneyFor } from '../locale';
import { COLORS, FONT, SHADOW, TYPE } from '../theme';
import type { CommerceCartLine, CommerceCheckoutDraft, CommerceOrder } from '../parity/types';
import { commerceLongDescriptionFor, commerceProductFor, commerceProductMetadataFor, commerceProductsFor } from './catalog';
import { ProductMetadataSections } from '../catalog/ProductMetadataSections';
import { applyDemand, demandQuote } from '../pricing/demand';

export type CommerceScreenData = {
  country: string;
  city: string;
  selectedShopId: string;
  selectedProductId: string | null;
  cartLines: CommerceCartLine[];
  checkout: CommerceCheckoutDraft;
  lastOrder: CommerceOrder | null;
  deliveryAddress: string;
};

export type CommerceScreenActions = {
  go: (screen: any) => void;
  selectProduct: (productId: string | null) => void;
  addLine: (line: CommerceCartLine) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  updateCheckout: (patch: Partial<CommerceCheckoutDraft>) => void;
  placeOrder: (order: CommerceOrder) => void;
  changeAddress: () => void;
};

function storeFor(id: string): DemoShop {
  return DEMO_SHOPS.find((item) => item.id === id) ?? DEMO_SHOPS[0]!;
}

function variantPrice(base: number, delta: number) {
  return Math.max(0, base + delta);
}

export function CommerceProductScreen({ data, actions }: { data: CommerceScreenData; actions: CommerceScreenActions }) {
  const store = storeFor(data.selectedShopId);
  const product = commerceProductFor(store, data.selectedProductId);
  const productMetadata = commerceProductMetadataFor(product);
  const longDescription = commerceLongDescriptionFor(product);
  const variants = product.variants ?? [{ id: 'default', label: product.detail, priceDelta: 0 }];
  const [variantId, setVariantId] = useState(variants[0]!.id);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [prescriptionAttached, setPrescriptionAttached] = useState(!product.prescriptionRequired);
  const selectedVariant = variants.find((item) => item.id === variantId) ?? variants[0]!;
  const unitPrice = variantPrice(product.basePrice, selectedVariant.priceDelta);
  const lineId = `${store.id}:${product.id}:${selectedVariant.id}`;

  return (
    <ScreenShell>
      <Header title={store.category} onBack={() => actions.go('shop')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.productVisual}><Ionicons name={product.icon as any} size={58} color={COLORS.black}/>{product.badge ? <View style={styles.badge}><Text style={styles.badgeText}>{product.badge}</Text></View> : null}</View>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>{productMetadata.brand?.name}{productMetadata.manufacturer ? ` · ${productMetadata.manufacturer}` : ''}</Text>
        <Text style={styles.productDetail}>{product.detail}</Text>
        <View style={styles.ratingStockRow}><Text style={styles.ratingStockText}>★ {productMetadata.averageRating?.toFixed(1)} · {productMetadata.ratingCount} reviews</Text><Text style={styles.ratingStockText}>{productMetadata.stock !== undefined ? `${productMetadata.stock} in stock` : 'Availability confirmed by pharmacy'}</Text></View>
        <Text style={styles.productPrice}>{formatMoney(data.country, unitPrice)}</Text>

        <SectionTitle title="Choose option" />
        <RoundedCard style={styles.optionCard}>
          {variants.map((variant) => {
            const selected = variant.id === variantId;
            return <Pressable key={variant.id} onPress={() => setVariantId(variant.id)} style={styles.optionRow}><View style={[styles.radio, selected && styles.radioActive]}>{selected ? <View style={styles.radioDot}/> : null}</View><View style={styles.flex}><Text style={styles.optionTitle}>{variant.label}</Text><Text style={styles.optionMeta}>{variant.priceDelta ? `+ ${formatMoney(data.country, variant.priceDelta)}` : 'Included'}</Text></View></Pressable>;
          })}
        </RoundedCard>

        {product.prescriptionRequired ? <RoundedCard style={styles.prescriptionCard}><View style={styles.prescriptionIcon}><Ionicons name="document-attach-outline" size={24} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.optionTitle}>Prescription required</Text><Text style={styles.optionMeta}>Attach a prescription before checkout. This demo stores the approval state locally.</Text></View><Pressable onPress={() => setPrescriptionAttached(true)} style={[styles.attachButton, prescriptionAttached && styles.attachButtonDone]}><Text style={styles.attachButtonText}>{prescriptionAttached ? 'Attached' : 'Attach'}</Text></Pressable></RoundedCard> : null}

        <ProductMetadataSections description={longDescription} metadata={productMetadata}/>

        <SectionTitle title="Order note" />
        <TextInput value={note} onChangeText={setNote} placeholder="Add a note for the store" placeholderTextColor={COLORS.muted} multiline style={styles.noteInput}/>

        <View style={styles.productEndSpacer}/>
      </ScrollView>
      <View style={styles.productStickyFooter}>
        <View style={styles.quantityCompact}><Pressable onPress={() => setQuantity((value) => Math.max(1, value - 1))} style={styles.qtyButton}><Feather name="minus" size={18}/></Pressable><Text style={styles.qtyValue}>{quantity}</Text><Pressable onPress={() => setQuantity((value) => Math.min(99, value + 1))} style={styles.qtyButton}><Feather name="plus" size={18}/></Pressable></View>
        <View style={styles.productStickyButton}><PrimaryButton disabled={!prescriptionAttached} label={`Add · ${formatMoney(data.country, unitPrice * quantity)}`} onPress={() => { actions.addLine({ id: lineId, storeId: store.id, productId: product.id, quantity, unitPrice, variantId: selectedVariant.id, variantLabel: selectedVariant.label, note }); actions.go('commerceCart'); }}/></View>
      </View>
    </ScreenShell>
  );
}

export function CommerceCartScreen({ data, actions }: { data: CommerceScreenData; actions: CommerceScreenActions }) {
  const store = storeFor(data.selectedShopId);
  const products = commerceProductsFor(store);
  const lines = data.cartLines.filter((line) => line.storeId === store.id);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const cartDemand = demandQuote('store-delivery');
  const cartDelivery = applyDemand(store.deliveryFee, cartDemand);
  const minimumRemaining = Math.max(0, store.minOrder - subtotal);
  return (
    <ScreenShell>
      <Header title="Your basket" onBack={() => actions.go('shop')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
        <View><Text style={styles.storeName}>{store.name}</Text><Text style={styles.storeMeta}>{itemCount} item{itemCount === 1 ? '' : 's'} · {store.eta}</Text></View>
        {lines.length ? lines.map((line) => {
          const product = products.find((item) => item.id === line.productId);
          if (!product) return null;
          return <RoundedCard key={line.id} style={styles.cartLine}><View style={styles.cartIcon}><Ionicons name={product.icon as any} size={24}/></View><View style={styles.flex}><Text style={styles.optionTitle}>{product.name}</Text><Text style={styles.optionMeta}>{line.variantLabel ?? product.detail}{line.note ? ` · ${line.note}` : ''}</Text><Text style={styles.linePrice}>{formatMoney(data.country, line.unitPrice * line.quantity)}</Text></View><View style={styles.lineQty}><Pressable onPress={() => actions.setLineQuantity(line.id, line.quantity - 1)}><Feather name="minus" size={16}/></Pressable><Text style={styles.lineQtyText}>{line.quantity}</Text><Pressable onPress={() => actions.setLineQuantity(line.id, line.quantity + 1)}><Feather name="plus" size={16}/></Pressable></View></RoundedCard>;
        }) : <RoundedCard style={styles.empty}><Ionicons name="basket-outline" size={34} color={COLORS.muted}/><Text style={styles.emptyTitle}>Your basket is empty</Text><Text style={styles.emptyBody}>Choose a product from {store.name} to continue.</Text></RoundedCard>}
        {lines.length ? <><RoundedCard style={styles.demandCard}><Ionicons name="pulse-outline" size={20} color={COLORS.red}/><View style={styles.flex}><Text style={styles.demandTitle}>{cartDemand.label} · {cartDemand.multiplier.toFixed(2)}×</Text><Text style={styles.demandMeta}>Delivery changes with courier demand and availability.</Text></View></RoundedCard><RoundedCard style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Items</Text><Text style={styles.summaryValue}>{formatMoney(data.country, subtotal)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={styles.summaryValue}>{cartDelivery.totalFee === 0 ? 'Free' : formatMoney(data.country, cartDelivery.totalFee)}</Text></View><View style={[styles.summaryRow, styles.summaryTotal]}><Text style={styles.summaryTotalText}>Estimated total</Text><Text style={styles.summaryTotalText}>{formatMoney(data.country, subtotal + cartDelivery.totalFee)}</Text></View></RoundedCard>{minimumRemaining > 0 ? <View style={styles.minimum}><Ionicons name="information-circle-outline" size={18} color={COLORS.red}/><Text style={styles.minimumText}>Add {formatMoney(data.country, minimumRemaining)} more to reach the minimum order.</Text></View> : null}<PrimaryButton disabled={minimumRemaining > 0} label="Continue to checkout" onPress={() => actions.go('commerceCheckout')}/></> : null}
      </ScrollView>
    </ScreenShell>
  );
}

export function CommerceCheckoutScreen({ data, actions }: { data: CommerceScreenData; actions: CommerceScreenActions }) {
  const store = storeFor(data.selectedShopId);
  const lines = data.cartLines.filter((line) => line.storeId === store.id);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const deliveryDemand = demandQuote('store-delivery', { scheduled: data.checkout.schedule !== 'Now' });
  const demandDelivery = applyDemand(data.checkout.fulfillment === 'pickup' ? 0 : store.deliveryFee, deliveryDemand);
  const deliveryFee = demandDelivery.totalFee;
  const couponDiscount = data.checkout.couponCode === 'KAREEBU10' ? Math.min(10000, subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);
  const [coupon, setCoupon] = useState(data.checkout.couponCode ?? '');
  const schedules = ['Now', 'Today · 6:30 PM', 'Tomorrow · 9:00 AM'];
  const instructions = ['Hand it to me', 'Leave at reception', 'Call on arrival'];
  const payments: Array<{ id: CommerceCheckoutDraft['paymentMethod']; label: string }> = [
    { id:'mtn', label:primaryMobileMoneyFor(data.country) },
    { id:'airtel', label:secondaryMobileMoneyFor(data.country) },
    { id:'visa', label:'Visa •••• 4242' },
    { id:'cash', label:'Cash on delivery' },
  ];
  return (
    <ScreenShell>
      <Header title="Checkout" onBack={() => actions.go('commerceCart')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.segment}><Pressable onPress={() => actions.updateCheckout({ fulfillment:'delivery' })} style={[styles.segmentItem, data.checkout.fulfillment === 'delivery' && styles.segmentActive]}><Text style={[styles.segmentText, data.checkout.fulfillment === 'delivery' && styles.segmentTextActive]}>Delivery</Text></Pressable><Pressable onPress={() => actions.updateCheckout({ fulfillment:'pickup' })} style={[styles.segmentItem, data.checkout.fulfillment === 'pickup' && styles.segmentActive]}><Text style={[styles.segmentText, data.checkout.fulfillment === 'pickup' && styles.segmentTextActive]}>Pickup</Text></Pressable></View>

        {data.checkout.fulfillment === 'delivery' ? <RoundedCard style={styles.checkoutCard}><View style={styles.checkoutIcon}><Ionicons name="location-outline" size={22} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.checkoutLabel}>Delivery address</Text><Text style={styles.checkoutValue}>{data.deliveryAddress || data.city}</Text></View><Pressable onPress={actions.changeAddress}><Text style={styles.changeText}>Change</Text></Pressable></RoundedCard> : <RoundedCard style={styles.checkoutCard}><View style={styles.checkoutIcon}><Ionicons name="storefront-outline" size={22} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.checkoutLabel}>Pickup from store</Text><Text style={styles.checkoutValue}>{store.name}</Text></View></RoundedCard>}

        <SectionTitle title="When" />
        <View style={styles.chips}>{schedules.map((schedule) => <Pressable key={schedule} onPress={() => actions.updateCheckout({ schedule })} style={[styles.chip, data.checkout.schedule === schedule && styles.chipActive]}><Text style={[styles.chipText, data.checkout.schedule === schedule && styles.chipTextActive]}>{schedule}</Text></Pressable>)}</View>

        {data.checkout.fulfillment === 'delivery' ? <><SectionTitle title="Delivery instructions" /><View style={styles.chips}>{instructions.map((instruction) => <Pressable key={instruction} onPress={() => actions.updateCheckout({ deliveryInstruction:instruction })} style={[styles.chip, data.checkout.deliveryInstruction === instruction && styles.chipActive]}><Text style={[styles.chipText, data.checkout.deliveryInstruction === instruction && styles.chipTextActive]}>{instruction}</Text></Pressable>)}</View></> : null}

        <SectionTitle title="Coupon" />
        <View style={styles.couponRow}><TextInput value={coupon} onChangeText={setCoupon} autoCapitalize="characters" placeholder="Enter code" placeholderTextColor={COLORS.muted} style={styles.couponInput}/><Pressable onPress={() => actions.updateCheckout({ couponCode:coupon.trim().toUpperCase() || null })} style={styles.couponButton}><Text style={styles.couponButtonText}>Apply</Text></Pressable></View>
        {data.checkout.couponCode ? <Text style={styles.applied}>Coupon {data.checkout.couponCode} applied{couponDiscount ? ` · save ${formatMoney(data.country, couponDiscount)}` : ''}</Text> : null}

        <SectionTitle title="Payment" />
        <RoundedCard style={styles.paymentCard}>{payments.map((payment) => { const selected = data.checkout.paymentMethod === payment.id; return <Pressable key={payment.id} onPress={() => actions.updateCheckout({ paymentMethod:payment.id })} style={styles.paymentRow}><View style={[styles.radio, selected && styles.radioActive]}>{selected ? <View style={styles.radioDot}/> : null}</View><Text style={styles.paymentText}>{payment.label}</Text></Pressable>; })}</RoundedCard>

        {data.checkout.fulfillment === 'delivery' ? <RoundedCard style={styles.demandCard}><Ionicons name="pulse-outline" size={20} color={COLORS.red}/><View style={styles.flex}><Text style={styles.demandTitle}>{deliveryDemand.label} · {deliveryDemand.multiplier.toFixed(2)}×</Text><Text style={styles.demandMeta}>{deliveryDemand.reason}. Your delivery quote updates before you confirm.</Text></View></RoundedCard> : null}
        <RoundedCard style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>{itemCount} items</Text><Text style={styles.summaryValue}>{formatMoney(data.country, subtotal)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Base delivery</Text><Text style={styles.summaryValue}>{demandDelivery.baseFee === 0 ? 'Free' : formatMoney(data.country, demandDelivery.baseFee)}</Text></View>{demandDelivery.demandAdjustment !== 0 ? <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Demand adjustment</Text><Text style={styles.summaryValue}>{demandDelivery.demandAdjustment > 0 ? '+' : '−'}{formatMoney(data.country, Math.abs(demandDelivery.demandAdjustment))}</Text></View> : null}{couponDiscount ? <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Coupon</Text><Text style={[styles.summaryValue,{color:COLORS.red}]}>- {formatMoney(data.country, couponDiscount)}</Text></View> : null}<View style={[styles.summaryRow, styles.summaryTotal]}><Text style={styles.summaryTotalText}>Total</Text><Text style={styles.summaryTotalText}>{formatMoney(data.country, total)}</Text></View></RoundedCard>
        <PrimaryButton label={`Place order · ${formatMoney(data.country, total)}`} onPress={() => { const order: CommerceOrder = { id:`K${Date.now().toString().slice(-6)}`, storeId:store.id, itemCount, subtotal, deliveryFee, total, paymentMethod:data.checkout.paymentMethod, fulfillment:data.checkout.fulfillment, schedule:data.checkout.schedule, status:'confirmed' }; actions.placeOrder(order); actions.go('commerceOrderSuccess'); }}/>
      </ScrollView>
    </ScreenShell>
  );
}

export function CommerceOrderSuccessScreen({ data, actions }: { data: CommerceScreenData; actions: CommerceScreenActions }) {
  const order = data.lastOrder;
  const store = storeFor(order?.storeId ?? data.selectedShopId);
  if (!order) return <CommerceCartScreen data={data} actions={actions}/>;
  return <ScreenShell><ScrollView style={styles.flex} contentContainerStyle={styles.success}><View style={styles.successIcon}><Feather name="check" size={42} color={COLORS.black}/></View><Text style={styles.successTitle}>Order confirmed</Text><Text style={styles.successBody}>{store.name} has received order #{order.id}. We’ll update you as it moves from packing to courier delivery.</Text><RoundedCard style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Items</Text><Text style={styles.summaryValue}>{order.itemCount}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={styles.summaryValue}>{order.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>When</Text><Text style={styles.summaryValue}>{order.schedule}</Text></View><View style={[styles.summaryRow,styles.summaryTotal]}><Text style={styles.summaryTotalText}>Total</Text><Text style={styles.summaryTotalText}>{formatMoney(data.country,order.total)}</Text></View></RoundedCard><PrimaryButton label="View order" onPress={() => actions.go('orders')}/><Pressable onPress={() => actions.go('home')}><Text style={styles.homeLink}>Back to home</Text></Pressable></ScrollView></ScreenShell>;
}

const styles = StyleSheet.create({
  flex:{flex:1}, scroll:{paddingHorizontal:14,paddingTop:12,paddingBottom:34,gap:12},
  productVisual:{height:190,borderRadius:24,backgroundColor:'#F7F4EE',alignItems:'center',justifyContent:'center',position:'relative'}, badge:{position:'absolute',left:14,top:14,borderRadius:12,backgroundColor:COLORS.yellow,paddingHorizontal:10,paddingVertical:6}, badgeText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900'},
  productName:{fontFamily:FONT.bold,fontSize:27,lineHeight:32,fontWeight:'900',color:COLORS.black}, productBrand:{fontFamily:FONT.bold,fontSize:13,fontWeight:'800',color:COLORS.red,marginTop:-8}, productDetail:{...TYPE.body,color:COLORS.muted,lineHeight:21}, ratingStockRow:{flexDirection:'row',justifyContent:'space-between',gap:12,flexWrap:'wrap'}, ratingStockText:{...TYPE.small,color:COLORS.muted}, productPrice:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900'},
  optionCard:{paddingHorizontal:14,shadowOpacity:0}, optionRow:{minHeight:66,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:COLORS.line}, radio:{width:23,height:23,borderRadius:12,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'}, radioActive:{borderColor:COLORS.red}, radioDot:{width:11,height:11,borderRadius:6,backgroundColor:COLORS.red}, optionTitle:{...TYPE.cardTitle}, optionMeta:{...TYPE.small,color:COLORS.muted,marginTop:3},
  prescriptionCard:{padding:14,flexDirection:'row',alignItems:'center',gap:11,backgroundColor:'#FFF7F6'}, prescriptionIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#FFE5E1',alignItems:'center',justifyContent:'center'}, attachButton:{height:34,borderRadius:12,backgroundColor:COLORS.red,paddingHorizontal:12,alignItems:'center',justifyContent:'center'}, attachButtonDone:{backgroundColor:COLORS.black}, attachButtonText:{fontFamily:FONT.bold,fontSize:12,color:COLORS.white},
  noteInput:{minHeight:88,borderWidth:1,borderColor:COLORS.line,borderRadius:16,padding:14,textAlignVertical:'top',fontFamily:FONT.regular,fontSize:15,color:COLORS.black}, quantityRow:{height:52,alignSelf:'center',flexDirection:'row',alignItems:'center',gap:12}, qtyButton:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white}, qtyValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900'}, productEndSpacer:{height:18},productStickyFooter:{minHeight:78,borderTopWidth:1,borderTopColor:COLORS.line,backgroundColor:COLORS.white,paddingHorizontal:16,paddingVertical:10,flexDirection:'row',alignItems:'center',gap:12},quantityCompact:{height:54,borderRadius:17,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:7},productStickyButton:{flex:1},
  storeName:{...TYPE.screenTitle},storeMeta:{...TYPE.body,color:COLORS.muted,marginTop:4}, cartLine:{minHeight:92,padding:13,flexDirection:'row',alignItems:'center',gap:11,shadowOpacity:0}, cartIcon:{width:48,height:48,borderRadius:15,backgroundColor:'#F7F4EE',alignItems:'center',justifyContent:'center'}, linePrice:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',marginTop:6}, lineQty:{height:34,borderRadius:12,borderWidth:1,borderColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:9},lineQtyText:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900'}, empty:{padding:28,alignItems:'center',gap:9},emptyTitle:{...TYPE.sectionTitle},emptyBody:{...TYPE.body,color:COLORS.muted,textAlign:'center'},
  demandCard:{padding:13,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#FFF8E8',shadowOpacity:0},demandTitle:{...TYPE.bodyStrong,color:COLORS.black},demandMeta:{...TYPE.small,color:COLORS.muted,marginTop:2},
  summary:{padding:15,gap:10,shadowOpacity:0},summaryRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},summaryLabel:{...TYPE.body,color:COLORS.muted},summaryValue:{...TYPE.bodyStrong},summaryTotal:{borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:12,marginTop:3},summaryTotalText:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900'},minimum:{flexDirection:'row',alignItems:'center',gap:8},minimumText:{...TYPE.small,color:COLORS.red,flex:1},
  segment:{height:48,borderRadius:16,backgroundColor:COLORS.surface,flexDirection:'row',padding:4},segmentItem:{flex:1,borderRadius:12,alignItems:'center',justifyContent:'center'},segmentActive:{backgroundColor:COLORS.black},segmentText:{...TYPE.label,color:COLORS.muted},segmentTextActive:{color:COLORS.white},checkoutCard:{padding:14,flexDirection:'row',alignItems:'center',gap:11,shadowOpacity:0},checkoutIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#FFF0EE',alignItems:'center',justifyContent:'center'},checkoutLabel:{...TYPE.caption,color:COLORS.muted},checkoutValue:{...TYPE.cardTitle,marginTop:3},changeText:{...TYPE.action,color:COLORS.red},
  chips:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{minHeight:38,borderWidth:1,borderColor:COLORS.line,borderRadius:18,paddingHorizontal:13,alignItems:'center',justifyContent:'center'},chipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},chipText:{...TYPE.small,color:COLORS.black,fontWeight:'700'},chipTextActive:{color:COLORS.white}, couponRow:{height:52,flexDirection:'row',gap:8},couponInput:{flex:1,borderWidth:1,borderColor:COLORS.line,borderRadius:14,paddingHorizontal:14,fontFamily:FONT.regular,fontSize:15},couponButton:{width:86,borderRadius:14,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center'},couponButtonText:{fontFamily:FONT.bold,fontSize:13,color:COLORS.white},applied:{...TYPE.small,color:COLORS.red},paymentCard:{paddingHorizontal:14,shadowOpacity:0},paymentRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:11,borderBottomWidth:1,borderBottomColor:COLORS.line},paymentText:{...TYPE.bodyStrong},
  success:{flexGrow:1,paddingHorizontal:18,paddingTop:80,paddingBottom:32,gap:12,justifyContent:'center'},successIcon:{width:84,height:84,borderRadius:42,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',alignSelf:'center'},successTitle:{fontFamily:FONT.bold,fontSize:30,fontWeight:'900',textAlign:'center'},successBody:{...TYPE.body,color:COLORS.muted,textAlign:'center',lineHeight:22},homeLink:{...TYPE.action,color:COLORS.red,textAlign:'center',paddingVertical:8},
});
