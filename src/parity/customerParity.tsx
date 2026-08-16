import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Header, MenuRow, PrimaryButton, RoundedCard, ScreenShell, SectionTitle, TextButton } from '../components';
import { COLORS, FONT, SHADOW, TYPE } from '../theme';
import type { Screen, SupportTicket, WalletTransaction } from '../types';
import { formatMoney } from '../locale';
import { assets } from '../assets';

type Go = (screen: Screen) => void;

export type CustomerParityData = {
  country: string;
  city: string;
  fullName: string;
  email: string;
  phone: string;
  walletBalance: number;
  rewardPoints: number;
  selectedPayment: 'mtn' | 'airtel' | 'visa';
  walletTransactions: WalletTransaction[];
  supportTickets: SupportTicket[];
};

export type CustomerParityActions = {
  go: Go;
  setWalletBalance: (value: number) => void;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  recordWalletTransaction: (transaction: Omit<WalletTransaction, 'id' | 'createdAt'>) => void;
  createSupportTicket: (ticket: Pick<SupportTicket, 'title' | 'detail'>) => void;
};

const quickAmounts = [5000, 10000, 20000, 50000, 100000];

function recordPayment(actions: CustomerParityActions, title: string, meta: string, amount: number, kind: WalletTransaction['kind']) {
  actions.recordWalletTransaction({ title, meta, amount, kind });
}


function CompactHeader({ title, back, right }: { title: string; back: () => void; right?: React.ReactNode }) {
  return <Header title={title} onBack={back} right={right} />;
}

function Page({ children }: { children: React.ReactNode }) {
  return <ScrollView style={styles.flex} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

function Field({ value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric' | 'email-address';
  multiline?: boolean;
}) {
  return <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={COLORS.mutedLight} keyboardType={keyboardType} multiline={multiline} style={[styles.input, multiline && styles.inputMultiline]} />;
}

function MoneyChip({ amount, onPress, selected = false }: { amount: number; onPress: () => void; selected?: boolean }) {
  return <Pressable onPress={onPress} style={[styles.moneyChip, selected && styles.moneyChipActive]}><Text style={[styles.moneyChipText, selected && styles.moneyChipTextActive]}>UGX {amount.toLocaleString()}</Text></Pressable>;
}

function SuccessState({ icon, title, body, button, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; button: string; onPress: () => void }) {
  return <View style={styles.successWrap}><View style={styles.successIcon}><Ionicons name={icon} size={38} color={COLORS.black}/></View><Text style={styles.successTitle}>{title}</Text><Text style={styles.successBody}>{body}</Text><PrimaryButton label={button} onPress={onPress}/></View>;
}

function PayHero({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  return <View style={styles.payHero}><View><Text style={styles.payHeroLabel}>Kareebu Pay balance</Text><Text style={styles.payHeroAmount}>{formatMoney(data.country, data.walletBalance)}</Text><Text style={styles.payHeroMeta}>Available across Kareebu+</Text></View><Pressable onPress={()=>actions.go('payTopUp')} style={styles.payHeroButton}><Feather name="plus" size={17} color={COLORS.black}/><Text style={styles.payHeroButtonText}>Add money</Text></Pressable></View>;
}

export function PaySendScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const numeric = Number(amount.replace(/[^0-9]/g, '')) || 0;
  if (sent) return <ScreenShell><CompactHeader title="Send money" back={()=>actions.go('wallet')}/><SuccessState icon="checkmark" title="Money sent" body={`${formatMoney(data.country, numeric)} was sent to ${recipient || 'your recipient'}.`} button="Done" onPress={()=>actions.go('wallet')}/></ScreenShell>;
  return <ScreenShell><CompactHeader title="Send money" back={()=>actions.go('wallet')}/><Page><PayHero data={data} actions={actions}/><View style={styles.section}><Text style={styles.label}>TO</Text><Field value={recipient} onChangeText={setRecipient} placeholder="Name, phone number or Kareebu username" keyboardType="phone-pad"/></View><View style={styles.section}><Text style={styles.label}>AMOUNT</Text><Field value={amount} onChangeText={setAmount} placeholder="0" keyboardType="numeric"/><View style={styles.chipWrap}>{quickAmounts.slice(0,4).map((value)=><MoneyChip key={value} amount={value} onPress={()=>setAmount(String(value))} selected={numeric===value}/>)}</View></View><View style={styles.section}><Text style={styles.label}>NOTE</Text><Field value={note} onChangeText={setNote} placeholder="What is this for? (optional)"/></View><RoundedCard style={styles.infoCard}><Ionicons name="shield-checkmark-outline" size={21} color={COLORS.black}/><View style={styles.flex}><Text style={styles.cardTitle}>Instant Kareebu transfer</Text><Text style={styles.cardBody}>Kareebu-to-Kareebu transfers are instant. Other payment rails can be added by the live backend.</Text></View></RoundedCard><PrimaryButton disabled={!recipient.trim() || numeric<=0 || numeric>data.walletBalance} label={`Send ${numeric ? formatMoney(data.country,numeric) : 'money'}`} onPress={()=>{actions.setWalletBalance(Math.max(0,data.walletBalance-numeric));recordPayment(actions, recipient || 'Kareebu transfer', note || 'Sent money', -numeric, 'send');setSent(true)}}/></Page></ScreenShell>;
}

export function PayRequestScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [from, setFrom] = useState('');
  const [amount, setAmount] = useState('');
  const [requested, setRequested] = useState(false);
  const numeric = Number(amount.replace(/[^0-9]/g, '')) || 0;
  if (requested) return <ScreenShell><CompactHeader title="Request money" back={()=>actions.go('wallet')}/><SuccessState icon="paper-plane" title="Request sent" body={`${from || 'Your contact'} will see a request for ${formatMoney(data.country,numeric)}.`} button="Back to Pay" onPress={()=>actions.go('wallet')}/></ScreenShell>;
  return <ScreenShell><CompactHeader title="Request money" back={()=>actions.go('wallet')}/><Page><View style={styles.heroSimple}><Text style={styles.heroSimpleTitle}>Ask someone to pay you</Text><Text style={styles.heroSimpleBody}>Send a request to a Kareebu contact or mobile number.</Text></View><View style={styles.section}><Text style={styles.label}>FROM</Text><Field value={from} onChangeText={setFrom} placeholder="Name or phone number" keyboardType="phone-pad"/></View><View style={styles.section}><Text style={styles.label}>AMOUNT</Text><Field value={amount} onChangeText={setAmount} placeholder="0" keyboardType="numeric"/></View><PrimaryButton disabled={!from.trim()||numeric<=0} label="Send request" onPress={()=>setRequested(true)}/></Page></ScreenShell>;
}

export function PayTopUpScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [amount, setAmount] = useState(20000);
  const [source, setSource] = useState<'mtn'|'airtel'|'card'>('mtn');
  const [done,setDone]=useState(false);
  if(done) return <ScreenShell><CompactHeader title="Add money" back={()=>actions.go('wallet')}/><SuccessState icon="wallet" title="Wallet topped up" body={`${formatMoney(data.country,amount)} was added to your Kareebu Pay balance.`} button="Back to wallet" onPress={()=>actions.go('wallet')}/></ScreenShell>;
  return <ScreenShell><CompactHeader title="Add money" back={()=>actions.go('wallet')}/><Page><PayHero data={data} actions={actions}/><Text style={styles.sectionTitle}>Choose amount</Text><View style={styles.chipWrap}>{quickAmounts.map(v=><MoneyChip key={v} amount={v} selected={amount===v} onPress={()=>setAmount(v)}/>)}</View><Text style={styles.sectionTitle}>Pay with</Text><RoundedCard>{[
    ['mtn','MTN Mobile Money','phone-portrait-outline'],['airtel','Airtel Money','phone-portrait-outline'],['card','Debit or credit card','card-outline']
  ].map(([id,label,icon])=><Pressable key={id} onPress={()=>setSource(id as any)} style={styles.radioRow}><View style={styles.rowIcon}><Ionicons name={icon as any} size={20} color={COLORS.black}/></View><Text style={styles.radioLabel}>{label}</Text><View style={[styles.radio,source===id&&styles.radioActive]}>{source===id?<View style={styles.radioDot}/>:null}</View></Pressable>)}</RoundedCard><PrimaryButton label={`Add ${formatMoney(data.country,amount)}`} onPress={()=>{actions.setWalletBalance(data.walletBalance+amount);recordPayment(actions, 'Wallet top up', source==='card'?'Card':source==='airtel'?'Airtel Money':'MTN Mobile Money', amount, 'topup');setDone(true)}}/></Page></ScreenShell>;
}

const BILLERS = [
  ['Electricity','Umeme / Yaka','flash-outline'],
  ['Water','National Water','water-outline'],
  ['TV','DStv / GOtv','tv-outline'],
  ['Internet','Home & mobile internet','wifi-outline'],
  ['School fees','Schools & tuition','school-outline'],
  ['Government','Taxes & services','business-outline'],
] as const;

export function PayBillsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [selected,setSelected]=useState<(typeof BILLERS)[number]|null>(null);
  const [account,setAccount]=useState('');
  const [amount,setAmount]=useState('');
  const [done,setDone]=useState(false);
  const numeric=Number(amount.replace(/[^0-9]/g,''))||0;
  if(done) return <ScreenShell><CompactHeader title="Pay bills" back={()=>actions.go('wallet')}/><SuccessState icon="receipt" title="Bill paid" body={`${selected?.[0] ?? 'Your'} payment of ${formatMoney(data.country,numeric)} was successful.`} button="Done" onPress={()=>actions.go('wallet')}/></ScreenShell>;
  if(selected) return <ScreenShell><CompactHeader title={selected[0]} back={()=>setSelected(null)}/><Page><View style={styles.billerHero}><View style={styles.billerIcon}><Ionicons name={selected[2]} size={26} color={COLORS.black}/></View><Text style={styles.billerTitle}>{selected[1]}</Text></View><Field value={account} onChangeText={setAccount} placeholder="Account / reference number"/><Field value={amount} onChangeText={setAmount} placeholder="Amount" keyboardType="numeric"/><PrimaryButton disabled={!account.trim()||numeric<=0||numeric>data.walletBalance} label={`Pay ${numeric?formatMoney(data.country,numeric):''}`} onPress={()=>{actions.setWalletBalance(data.walletBalance-numeric);recordPayment(actions, selected?.[0] ?? 'Bill payment', account || selected?.[1] || 'Bill', -numeric, 'bill');setDone(true)}}/></Page></ScreenShell>;
  return <ScreenShell><CompactHeader title="Pay bills" back={()=>actions.go('wallet')}/><Page><Text style={styles.heroSimpleTitle}>Bills & services</Text><Text style={styles.heroSimpleBody}>Choose a biller. The partner list can be supplied by Kareebu Pay's backend.</Text><View style={styles.tileGrid}>{BILLERS.map(item=><Pressable key={item[0]} onPress={()=>setSelected(item)} style={styles.tile}><View style={styles.tileIcon}><Ionicons name={item[2]} size={23} color={COLORS.black}/></View><Text style={styles.tileTitle}>{item[0]}</Text><Text style={styles.tileBody}>{item[1]}</Text></Pressable>)}</View></Page></ScreenShell>;
}

export function PayRechargeScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [phone,setPhone]=useState('');
  const [amount,setAmount]=useState(5000);
  const [network,setNetwork]=useState<'MTN'|'Airtel'>('MTN');
  const [done,setDone]=useState(false);
  if(done) return <ScreenShell><CompactHeader title="Mobile recharge" back={()=>actions.go('wallet')}/><SuccessState icon="phone-portrait" title="Airtime sent" body={`${formatMoney(data.country,amount)} of ${network} airtime was sent to ${phone}.`} button="Done" onPress={()=>actions.go('wallet')}/></ScreenShell>;
  return <ScreenShell><CompactHeader title="Mobile recharge" back={()=>actions.go('wallet')}/><Page><View style={styles.segment}>{(['MTN','Airtel'] as const).map(n=><Pressable key={n} onPress={()=>setNetwork(n)} style={[styles.segmentItem,network===n&&styles.segmentItemActive]}><Text style={[styles.segmentText,network===n&&styles.segmentTextActive]}>{n}</Text></Pressable>)}</View><Field value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad"/><View style={styles.chipWrap}>{quickAmounts.slice(0,4).map(v=><MoneyChip key={v} amount={v} onPress={()=>setAmount(v)} selected={amount===v}/>)}</View><PrimaryButton disabled={!phone.trim()||amount>data.walletBalance} label={`Recharge ${formatMoney(data.country,amount)}`} onPress={()=>{actions.setWalletBalance(data.walletBalance-amount);recordPayment(actions, `${network} airtime`, phone || 'Mobile recharge', -amount, 'recharge');setDone(true)}}/></Page></ScreenShell>;
}

const GIFT_CARDS = [
  {id:'airtime',title:'Mobile airtime',sub:'Send airtime as a gift',icon:'phone-portrait-outline' as const},
  {id:'food',title:'Kareebu Food',sub:'Food delivery credit',icon:'restaurant-outline' as const},
  {id:'rides',title:'Kareebu Rides',sub:'Ride credit',icon:'car-outline' as const},
  {id:'shops',title:'Kareebu Shops',sub:'Shopping credit',icon:'bag-handle-outline' as const},
];

export function PayGiftCardsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [selected,setSelected]=useState(GIFT_CARDS[1]);
  const [amount,setAmount]=useState(20000);
  const [recipient,setRecipient]=useState('');
  return <ScreenShell><CompactHeader title="Gift cards" back={()=>actions.go('wallet')}/><Page><View style={styles.tileGrid}>{GIFT_CARDS.map(item=><Pressable key={item.id} onPress={()=>setSelected(item)} style={[styles.tile,selected.id===item.id&&styles.tileSelected]}><View style={styles.tileIcon}><Ionicons name={item.icon} size={23}/></View><Text style={styles.tileTitle}>{item.title}</Text><Text style={styles.tileBody}>{item.sub}</Text></Pressable>)}</View><Field value={recipient} onChangeText={setRecipient} placeholder="Recipient phone or email"/><View style={styles.chipWrap}>{[10000,20000,50000,100000].map(v=><MoneyChip key={v} amount={v} selected={amount===v} onPress={()=>setAmount(v)}/>)}</View><PrimaryButton disabled={!recipient.trim()||amount>data.walletBalance} label="Buy & send" onPress={()=>{actions.setWalletBalance(data.walletBalance-amount);recordPayment(actions, selected.title, `Gift card · ${recipient}`, -amount, 'shop');Alert.alert('Gift sent',`${selected.title} credit has been sent.`);actions.go('wallet')}}/></Page></ScreenShell>;
}

const CORRIDORS = [
  {id:'UG-KE',to:'Kenya',currency:'KES',rate:0.034},
  {id:'UG-TZ',to:'Tanzania',currency:'TZS',rate:0.70},
  {id:'UG-RW',to:'Rwanda',currency:'RWF',rate:0.37},
];

export function PayRemittanceScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [corridor,setCorridor]=useState(CORRIDORS[0]);
  const [amount,setAmount]=useState('100000');
  const [recipient,setRecipient]=useState('');
  const value=Number(amount.replace(/[^0-9]/g,''))||0;
  const receive=Math.round(value*corridor.rate);
  return <ScreenShell><CompactHeader title="International transfer" back={()=>actions.go('wallet')}/><Page><View style={styles.remitHero}><Text style={styles.remitEyebrow}>SEND FROM UGANDA</Text><Text style={styles.remitTitle}>Send money across East Africa</Text><Text style={styles.remitBody}>Corridors, compliance and live rates should come from Kareebu's regulated payments provider.</Text></View><Text style={styles.sectionTitle}>Destination</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChips}>{CORRIDORS.map(item=><Pressable key={item.id} onPress={()=>setCorridor(item)} style={[styles.choiceChip,corridor.id===item.id&&styles.choiceChipActive]}><Text style={[styles.choiceChipText,corridor.id===item.id&&styles.choiceChipTextActive]}>{item.to}</Text></Pressable>)}</ScrollView><Field value={recipient} onChangeText={setRecipient} placeholder="Recipient mobile or account"/><Field value={amount} onChangeText={setAmount} placeholder="You send (UGX)" keyboardType="numeric"/><RoundedCard style={styles.rateCard}><View><Text style={styles.rateLabel}>Recipient gets</Text><Text style={styles.rateValue}>{corridor.currency} {receive.toLocaleString()}</Text></View><View><Text style={styles.rateLabel}>Indicative rate</Text><Text style={styles.rateMeta}>1 UGX = {corridor.rate} {corridor.currency}</Text></View></RoundedCard><PrimaryButton disabled={!recipient.trim()||value<=0||value>data.walletBalance} label="Continue transfer" onPress={()=>actions.go('payKyc')}/></Page></ScreenShell>;
}

export function PayTransactionsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const fallback: WalletTransaction[] = [
    {id:'demo-food',title:'Cafe Javas',meta:'Food · Recent',amount:-37000,kind:'food',createdAt:new Date().toISOString()},
    {id:'demo-topup',title:'Wallet top up',meta:'MTN Mobile Money',amount:50000,kind:'topup',createdAt:new Date().toISOString()},
    {id:'demo-ride',title:'Kareebu Ride',meta:'Ride',amount:-12500,kind:'ride',createdAt:new Date().toISOString()},
  ];
  const rows=data.walletTransactions.length?data.walletTransactions:fallback;
  const iconFor=(kind:WalletTransaction['kind']):keyof typeof Ionicons.glyphMap => kind==='topup'||kind==='receive'?'arrow-down-circle-outline':kind==='food'?'restaurant-outline':kind==='ride'?'car-outline':kind==='shop'?'bag-handle-outline':kind==='bill'?'receipt-outline':kind==='recharge'?'phone-portrait-outline':kind==='remittance'?'globe-outline':kind==='donation'?'heart-outline':'arrow-up-circle-outline';
  return <ScreenShell><CompactHeader title="Transactions" back={()=>actions.go('wallet')}/><Page><PayHero data={data} actions={actions}/><View style={styles.list}>{rows.map((row)=><View key={row.id} style={styles.transactionRow}><View style={styles.rowIcon}><Ionicons name={iconFor(row.kind)} size={20}/></View><View style={styles.flex}><Text style={styles.rowTitle}>{row.title}</Text><Text style={styles.rowMeta}>{row.meta}</Text></View><Text style={[styles.transactionAmount,row.amount>0&&styles.transactionPositive]}>{row.amount>0?'+':''}{formatMoney(data.country,Math.abs(row.amount))}</Text></View>)}</View></Page></ScreenShell>;
}

export function PayManageAccountsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [cashout,setCashout]=useState(true);
  return <ScreenShell><CompactHeader title="Accounts & cards" back={()=>actions.go('wallet')}/><Page><SectionTitle title="Payment methods" action="Add" onAction={()=>actions.go('paymentMethods')}/><RoundedCard><MenuRow icon="phone-portrait-outline" label="MTN Mobile Money" detail="Primary"/><MenuRow icon="phone-portrait-outline" label="Airtel Money"/><MenuRow icon="card-outline" label="Visa •••• 4242"/></RoundedCard><SectionTitle title="Cash out"/><RoundedCard><View style={styles.switchRow}><View style={styles.flex}><Text style={styles.rowTitle}>Bank cash out</Text><Text style={styles.rowMeta}>Allow transfers from wallet to linked bank accounts</Text></View><Switch value={cashout} onValueChange={setCashout} trackColor={{true:COLORS.black,false:COLORS.lineDark}} thumbColor={COLORS.white}/></View><MenuRow icon="business-outline" label="Add bank account" detail="Not connected"/></RoundedCard><TextButton label="View Kareebu Pay terms" onPress={()=>actions.go('legal')}/></Page></ScreenShell>;
}

export function PayKycScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [id,setId]=useState('');
  const [accepted,setAccepted]=useState(false);
  return <ScreenShell><CompactHeader title="Verify identity" back={()=>actions.go('wallet')}/><Page><View style={styles.kycIcon}><MaterialCommunityIcons name="shield-account-outline" size={42} color={COLORS.black}/></View><Text style={styles.heroSimpleTitle}>Verify before higher-value payments</Text><Text style={styles.heroSimpleBody}>Kareebu Pay can request identity verification before remittances, cash out or higher-risk transactions.</Text><Field value={data.fullName} onChangeText={()=>undefined} placeholder="Full name"/><Field value={id} onChangeText={setId} placeholder="National ID / passport number"/><Pressable onPress={()=>setAccepted(!accepted)} style={styles.consentRow}><View style={[styles.checkbox,accepted&&styles.checkboxActive]}>{accepted?<Feather name="check" size={14} color={COLORS.white}/>:null}</View><Text style={styles.consentText}>I confirm these details are mine and can be checked for payment compliance.</Text></Pressable><PrimaryButton disabled={!id.trim()||!accepted} label="Submit verification" onPress={()=>{Alert.alert('Verification submitted','We’ll notify you when your payment limits are updated.');actions.go('wallet')}}/></Page></ScreenShell>;
}

export function SupportInboxScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const fallback: SupportTicket[]=[{id:'KT-1042',title:'Food order refund',detail:'Refund review',status:'In review',createdAt:new Date().toISOString()},{id:'KT-0981',title:'Ride fare question',detail:'Resolved fare query',status:'Resolved',createdAt:new Date(Date.now()-86400000*3).toISOString()}];
  const tickets=data.supportTickets.length?data.supportTickets:fallback;
  return <ScreenShell><CompactHeader title="Support inbox" back={()=>actions.go('support')} right={<Pressable onPress={()=>actions.go('supportIssue')} style={styles.headerRound}><Feather name="plus" size={20}/></Pressable>}/><Page>{tickets.map(ticket=><Pressable key={ticket.id} onPress={()=>actions.go('supportIssue')} style={styles.ticketRow}><View style={styles.ticketIcon}><Ionicons name="chatbubble-ellipses-outline" size={20}/></View><View style={styles.flex}><Text style={styles.rowTitle}>{ticket.title}</Text><Text style={styles.rowMeta}>{ticket.id} · {new Date(ticket.createdAt).toLocaleDateString()}</Text></View><View style={styles.statusPill}><Text style={styles.statusPillText}>{ticket.status}</Text></View></Pressable>)}</Page></ScreenShell>;
}

const ISSUE_TYPES=[
  ['Food order','restaurant-outline','orders'],['Ride','car-outline','rideHistory'],['Payment','wallet-outline','wallet'],['Parcel','cube-outline','parcelTracking'],['Account','person-outline','account'],['Something else','help-circle-outline','supportIssue']
] as const;

export function SupportIssueScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [subject,setSubject]=useState('');
  const [detail,setDetail]=useState('');
  const [sent,setSent]=useState(false);
  if(sent) return <ScreenShell><CompactHeader title="Get help" back={()=>actions.go('support')}/><SuccessState icon="checkmark-circle" title="Request received" body="Your support request is in the inbox. We’ll keep the conversation attached to the relevant activity." button="Open support inbox" onPress={()=>actions.go('supportInbox')}/></ScreenShell>;
  return <ScreenShell><CompactHeader title="Get help" back={()=>actions.go('support')}/><Page><Text style={styles.heroSimpleTitle}>What do you need help with?</Text><View style={styles.issueGrid}>{ISSUE_TYPES.map(([label,icon,screen])=><Pressable key={label} onPress={()=>screen==='supportIssue'?setSubject(label):actions.go(screen as Screen)} style={styles.issueTile}><Ionicons name={icon} size={23}/><Text style={styles.issueText}>{label}</Text></Pressable>)}</View><SectionTitle title="Contact support"/><Field value={subject} onChangeText={setSubject} placeholder="Subject"/><Field value={detail} onChangeText={setDetail} placeholder="Describe what happened" multiline/><PrimaryButton disabled={!subject.trim()||!detail.trim()} label="Submit request" onPress={()=>{actions.createSupportTicket({title:subject,detail});setSent(true)}}/></Page></ScreenShell>;
}

export function PlusSavingsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const saved=[{title:'Food delivery',amount:22000,icon:'restaurant-outline' as const},{title:'Ride discounts',amount:18000,icon:'car-outline' as const},{title:'Store delivery',amount:12000,icon:'bag-handle-outline' as const},{title:'Rewards boost',amount:8000,icon:'gift-outline' as const}];
  const total=saved.reduce((sum,row)=>sum+row.amount,0);
  return <ScreenShell><CompactHeader title="Kareebu+ savings" back={()=>actions.go('membership')}/><Page><View style={styles.savingsHero}><Text style={styles.savingsEyebrow}>THIS MONTH</Text><Text style={styles.savingsAmount}>{formatMoney(data.country,total)}</Text><Text style={styles.savingsBody}>Estimated value from your Kareebu+ member benefits.</Text></View><View style={styles.list}>{saved.map(row=><View key={row.title} style={styles.savingRow}><View style={styles.rowIcon}><Ionicons name={row.icon} size={20}/></View><Text style={styles.rowTitleFlex}>{row.title}</Text><Text style={styles.savingAmount}>{formatMoney(data.country,row.amount)}</Text></View>)}</View><PrimaryButton label="Manage membership" onPress={()=>actions.go('plusManage')}/></Page></ScreenShell>;
}

export function PlusManageScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [renew,setRenew]=useState(true);
  const [reason,setReason]=useState('Too expensive');
  const [cancelOpen,setCancelOpen]=useState(false);
  return <ScreenShell><CompactHeader title="Manage Kareebu+" back={()=>actions.go('membership')}/><Page><View style={styles.blackCard}><Text style={styles.blackCardBrand}>Kareebu+</Text><Text style={styles.blackCardTitle}>Monthly membership</Text><Text style={styles.blackCardMeta}>Renews 15 September · UGX 12,000</Text></View><RoundedCard><View style={styles.switchRow}><View style={styles.flex}><Text style={styles.rowTitle}>Auto-renew</Text><Text style={styles.rowMeta}>Keep benefits active without interruption</Text></View><Switch value={renew} onValueChange={setRenew} trackColor={{true:COLORS.black,false:COLORS.lineDark}} thumbColor={COLORS.white}/></View><MenuRow icon="card-outline" label="Payment method" detail="MTN Mobile Money"/><MenuRow icon="bar-chart-outline" label="Your savings" onPress={()=>actions.go('plusSavings')}/></RoundedCard>{cancelOpen?<RoundedCard style={styles.cancelCard}><Text style={styles.cardTitle}>Why are you cancelling?</Text><View style={styles.chipWrap}>{['Too expensive','Not using enough','Benefits not relevant','Other'].map(item=><Pressable key={item} onPress={()=>setReason(item)} style={[styles.choiceChip,reason===item&&styles.choiceChipActive]}><Text style={[styles.choiceChipText,reason===item&&styles.choiceChipTextActive]}>{item}</Text></Pressable>)}</View><PrimaryButton label="Confirm cancellation" onPress={()=>{Alert.alert('Membership cancelled','Your benefits remain active until the end of the current period.');actions.go('account')}}/></RoundedCard>:<Pressable onPress={()=>setCancelOpen(true)} style={styles.dangerButton}><Text style={styles.dangerText}>Cancel membership</Text></Pressable>}</Page></ScreenShell>;
}

const EXPLORE_LOCATIONS=[
  {id:'serena',name:'Kampala Serena Hotel',category:'Hotels & dining',area:'Nakasero',rating:4.8,icon:'bed-outline' as const},
  {id:'acacia',name:'Acacia Mall',category:'Shopping & entertainment',area:'Kisementi',rating:4.7,icon:'storefront-outline' as const},
  {id:'ndere',name:'Ndere Cultural Centre',category:'Culture & events',area:'Ntinda',rating:4.8,icon:'musical-notes-outline' as const},
  {id:'gardens',name:'Uganda Museum',category:'Things to do',area:'Kitante',rating:4.6,icon:'images-outline' as const},
];

export function ExploreHubScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [query,setQuery]=useState('');
  const visible=EXPLORE_LOCATIONS.filter(item=>!query.trim()||`${item.name} ${item.category} ${item.area}`.toLowerCase().includes(query.toLowerCase()));
  return <ScreenShell><CompactHeader title="Explore" back={()=>actions.go('home')} right={<Pressable onPress={()=>actions.go('favourites')} style={styles.headerRound}><Feather name="heart" size={19}/></Pressable>}/><Page><View style={styles.searchBar}><Feather name="search" size={18} color={COLORS.muted}/><TextInput value={query} onChangeText={setQuery} placeholder={`Search places in ${data.city}`} placeholderTextColor={COLORS.mutedLight} style={styles.searchInput}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChips}>{['Things to do','Dining','Shopping','Events','Wellness'].map(item=><Pressable key={item} onPress={()=>setQuery(item)} style={styles.choiceChip}><Text style={styles.choiceChipText}>{item}</Text></Pressable>)}</ScrollView><View style={styles.exploreHero}><Text style={styles.exploreHeroEyebrow}>DISCOVER {data.city.toUpperCase()}</Text><Text style={styles.exploreHeroTitle}>Make more of where you are</Text><Text style={styles.exploreHeroBody}>Places, activities, food and useful local experiences in one feed.</Text></View><SectionTitle title="Popular nearby"/><View style={styles.list}>{visible.map(item=><Pressable key={item.id} onPress={()=>actions.go('exploreLocation')} style={styles.exploreRow}><View style={styles.exploreIcon}><Ionicons name={item.icon} size={22}/></View><View style={styles.flex}><Text style={styles.rowTitle}>{item.name}</Text><Text style={styles.rowMeta}>{item.category} · {item.area}</Text><Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text></View><Feather name="chevron-right" size={20} color={COLORS.muted}/></Pressable>)}</View></Page></ScreenShell>;
}

export function ExploreLocationScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [saved,setSaved]=useState(false);
  return <ScreenShell><CompactHeader title="Place" back={()=>actions.go('exploreHub')} right={<Pressable onPress={()=>setSaved(!saved)} style={styles.headerRound}><Feather name="heart" size={19} color={saved?COLORS.red:COLORS.black}/></Pressable>}/><Page><View style={styles.placeHero}><Ionicons name="location-outline" size={54} color={COLORS.black}/></View><Text style={styles.placeTitle}>Kampala Serena Hotel</Text><Text style={styles.placeMeta}>Hotels & dining · Nakasero · ★ 4.8</Text><View style={styles.compactActions}><Pressable onPress={()=>actions.go('whereTo')} style={styles.compactAction}><Ionicons name="car-outline" size={19}/><Text style={styles.compactActionText}>Ride there</Text></Pressable><Pressable onPress={()=>Share.share({message:'Kampala Serena Hotel on Kareebu+'}).catch(()=>undefined)} style={styles.compactAction}><Ionicons name="share-outline" size={19}/><Text style={styles.compactActionText}>Share</Text></Pressable><Pressable onPress={()=>actions.go('food')} style={styles.compactAction}><Ionicons name="restaurant-outline" size={19}/><Text style={styles.compactActionText}>Food nearby</Text></Pressable></View><SectionTitle title="Useful bits"/><RoundedCard><MenuRow icon="time-outline" label="Open today" detail="24 hours"/><MenuRow icon="location-outline" label="Address" detail="Kintu Road, Kampala"/><MenuRow icon="call-outline" label="Call venue"/><MenuRow icon="globe-outline" label="Website"/></RoundedCard><SectionTitle title="More around here"/><PrimaryButton label="Explore nearby" onPress={()=>actions.go('exploreHub')}/></Page></ScreenShell>;
}

export function StoriesScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const stories=[{title:'New on Kareebu+',body:'See what has just launched around you.',icon:'sparkles-outline' as const,screen:'services' as Screen},{title:'Weekend food picks',body:'Restaurants and offers worth trying.',icon:'restaurant-outline' as const,screen:'food' as Screen},{title:'Ride smarter',body:'Schedule, school rides and city-to-city.',icon:'car-outline' as const,screen:'mobilityHome' as Screen}];
  return <ScreenShell><CompactHeader title="Stories" back={()=>actions.go('home')}/><Page>{stories.map((story,index)=><Pressable key={story.title} onPress={()=>actions.go(story.screen)} style={[styles.storyCard,index===0&&styles.storyCardDark]}><View style={styles.storyIcon}><Ionicons name={story.icon} size={28} color={index===0?COLORS.white:COLORS.black}/></View><Text style={[styles.storyTitle,index===0&&styles.storyTextLight]}>{story.title}</Text><Text style={[styles.storyBody,index===0&&styles.storyBodyLight]}>{story.body}</Text><View style={styles.storyArrow}><Feather name="arrow-right" size={20} color={index===0?COLORS.white:COLORS.black}/></View></Pressable>)}</Page></ScreenShell>;
}

export function FoodScheduleScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [day,setDay]=useState('Today');
  const [time,setTime]=useState('18:30');
  return <ScreenShell><CompactHeader title="Schedule delivery" back={()=>actions.go('restaurant')}/><Page><Text style={styles.heroSimpleTitle}>Choose a delivery time</Text><Text style={styles.heroSimpleBody}>Available slots are normally returned by the restaurant and delivery backend.</Text><SectionTitle title="Day"/><View style={styles.chipWrap}>{['Today','Tomorrow','Saturday'].map(item=><Pressable key={item} onPress={()=>setDay(item)} style={[styles.choiceChip,day===item&&styles.choiceChipActive]}><Text style={[styles.choiceChipText,day===item&&styles.choiceChipTextActive]}>{item}</Text></Pressable>)}</View><SectionTitle title="Time"/><View style={styles.chipWrap}>{['17:30','18:00','18:30','19:00','19:30','20:00'].map(item=><Pressable key={item} onPress={()=>setTime(item)} style={[styles.choiceChip,time===item&&styles.choiceChipActive]}><Text style={[styles.choiceChipText,time===item&&styles.choiceChipTextActive]}>{item}</Text></Pressable>)}</View><RoundedCard style={styles.infoCard}><Ionicons name="time-outline" size={22}/><Text style={styles.cardBody}>Scheduled for {day} at {time} in {data.city}.</Text></RoundedCard><PrimaryButton label="Use this time" onPress={()=>{Alert.alert('Delivery scheduled',`${day} at ${time}`);actions.go('restaurant')}}/></Page></ScreenShell>;
}

export function RideBusinessScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [business,setBusiness]=useState(false);
  return <ScreenShell><CompactHeader title="Business profile" back={()=>actions.go('mobilityHome')}/><Page><View style={styles.businessHero}><Ionicons name="briefcase-outline" size={35}/><Text style={styles.businessHeroTitle}>Separate work rides from personal rides</Text><Text style={styles.businessHeroBody}>Business profiles can apply company payment methods, ride policies and receipts automatically.</Text></View><RoundedCard><View style={styles.switchRow}><View style={styles.flex}><Text style={styles.rowTitle}>Use business profile</Text><Text style={styles.rowMeta}>Apply to your next eligible ride</Text></View><Switch value={business} onValueChange={setBusiness} trackColor={{true:COLORS.black,false:COLORS.lineDark}} thumbColor={COLORS.white}/></View><MenuRow icon="business-outline" label="Kareebu Business" detail="Personal company profile"/><MenuRow icon="receipt-outline" label="Work receipts" onPress={()=>actions.go('rideHistory')}/></RoundedCard><PrimaryButton label="Book a work ride" onPress={()=>actions.go('workRide')}/></Page></ScreenShell>;
}

export function RideSettingsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [quiet,setQuiet]=useState(false); const [ac,setAc]=useState(true); const [accessibility,setAccessibility]=useState(false);
  return <ScreenShell><CompactHeader title="Ride preferences" back={()=>actions.go('mobilityHome')}/><Page><RoundedCard><View style={styles.switchRow}><View style={styles.flex}><Text style={styles.rowTitle}>Quiet ride</Text><Text style={styles.rowMeta}>Prefer minimal conversation</Text></View><Switch value={quiet} onValueChange={setQuiet}/></View><View style={styles.switchRow}><View style={styles.flex}><Text style={styles.rowTitle}>Air conditioning</Text><Text style={styles.rowMeta}>Ask the Captain to keep AC on</Text></View><Switch value={ac} onValueChange={setAc}/></View><View style={styles.switchRow}><View style={styles.flex}><Text style={styles.rowTitle}>Accessibility support</Text><Text style={styles.rowMeta}>Show accessibility needs when matching</Text></View><Switch value={accessibility} onValueChange={setAccessibility}/></View></RoundedCard><RoundedCard><MenuRow icon="shield-checkmark-outline" label="Safety preferences" onPress={()=>actions.go('rideSafety')}/><MenuRow icon="people-outline" label="Ride for a friend" onPress={()=>actions.go('mobilityHome')}/><MenuRow icon="calendar-outline" label="Scheduled rides" onPress={()=>actions.go('rideSchedule')}/></RoundedCard></Page></ScreenShell>;
}

export function DonationsScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [amount,setAmount]=useState(10000); const [cause,setCause]=useState('Education');
  return <ScreenShell><CompactHeader title="For Good" back={()=>actions.go('services')}/><Page><View style={styles.donationHero}><Ionicons name="heart" size={38} color={COLORS.red}/><Text style={styles.donationTitle}>Give through Kareebu</Text><Text style={styles.donationBody}>Support vetted causes. Partner verification and settlement should be handled by Kareebu's donations backend.</Text></View><View style={styles.chipWrap}>{['Education','Health','Food relief','Environment'].map(item=><Pressable key={item} onPress={()=>setCause(item)} style={[styles.choiceChip,cause===item&&styles.choiceChipActive]}><Text style={[styles.choiceChipText,cause===item&&styles.choiceChipTextActive]}>{item}</Text></Pressable>)}</View><View style={styles.chipWrap}>{[5000,10000,25000,50000].map(v=><MoneyChip key={v} amount={v} selected={amount===v} onPress={()=>setAmount(v)}/>)}</View><PrimaryButton disabled={amount>data.walletBalance} label={`Donate ${formatMoney(data.country,amount)}`} onPress={()=>{actions.setWalletBalance(data.walletBalance-amount);recordPayment(actions, `Donation · ${cause}`, 'Kareebu For Good', -amount, 'donation');Alert.alert('Thank you',`${formatMoney(data.country,amount)} donated to ${cause}.`);actions.go('home')}}/></Page></ScreenShell>;
}


export function OrderAnythingScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [request,setRequest]=useState('');
  const [pickup,setPickup]=useState('');
  const [budget,setBudget]=useState('');
  const [done,setDone]=useState(false);
  if(done) return <ScreenShell><CompactHeader title="Order anything" back={()=>actions.go('home')}/><SuccessState icon="checkmark-circle" title="Request created" body="Kareebu will find a nearby merchant or courier match and show the price before you confirm." button="Done" onPress={()=>actions.go('activity')}/></ScreenShell>;
  return <ScreenShell><CompactHeader title="Order anything" back={()=>actions.go('home')}/><Page>
    <View style={styles.orderAnythingHero}><View style={styles.orderAnythingIcon}><Ionicons name="bag-add-outline" size={27} color={COLORS.black}/></View><View style={styles.flex}><Text style={styles.heroSimpleTitle}>Can’t find it in Kareebu?</Text><Text style={styles.heroSimpleBody}>Tell us what you need and where to collect it.</Text></View></View>
    <View style={styles.section}><Text style={styles.label}>WHAT DO YOU NEED?</Text><Field value={request} onChangeText={setRequest} placeholder="e.g. Two printer cartridges, black" multiline/></View>
    <View style={styles.section}><Text style={styles.label}>PICKUP OR STORE</Text><Field value={pickup} onChangeText={setPickup} placeholder="Store name, area or leave blank for Kareebu to find it"/></View>
    <View style={styles.section}><Text style={styles.label}>BUDGET (OPTIONAL)</Text><Field value={budget} onChangeText={setBudget} placeholder="Maximum spend" keyboardType="numeric"/></View>
    <RoundedCard style={styles.infoCard}><Ionicons name="location-outline" size={21} color={COLORS.black}/><View style={styles.flex}><Text style={styles.cardTitle}>Deliver to {data.city}</Text><Text style={styles.cardBody}>You’ll approve item cost, delivery and substitutions before payment.</Text></View></RoundedCard>
    <PrimaryButton disabled={!request.trim()} label="Find it for me" onPress={()=>setDone(true)}/>
  </Page></ScreenShell>;
}

export function AccountPrivacyScreen({ data, actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  const [personalisation,setPersonalisation]=useState(true);
  const [marketing,setMarketing]=useState(false);
  const [location,setLocation]=useState(true);
  return <ScreenShell><CompactHeader title="Privacy & security" back={()=>actions.go('account')}/><Page>
    <Text style={styles.sectionTitle}>Privacy controls</Text>
    <RoundedCard>
      <View style={styles.switchRow}><View style={styles.rowIcon}><Ionicons name="sparkles-outline" size={20}/></View><View style={styles.flex}><Text style={styles.rowTitle}>Personalised Kareebu</Text><Text style={styles.rowMeta}>Use activity to improve recommendations</Text></View><Switch value={personalisation} onValueChange={setPersonalisation}/></View>
      <View style={styles.switchRow}><View style={styles.rowIcon}><Ionicons name="megaphone-outline" size={20}/></View><View style={styles.flex}><Text style={styles.rowTitle}>Marketing messages</Text><Text style={styles.rowMeta}>Offers and product updates</Text></View><Switch value={marketing} onValueChange={setMarketing}/></View>
      <View style={styles.switchRow}><View style={styles.rowIcon}><Ionicons name="location-outline" size={20}/></View><View style={styles.flex}><Text style={styles.rowTitle}>Location services</Text><Text style={styles.rowMeta}>Used for nearby services and pickup</Text></View><Switch value={location} onValueChange={setLocation}/></View>
    </RoundedCard>
    <Text style={styles.sectionTitle}>Account security</Text>
    <RoundedCard><MenuRow icon="phone-portrait-outline" label="Phone number" detail={data.phone} onPress={()=>actions.go('editProfile')}/><MenuRow icon="mail-outline" label="Email" detail={data.email} onPress={()=>actions.go('editProfile')}/><MenuRow icon="shield-checkmark-outline" label="Identity & payment verification" onPress={()=>actions.go('payKyc')}/><MenuRow icon="document-text-outline" label="Legal & privacy" onPress={()=>actions.go('legal')}/></RoundedCard>
    <RoundedCard style={styles.cancelCard}><View><Text style={styles.cardTitle}>Delete Kareebu account</Text><Text style={styles.cardBody}>Account deletion should be confirmed and processed by the Kareebu identity backend.</Text></View><Pressable onPress={()=>Alert.alert('Delete account','This development build will not delete your account. Production must require identity confirmation.')} style={styles.dangerButton}><Text style={styles.dangerText}>Delete account</Text></Pressable></RoundedCard>
  </Page></ScreenShell>;
}

export function ShopHelpScreen({ actions }: { data: CustomerParityData; actions: CustomerParityActions }) {
  return <ScreenShell><CompactHeader title="Shop help" back={()=>actions.go('shops')}/><Page><View style={styles.heroSimple}><Text style={styles.heroSimpleTitle}>How can we help?</Text><Text style={styles.heroSimpleBody}>Support for store availability, products, substitutions, delivery and refunds.</Text></View><RoundedCard><MenuRow icon="bag-handle-outline" label="Problem with an order" onPress={()=>actions.go('supportIssue')}/><MenuRow icon="swap-horizontal-outline" label="Item replacement or substitution" onPress={()=>actions.go('supportIssue')}/><MenuRow icon="cash-outline" label="Refund or payment issue" onPress={()=>actions.go('refunds')}/><MenuRow icon="chatbubble-ellipses-outline" label="Chat with support" onPress={()=>actions.go('chat')}/><MenuRow icon="mail-outline" label="Support inbox" onPress={()=>actions.go('supportInbox')}/></RoundedCard></Page></ScreenShell>;
}

const styles=StyleSheet.create({
  flex:{flex:1}, page:{paddingHorizontal:14,paddingTop:8,paddingBottom:28,gap:14}, orderAnythingHero:{minHeight:76,borderRadius:16,backgroundColor:'#FFF3D8',padding:13,flexDirection:'row',alignItems:'center',gap:11},orderAnythingIcon:{width:48,height:48,borderRadius:15,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'}, section:{gap:8}, label:{...TYPE.label,color:COLORS.muted,letterSpacing:.7},
  input:{height:50,borderRadius:14,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,paddingHorizontal:14,...TYPE.bodyStrong,color:COLORS.black},inputMultiline:{height:104,paddingTop:13,textAlignVertical:'top'},
  payHero:{borderRadius:18,backgroundColor:COLORS.black,padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},payHeroLabel:{...TYPE.caption,color:'rgba(255,255,255,.68)'},payHeroAmount:{fontFamily:FONT.bold,fontSize:27,lineHeight:31,fontWeight:'900',color:COLORS.white,marginTop:3},payHeroMeta:{...TYPE.caption,color:'rgba(255,255,255,.62)',marginTop:4},payHeroButton:{height:36,borderRadius:11,backgroundColor:COLORS.yellow,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:10},payHeroButtonText:{...TYPE.label,color:COLORS.black},
  chipWrap:{flexDirection:'row',flexWrap:'wrap',gap:8},moneyChip:{minHeight:36,borderRadius:18,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:12,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white},moneyChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},moneyChipText:{...TYPE.small,fontWeight:'700',color:COLORS.black},moneyChipTextActive:{color:COLORS.white},
  sectionTitle:{...TYPE.sectionTitle,color:COLORS.black},infoCard:{padding:13,flexDirection:'row',alignItems:'center',gap:10,shadowOpacity:0},cardTitle:{...TYPE.cardTitle,color:COLORS.black},cardBody:{...TYPE.small,color:COLORS.muted,flex:1},
  successWrap:{flex:1,paddingHorizontal:26,alignItems:'center',justifyContent:'center',gap:12},successIcon:{width:74,height:74,borderRadius:37,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},successTitle:{...TYPE.screenTitle,color:COLORS.black,textAlign:'center'},successBody:{...TYPE.body,color:COLORS.muted,textAlign:'center',marginBottom:8},
  heroSimple:{gap:5},heroSimpleTitle:{...TYPE.screenTitle,color:COLORS.black},heroSimpleBody:{...TYPE.body,color:COLORS.muted},
  radioRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:13,borderBottomWidth:1,borderBottomColor:COLORS.line},rowIcon:{width:38,height:38,borderRadius:12,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},radioLabel:{flex:1,...TYPE.bodyStrong,color:COLORS.black},radio:{width:20,height:20,borderRadius:10,borderWidth:1.5,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},radioActive:{borderColor:COLORS.black},radioDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.black},
  billerHero:{alignItems:'center',gap:7,paddingVertical:8},billerIcon:{width:56,height:56,borderRadius:18,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},billerTitle:{...TYPE.sectionTitle,color:COLORS.black},tileGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},tile:{width:'48.5%',minHeight:118,borderRadius:15,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:12,...SHADOW},tileSelected:{borderColor:COLORS.black,borderWidth:1.5},tileIcon:{width:40,height:40,borderRadius:12,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},tileTitle:{...TYPE.cardTitle,color:COLORS.black,marginTop:8},tileBody:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  segment:{height:42,borderRadius:13,backgroundColor:COLORS.surface,padding:3,flexDirection:'row'},segmentItem:{flex:1,borderRadius:10,alignItems:'center',justifyContent:'center'},segmentItemActive:{backgroundColor:COLORS.white,...SHADOW},segmentText:{...TYPE.small,fontWeight:'700',color:COLORS.muted},segmentTextActive:{color:COLORS.black,fontWeight:'900'},
  remitHero:{borderRadius:18,backgroundColor:'#FFF3D8',padding:16},remitEyebrow:{...TYPE.label,color:COLORS.red,letterSpacing:.9},remitTitle:{...TYPE.screenTitle,color:COLORS.black,marginTop:5},remitBody:{...TYPE.small,color:COLORS.muted,marginTop:6},horizontalChips:{gap:8,paddingRight:14},choiceChip:{minHeight:35,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,paddingHorizontal:12,alignItems:'center',justifyContent:'center'},choiceChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},choiceChipText:{...TYPE.small,fontWeight:'700',color:COLORS.black},choiceChipTextActive:{color:COLORS.white},rateCard:{padding:14,flexDirection:'row',justifyContent:'space-between',gap:12,shadowOpacity:0},rateLabel:{...TYPE.caption,color:COLORS.muted},rateValue:{...TYPE.sectionTitle,color:COLORS.black,marginTop:2},rateMeta:{...TYPE.small,color:COLORS.black,marginTop:2},
  list:{gap:8},transactionRow:{minHeight:60,borderRadius:14,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:11},rowTitle:{...TYPE.cardTitle,color:COLORS.black},rowTitleFlex:{flex:1,...TYPE.cardTitle,color:COLORS.black},rowMeta:{...TYPE.caption,color:COLORS.muted,marginTop:2},transactionAmount:{...TYPE.cardTitle,color:COLORS.black},transactionPositive:{color:COLORS.green},
  switchRow:{minHeight:64,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:13,paddingVertical:8,borderBottomWidth:1,borderBottomColor:COLORS.line},kycIcon:{width:78,height:78,borderRadius:24,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',alignSelf:'center'},consentRow:{flexDirection:'row',alignItems:'flex-start',gap:10},checkbox:{width:21,height:21,borderRadius:6,borderWidth:1.5,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},checkboxActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},consentText:{flex:1,...TYPE.small,color:COLORS.muted},
  headerRound:{width:34,height:34,borderRadius:17,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},ticketRow:{minHeight:68,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10},ticketIcon:{width:40,height:40,borderRadius:13,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},statusPill:{borderRadius:10,backgroundColor:COLORS.surface,paddingHorizontal:8,paddingVertical:5},statusPillText:{...TYPE.caption,color:COLORS.black,fontWeight:'700'},
  issueGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},issueTile:{width:'31.5%',minHeight:86,borderRadius:14,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',gap:7,padding:7},issueText:{...TYPE.caption,color:COLORS.black,textAlign:'center',fontWeight:'700'},
  savingsHero:{borderRadius:18,backgroundColor:COLORS.black,padding:18},savingsEyebrow:{...TYPE.label,color:COLORS.yellow,letterSpacing:.9},savingsAmount:{fontFamily:FONT.bold,fontSize:30,lineHeight:34,fontWeight:'900',color:COLORS.white,marginTop:4},savingsBody:{...TYPE.small,color:'rgba(255,255,255,.67)',marginTop:4},savingRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:1,borderBottomColor:COLORS.line},savingAmount:{...TYPE.cardTitle,color:COLORS.green},blackCard:{borderRadius:18,backgroundColor:COLORS.black,padding:17},blackCardBrand:{...TYPE.label,color:COLORS.yellow},blackCardTitle:{...TYPE.screenTitle,color:COLORS.white,marginTop:4},blackCardMeta:{...TYPE.small,color:'rgba(255,255,255,.65)',marginTop:4},cancelCard:{padding:14,gap:12,shadowOpacity:0},dangerButton:{height:48,borderRadius:14,borderWidth:1,borderColor:'#F1B8B4',alignItems:'center',justifyContent:'center'},dangerText:{...TYPE.action,color:COLORS.red},
  searchBar:{height:46,borderRadius:14,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:12},searchInput:{flex:1,...TYPE.body,color:COLORS.black},exploreHero:{borderRadius:18,backgroundColor:'#FFF1DA',padding:17},exploreHeroEyebrow:{...TYPE.label,color:COLORS.red,letterSpacing:.8},exploreHeroTitle:{...TYPE.screenTitle,color:COLORS.black,marginTop:5},exploreHeroBody:{...TYPE.small,color:COLORS.muted,marginTop:5},exploreRow:{minHeight:72,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10},exploreIcon:{width:46,height:46,borderRadius:15,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},ratingText:{...TYPE.caption,color:COLORS.green,marginTop:3,fontWeight:'800'},placeHero:{height:150,borderRadius:18,backgroundColor:COLORS.surfaceStrong,alignItems:'center',justifyContent:'center'},placeTitle:{...TYPE.screenTitle,color:COLORS.black},placeMeta:{...TYPE.small,color:COLORS.muted},compactActions:{flexDirection:'row',gap:8},compactAction:{flex:1,minHeight:58,borderRadius:14,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',gap:4},compactActionText:{...TYPE.caption,color:COLORS.black,fontWeight:'700'},
  storyCard:{minHeight:160,borderRadius:20,backgroundColor:'#FFF3D8',padding:17,overflow:'hidden'},storyCardDark:{backgroundColor:COLORS.black},storyIcon:{width:48,height:48,borderRadius:16,backgroundColor:'rgba(255,255,255,.18)',alignItems:'center',justifyContent:'center'},storyTitle:{...TYPE.screenTitle,color:COLORS.black,marginTop:16},storyTextLight:{color:COLORS.white},storyBody:{...TYPE.small,color:COLORS.muted,marginTop:5,maxWidth:280},storyBodyLight:{color:'rgba(255,255,255,.67)'},storyArrow:{position:'absolute',right:17,bottom:17},businessHero:{borderRadius:18,backgroundColor:COLORS.yellow,padding:18,gap:8},businessHeroTitle:{...TYPE.screenTitle,color:COLORS.black},businessHeroBody:{...TYPE.small,color:'#4D4632'},donationHero:{alignItems:'center',gap:7,paddingVertical:12},donationTitle:{...TYPE.screenTitle,color:COLORS.black},donationBody:{...TYPE.small,color:COLORS.muted,textAlign:'center'},
});
