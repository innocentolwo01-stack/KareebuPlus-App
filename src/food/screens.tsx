import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppField, Header, PaymentLogo, PrimaryButton, RoundedCard, ScreenShell, TextButton } from '../components';
import { assets } from '../assets';
import type { DemoMenuItem, DemoRestaurant } from '../demoData';
import { formatMoney } from '../locale';
import { COLORS, FONT, SHADOW, TYPE } from '../theme';
import { defaultSelectionsFor, foodConfigurationFor } from './catalog';
import { bestFoodCoupon, configuredUnitPrice, FOOD_COUPON_CODES, foodCartLineId, foodCheckoutTotals, foodItemCount, foodSubtotal } from './pricing';
import type { FoodCartLine, FoodCheckoutDraft, FoodOrder, FoodPaymentMethod } from './types';
import { ProductMetadataSections } from '../catalog/ProductMetadataSections';
import { foodProductMetadataFor } from './productMetadata';

export function FoodItemDetailsView({
  country,
  restaurant,
  item,
  onBack,
  onAdd,
}: {
  country: string;
  restaurant: DemoRestaurant;
  item: DemoMenuItem;
  onBack: () => void;
  onAdd: (line: FoodCartLine) => void;
}) {
  const config = useMemo(() => foodConfigurationFor(item), [item]);
  const productMetadata = useMemo(() => foodProductMetadataFor(item, restaurant), [item, restaurant]);
  const [selections, setSelections] = useState<Record<string, string>>(() => defaultSelectionsFor(item));
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  const unitPrice = configuredUnitPrice(item, selections, addonIds);
  const total = unitPrice * quantity;
  const missingRequired = config.choiceGroups.some((group) => group.required && !selections[group.id]);

  const toggleAddon = (addonId: string) => {
    setAddonIds((current) => current.includes(addonId) ? current.filter((id) => id !== addonId) : [...current, addonId]);
  };

  const addToCart = () => {
    if (missingRequired) {
      Alert.alert('Choose an option', 'Please complete all required choices before adding this item.');
      return;
    }
    onAdd({
      id: foodCartLineId(item.id, selections, addonIds),
      restaurantId: restaurant.id,
      itemId: item.id,
      quantity,
      selections,
      addonIds,
      specialInstructions: instructions.trim(),
      unitPrice,
    });
  };

  return (
    <ScreenShell>
      <Header title="Item details" onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.itemScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.itemHeroWrap}>
          <Image source={assets.food[item.image]} style={styles.itemHero} resizeMode="cover" />
          {item.badge ? <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>{item.badge}</Text></View> : null}
        </View>
        <View>
          <Text style={styles.itemRestaurant}>{restaurant.name}</Text>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemBasePrice}>From {formatMoney(country, item.price)}</Text>
        </View>

        {config.choiceGroups.map((group) => (
          <View key={group.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.flex}>
                <Text style={styles.sectionTitle}>{group.title}</Text>
                <Text style={styles.sectionSubtitle}>{group.subtitle ?? (group.required ? 'Required' : 'Optional')}</Text>
              </View>
              {group.required ? <View style={styles.requiredPill}><Text style={styles.requiredPillText}>Required</Text></View> : null}
            </View>
            <RoundedCard style={styles.optionCard}>
              {group.options.map((option, index) => {
                const selected = selections[group.id] === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => setSelections((current) => ({ ...current, [group.id]: option.id }))}
                    style={[styles.optionRow, index > 0 && styles.optionDivider]}
                  >
                    <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionPrice}>{option.priceDelta > 0 ? `+${formatMoney(country, option.priceDelta)}` : 'Included'}</Text>
                  </Pressable>
                );
              })}
            </RoundedCard>
          </View>
        ))}

        {config.addons.length ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.flex}><Text style={styles.sectionTitle}>Add extras</Text><Text style={styles.sectionSubtitle}>Optional · choose as many as you like</Text></View>
            </View>
            <RoundedCard style={styles.optionCard}>
              {config.addons.map((addon, index) => {
                const selected = addonIds.includes(addon.id);
                return (
                  <Pressable key={addon.id} onPress={() => toggleAddon(addon.id)} style={[styles.optionRow, index > 0 && styles.optionDivider]}>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>{selected ? <Feather name="check" size={14} color={COLORS.white} /> : null}</View>
                    <Text style={styles.optionLabel}>{addon.label}</Text>
                    <Text style={styles.optionPrice}>+{formatMoney(country, addon.price)}</Text>
                  </Pressable>
                );
              })}
            </RoundedCard>
          </View>
        ) : null}

        <ProductMetadataSections description={item.description} metadata={productMetadata}/>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special instructions</Text>
          <Text style={styles.sectionSubtitle}>We’ll pass this note to the restaurant.</Text>
          <AppField value={instructions} onChangeText={setInstructions} placeholder="e.g. no onions, sauce on the side" multiline />
        </View>

        <View style={styles.quantitySection}>
          <View><Text style={styles.sectionTitle}>Quantity</Text><Text style={styles.sectionSubtitle}>Maximum {config.maxQuantity}</Text></View>
          <View style={styles.quantityControl}>
            <Pressable onPress={() => setQuantity((value) => Math.max(1, value - 1))} style={styles.quantityButton}><Feather name="minus" size={18} color={COLORS.black} /></Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable onPress={() => setQuantity((value) => Math.min(config.maxQuantity, value + 1))} style={styles.quantityButton}><Feather name="plus" size={18} color={COLORS.black} /></Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={styles.stickyFooter}>
        <View><Text style={styles.footerLabel}>{quantity} item{quantity === 1 ? '' : 's'}</Text><Text style={styles.footerTotal}>{formatMoney(country, total)}</Text></View>
        <View style={styles.footerButton}><PrimaryButton label="Add to cart" onPress={addToCart} /></View>
      </View>
    </ScreenShell>
  );
}

function PaymentMethodRow({ id, selected, country, onPress }: { id: FoodPaymentMethod; selected: boolean; country: string; onPress: () => void }) {
  const title = id === 'cash' ? 'Cash on delivery' : id === 'visa' ? 'Visa •••• 4242' : id === 'airtel' ? 'Airtel Money' : country === 'Kenya' ? 'M-PESA' : country === 'Tanzania' ? 'M-Pesa' : 'MTN MoMo';
  const detail = id === 'cash' ? 'Pay when the order arrives' : id === 'visa' ? 'Card payment' : 'Mobile money';
  return (
    <Pressable onPress={onPress} style={styles.paymentRow}>
      {id === 'cash' ? <View style={styles.cashIcon}><Ionicons name="cash-outline" size={22} color={COLORS.black} /></View> : <PaymentLogo source={id === 'visa' ? assets.payment.visa : id === 'airtel' ? assets.payment.airtel : assets.payment.mtn} />}
      <View style={styles.flex}><Text style={styles.paymentTitle}>{title}</Text><Text style={styles.paymentDetail}>{detail}</Text></View>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
    </Pressable>
  );
}

export function FoodCheckoutView({
  country,
  city,
  addressLabel,
  restaurant,
  lines,
  draft,
  onBack,
  onChangeAddress,
  onUpdateDraft,
  onPlaceOrder,
}: {
  country: string;
  city: string;
  addressLabel: string;
  restaurant: DemoRestaurant;
  lines: FoodCartLine[];
  draft: FoodCheckoutDraft;
  onBack: () => void;
  onChangeAddress: () => void;
  onUpdateDraft: (patch: Partial<FoodCheckoutDraft>) => void;
  onPlaceOrder: (order: FoodOrder) => void;
}) {
  const [couponInput, setCouponInput] = useState(draft.couponCode ?? '');
  const totals = foodCheckoutTotals(restaurant, lines, draft);
  const itemCount = foodItemCount(lines);
  const scheduleOptions = ['Now', '30–45 min', '60–75 min', 'Tomorrow · 12:30'];
  const instructions = ['Hand it to me', 'Leave at door', 'Meet outside', 'Call on arrival'];
  const tipOptions = [0, 1000, 2000, 5000];

  useEffect(() => {
    if (draft.couponCode) return;
    const best = bestFoodCoupon(restaurant, lines, draft);
    if (best) { setCouponInput(best); onUpdateDraft({ couponCode: best }); }
  }, [draft, lines, onUpdateDraft, restaurant]);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if ((FOOD_COUPON_CODES as readonly string[]).includes(code)) onUpdateDraft({ couponCode: code });
    else {
      onUpdateDraft({ couponCode: null });
      Alert.alert('No configured coupon', 'Food coupon benefits appear only when supplied by configured campaign data.');
    }
  };

  const placeOrder = () => {
    const now = new Date();
    onPlaceOrder({
      id: `KRB-${String(now.getTime()).slice(-6)}`,
      restaurantId: restaurant.id,
      placedAt: now.toISOString(),
      etaMinutes: draft.orderType === 'takeaway' ? 18 : 28,
      total: totals.total,
      itemCount,
      orderType: draft.orderType,
      schedule: draft.schedule,
      deliveryInstruction: draft.deliveryInstruction,
      paymentMethod: draft.paymentMethod,
      status: 'confirmed',
    });
  };

  return (
    <ScreenShell>
      <Header title="Checkout" onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.checkoutScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.checkoutStore}><View><Text style={styles.checkoutStoreLabel}>Ordering from</Text><Text style={styles.checkoutStoreName}>{restaurant.name}</Text></View><Text style={styles.checkoutItemCount}>{itemCount} item{itemCount === 1 ? '' : 's'}</Text></View>

        <View style={styles.segmented}>
          {(['delivery', 'takeaway'] as const).map((type) => {
            const active = draft.orderType === type;
            return <Pressable key={type} onPress={() => onUpdateDraft({ orderType: type })} style={[styles.segment, active && styles.segmentActive]}><Ionicons name={type === 'delivery' ? 'bicycle-outline' : 'bag-handle-outline'} size={19} color={active ? COLORS.white : COLORS.black} /><Text style={[styles.segmentText, active && styles.segmentTextActive]}>{type === 'delivery' ? 'Delivery' : 'Pickup'}</Text></Pressable>;
          })}
        </View>

        {draft.orderType === 'delivery' ? (
          <View style={styles.checkoutSection}>
            <Text style={styles.checkoutSectionTitle}>Delivery address</Text>
            <RoundedCard style={styles.addressCard}>
              <View style={styles.addressIcon}><Ionicons name="location" size={22} color={COLORS.red} /></View>
              <View style={styles.flex}><Text style={styles.addressTitle}>{addressLabel}</Text><Text style={styles.addressDetail}>{city} · delivery zone</Text></View>
              <TextButton label="Change" onPress={onChangeAddress} color={COLORS.red} />
            </RoundedCard>
          </View>
        ) : (
          <RoundedCard style={styles.pickupCard}><Ionicons name="storefront-outline" size={22} color={COLORS.black}/><View style={styles.flex}><Text style={styles.addressTitle}>Collect from {restaurant.name}</Text><Text style={styles.addressDetail}>We’ll notify you when the order is ready.</Text></View></RoundedCard>
        )}

        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutSectionTitle}>When?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {scheduleOptions.map((option) => <Pressable key={option} onPress={() => onUpdateDraft({ schedule: option })} style={[styles.choiceChip, draft.schedule === option && styles.choiceChipActive]}><Text style={[styles.choiceChipText, draft.schedule === option && styles.choiceChipTextActive]}>{option}</Text></Pressable>)}
          </ScrollView>
        </View>

        {draft.orderType === 'delivery' ? (
          <View style={styles.checkoutSection}>
            <Text style={styles.checkoutSectionTitle}>Delivery instructions</Text>
            <View style={styles.instructionGrid}>{instructions.map((instruction) => <Pressable key={instruction} onPress={() => onUpdateDraft({ deliveryInstruction: instruction })} style={[styles.instructionCard, draft.deliveryInstruction === instruction && styles.instructionCardActive]}><Text style={[styles.instructionText, draft.deliveryInstruction === instruction && styles.instructionTextActive]}>{instruction}</Text></Pressable>)}</View>
          </View>
        ) : null}

        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutSectionTitle}>Coupon</Text>
          <View style={styles.couponRow}><View style={styles.couponInputWrap}><Ionicons name="ticket-outline" size={19} color={COLORS.red}/><TextInput value={couponInput} onChangeText={setCouponInput} autoCapitalize="characters" placeholder="Enter coupon code" placeholderTextColor={COLORS.mutedLight} style={styles.couponInput}/></View><Pressable onPress={applyCoupon} style={styles.applyButton}><Text style={styles.applyButtonText}>Apply</Text></Pressable></View>
          {draft.couponCode ? <View style={styles.successRow}><Feather name="check-circle" size={17} color={COLORS.green}/><Text style={styles.successText}>{draft.couponCode} applied</Text><TextButton label="Remove" onPress={() => { setCouponInput(''); onUpdateDraft({ couponCode: null }); }} color={COLORS.red}/></View> : null}
        </View>

        {draft.orderType === 'delivery' ? (
          <View style={styles.checkoutSection}>
            <Text style={styles.checkoutSectionTitle}>Tip your courier</Text>
            <View style={styles.tipRow}>{tipOptions.map((tip) => <Pressable key={tip} onPress={() => onUpdateDraft({ tip })} style={[styles.tipChip, draft.tip === tip && styles.tipChipActive]}><Text style={[styles.tipText, draft.tip === tip && styles.tipTextActive]}>{tip === 0 ? 'Not now' : formatMoney(country, tip)}</Text></Pressable>)}</View>
          </View>
        ) : null}

        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutSectionTitle}>Payment method</Text>
          <RoundedCard style={styles.paymentCard}>
            {(['mtn', 'airtel', 'visa', 'cash'] as const).map((id) => <PaymentMethodRow key={id} id={id} selected={draft.paymentMethod === id} country={country} onPress={() => onUpdateDraft({ paymentMethod: id })} />)}
          </RoundedCard>
        </View>

        {draft.orderType === 'delivery' ? <RoundedCard style={styles.demandCard}><View style={styles.demandIcon}><Ionicons name="pulse-outline" size={21} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.demandTitle}>{totals.demand.label} · {totals.demand.multiplier.toFixed(2)}×</Text><Text style={styles.demandMeta}>{totals.demand.reason}. Delivery pricing updates with courier availability.</Text></View></RoundedCard> : null}

        <RoundedCard style={styles.totalCard}>
          <PriceRow label="Subtotal" value={formatMoney(country, totals.subtotal)} />
          {totals.discount > 0 ? <PriceRow label="Coupon discount" value={`−${formatMoney(country, totals.discount)}`} positive /> : null}
          <PriceRow label={draft.orderType === 'takeaway' ? 'Pickup' : 'Base delivery'} value={totals.baseDeliveryFee === 0 ? 'FREE' : formatMoney(country, totals.baseDeliveryFee)} />
          {draft.orderType === 'delivery' && totals.deliveryDemandAdjustment !== 0 ? <PriceRow label={`Demand · ${totals.demand.label}`} value={`${totals.deliveryDemandAdjustment > 0 ? '+' : '−'}${formatMoney(country, Math.abs(totals.deliveryDemandAdjustment))}`} /> : null}
          <PriceRow label="Service fee" value={formatMoney(country, totals.serviceFee)} />
          {totals.tip > 0 ? <PriceRow label="Courier tip" value={formatMoney(country, totals.tip)} /> : null}
          <View style={styles.totalDivider}/>
          <PriceRow label="Total" value={formatMoney(country, totals.total)} total />
        </RoundedCard>

        <PrimaryButton label={`Place order · ${formatMoney(country, totals.total)}`} onPress={placeOrder} disabled={!lines.length} />
        <Text style={styles.checkoutTrust}>Secure checkout · live status updates · Kareebu support</Text>
      </ScrollView>
    </ScreenShell>
  );
}

function PriceRow({ label, value, positive = false, total = false }: { label: string; value: string; positive?: boolean; total?: boolean }) {
  return <View style={styles.priceRow}><Text style={[styles.priceLabel, total && styles.totalLabel, positive && styles.positive]}>{label}</Text><Text style={[styles.priceValue, total && styles.totalValue, positive && styles.positive]}>{value}</Text></View>;
}

export function FoodOrderSuccessView({ country, restaurant, order, onTrack, onHome }: { country: string; restaurant: DemoRestaurant; order: FoodOrder; onTrack: () => void; onHome: () => void }) {
  return (
    <ScreenShell>
      <ScrollView style={styles.flex} contentContainerStyle={styles.successScroll}>
        <View style={styles.successIcon}><Feather name="check" size={40} color={COLORS.white}/></View>
        <Text style={styles.successTitle}>Order placed</Text>
        <Text style={styles.successBody}>{restaurant.name} has received your order.</Text>
        <RoundedCard style={styles.orderReceipt}>
          <View style={styles.receiptTop}><Text style={styles.receiptId}>Order #{order.id}</Text><View style={styles.livePill}><View style={styles.liveDot}/><Text style={styles.liveText}>Confirmed</Text></View></View>
          <Text style={styles.receiptEta}>{order.schedule === 'Now' ? `Estimated arrival in ${order.etaMinutes} min` : `Scheduled · ${order.schedule}`}</Text>
          <View style={styles.receiptDivider}/>
          <PriceRow label={`${order.itemCount} item${order.itemCount === 1 ? '' : 's'}`} value={formatMoney(country, order.total)} total />
          <Text style={styles.receiptMeta}>{order.orderType === 'delivery' ? order.deliveryInstruction : 'Pickup order'} · {order.paymentMethod === 'cash' ? 'Cash' : order.paymentMethod.toUpperCase()}</Text>
        </RoundedCard>
        <PrimaryButton label="Track order" onPress={onTrack}/>
        <TextButton label="Back to home" onPress={onHome} color={COLORS.red}/>
      </ScrollView>
    </ScreenShell>
  );
}

export function cartLineDescription(item: DemoMenuItem, line: FoodCartLine) {
  const config = foodConfigurationFor(item);
  const choices = config.choiceGroups.map((group) => group.options.find((option) => option.id === line.selections[group.id])?.label).filter(Boolean);
  const addons = config.addons.filter((addon) => line.addonIds.includes(addon.id)).map((addon) => addon.label);
  return [...choices, ...addons].join(' · ');
}

export function calculateFoodCartSubtotal(lines: FoodCartLine[]) {
  return foodSubtotal(lines);
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  itemScroll: { paddingHorizontal: 14, paddingBottom: 104, gap: 14 },
  itemHeroWrap: { height: 188, borderRadius: 18, overflow: 'hidden', backgroundColor: COLORS.surfaceStrong, position: 'relative' },
  itemHero: { width: '100%', height: '100%' },
  heroBadge: { position: 'absolute', left: 14, top: 14, borderRadius: 12, backgroundColor: COLORS.red, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { fontFamily: FONT.bold, fontWeight: '900', fontSize: 11, color: COLORS.white },
  itemRestaurant: { ...TYPE.small, color: COLORS.red, fontWeight: '800' },
  itemTitle: { fontFamily: FONT.bold, fontWeight: '900', fontSize: 22, lineHeight: 27, color: COLORS.black, marginTop: 5 },
  itemDescription: { ...TYPE.body, color: COLORS.muted, lineHeight: 21, marginTop: 5 },
  itemBasePrice: { ...TYPE.bodyStrong, color: COLORS.black, marginTop: 10 },
  section: { gap: 7 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { ...TYPE.sectionTitle, color: COLORS.black },
  sectionSubtitle: { ...TYPE.small, color: COLORS.muted, marginTop: 3 },
  requiredPill: { borderRadius: 10, backgroundColor: '#FFF0EE', paddingHorizontal: 9, paddingVertical: 5 },
  requiredPillText: { fontFamily: FONT.bold, fontWeight: '900', fontSize: 10, color: COLORS.red },
  optionCard: { paddingHorizontal: 14, shadowOpacity: 0 },
  optionRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionDivider: { borderTopWidth: 1, borderTopColor: COLORS.line },
  optionLabel: { flex: 1, ...TYPE.bodyStrong, color: COLORS.black },
  optionPrice: { ...TYPE.small, color: COLORS.muted },
  radio: { width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: COLORS.lineDark, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: COLORS.red },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: COLORS.red },
  checkbox: { width: 23, height: 23, borderRadius: 7, borderWidth: 1.5, borderColor: COLORS.lineDark, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { borderColor: COLORS.red, backgroundColor: COLORS.red },
  quantitySection: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quantityControl: { height: 40, borderRadius: 13, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white },
  quantityButton: { width: 40, height: 38, alignItems: 'center', justifyContent: 'center' },
  quantityValue: { width: 34, textAlign: 'center', ...TYPE.bodyStrong, color: COLORS.black },
  stickyFooter: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 76, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.white, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 18, ...SHADOW },
  footerLabel: { ...TYPE.caption, color: COLORS.muted },
  footerTotal: { ...TYPE.sectionTitle, color: COLORS.black, marginTop: 2 },
  footerButton: { flex: 1 },
  checkoutScroll: { paddingHorizontal: 14, paddingBottom: 24, gap: 14 },
  checkoutStore: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  checkoutStoreLabel: { ...TYPE.caption, color: COLORS.muted },
  checkoutStoreName: { ...TYPE.sectionTitle, color: COLORS.black, marginTop: 3 },
  checkoutItemCount: { ...TYPE.small, color: COLORS.muted },
  segmented: { height: 46, padding: 3, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, flexDirection: 'row', gap: 4 },
  segment: { flex: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  segmentActive: { backgroundColor: COLORS.black },
  segmentText: { ...TYPE.bodyStrong, color: COLORS.black },
  segmentTextActive: { color: COLORS.white },
  checkoutSection: { gap: 8 },
  checkoutSectionTitle: { ...TYPE.sectionTitle, color: COLORS.black },
  addressCard: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, shadowOpacity: 0 },
  pickupCard: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, backgroundColor: '#FFF9E1', shadowOpacity: 0 },
  addressIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF0EE', alignItems: 'center', justifyContent: 'center' },
  addressTitle: { ...TYPE.bodyStrong, color: COLORS.black },
  addressDetail: { ...TYPE.small, color: COLORS.muted, marginTop: 3 },
  chipRow: { gap: 8, paddingRight: 8 },
  choiceChip: { height: 36, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  choiceChipActive: { borderColor: COLORS.red, backgroundColor: '#FFF6F4' },
  choiceChipText: { ...TYPE.small, color: COLORS.black, fontWeight: '700' },
  choiceChipTextActive: { color: COLORS.red, fontWeight: '900' },
  instructionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 9 },
  instructionCard: { width: '48.5%', minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  instructionCardActive: { borderColor: COLORS.red, backgroundColor: '#FFF6F4' },
  instructionText: { ...TYPE.small, color: COLORS.black, textAlign: 'center', fontWeight: '700' },
  instructionTextActive: { color: COLORS.red },
  couponRow: { flexDirection: 'row', gap: 8 },
  couponInputWrap: { flex: 1, height: 46, borderRadius: 15, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 13 },
  couponInput: { flex: 1, ...TYPE.body, color: COLORS.black, paddingVertical: 0 },
  applyButton: { minWidth: 70, height: 46, borderRadius: 15, backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center' },
  applyButtonText: { ...TYPE.action, color: COLORS.white },
  successRow: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 7 },
  successText: { flex: 1, ...TYPE.small, color: COLORS.green, fontWeight: '800' },
  tipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipChip: { minWidth: 68, height: 36, paddingHorizontal: 12, borderRadius: 13, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  tipChipActive: { backgroundColor: COLORS.yellow, borderColor: COLORS.yellow },
  tipText: { ...TYPE.small, color: COLORS.black, fontWeight: '700' },
  tipTextActive: { fontWeight: '900' },
  paymentCard: { paddingHorizontal: 14, shadowOpacity: 0 },
  paymentRow: { minHeight: 58, borderBottomWidth: 1, borderBottomColor: COLORS.line, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cashIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#F2F3F3', alignItems: 'center', justifyContent: 'center' },
  paymentTitle: { ...TYPE.bodyStrong, color: COLORS.black },
  paymentDetail: { ...TYPE.caption, color: COLORS.muted, marginTop: 3 },
  demandCard: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#FFF8E8', shadowOpacity: 0 },
  demandIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFEBC2', alignItems: 'center', justifyContent: 'center' },
  demandTitle: { ...TYPE.bodyStrong, color: COLORS.black },
  demandMeta: { ...TYPE.small, color: COLORS.muted, marginTop: 3, flexShrink: 1 },
  totalCard: { padding: 13, gap: 8, shadowOpacity: 0, backgroundColor: COLORS.surface },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  priceLabel: { ...TYPE.body, color: COLORS.muted },
  priceValue: { ...TYPE.bodyStrong, color: COLORS.black },
  totalDivider: { height: 1, backgroundColor: COLORS.line, marginVertical: 2 },
  totalLabel: { ...TYPE.sectionTitle, color: COLORS.black },
  totalValue: { ...TYPE.sectionTitle, color: COLORS.black },
  positive: { color: COLORS.green },
  checkoutTrust: { ...TYPE.caption, color: COLORS.muted, textAlign: 'center' },
  successScroll: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 34, paddingBottom: 24, alignItems: 'stretch', gap: 13 },
  successIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  successTitle: { fontFamily: FONT.bold, fontSize: 24, lineHeight: 29, fontWeight: '900', color: COLORS.black, textAlign: 'center' },
  successBody: { ...TYPE.body, color: COLORS.muted, textAlign: 'center', marginTop: -8 },
  orderReceipt: { padding: 16, gap: 12, shadowOpacity: 0 },
  receiptTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  receiptId: { ...TYPE.cardTitle, color: COLORS.black },
  livePill: { borderRadius: 11, backgroundColor: '#EAF7EC', paddingHorizontal: 9, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.green },
  liveText: { fontFamily: FONT.bold, fontWeight: '900', fontSize: 10, color: COLORS.green },
  receiptEta: { ...TYPE.bodyStrong, color: COLORS.red },
  receiptDivider: { height: 1, backgroundColor: COLORS.line },
  receiptMeta: { ...TYPE.small, color: COLORS.muted },
});
