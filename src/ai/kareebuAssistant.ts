import { DEMO_RESTAURANTS, DEMO_SHOPS } from '../demoData';
import { Screen } from '../types';

export type KareebuAssistantAction = {
  label: string;
  screen: Screen;
  rideMode?: 'RIDE' | 'BODA';
  shopCategory?: string;
  entityId?: string;
};

export type KareebuAssistantRecommendation = {
  id: string;
  title: string;
  subtitle: string;
  reason: string;
  badge?: string;
  action: KareebuAssistantAction;
};

export type KareebuAssistantReply = {
  text: string;
  actions: KareebuAssistantAction[];
  recommendations: KareebuAssistantRecommendation[];
  source: 'live' | 'demo';
};

export type KareebuConversationTurn = { role: 'user' | 'assistant'; text: string };

type AssistantContext = {
  country: string;
  city: string;
  guest: boolean;
  history?: KareebuConversationTurn[];
};

const AI_URL = (process.env.EXPO_PUBLIC_KAREEBU_AI_URL ?? '').replace(/\/$/, '');

const LOCALE_STORE_IDS: Record<string, string[]> = {
  Uganda: ['carrefour', 'goodlife', 'capital', 'quality', 'jumia', 'beautybasket', 'nutrition-hub'],
  Kenya: ['naivas', 'quickmart', 'carrefour', 'goodlife', 'jumia'],
  Tanzania: ['shoppers-tz', 'village-tz', 'breeze-tz'],
};

function localRestaurantName(id: string, name: string, context: AssistantContext) {
  if (context.country === 'Uganda') return name;
  if (id === 'kampala-grill') return `${context.city} Grill House`;
  if (id === 'urban-bowl') return `Urban Bowl ${context.city}`;
  if (id === 'kampala-bites') return `${context.city} Bites`;
  if (id === 'rolex-stop') return context.country === 'Kenya' ? 'Chapati & Wrap Stop' : 'Chapati & Chipsi Stop';
  return name;
}

function recommendationCatalog(context: AssistantContext) {
  const storeIds = new Set(LOCALE_STORE_IDS[context.country] ?? []);
  const stores = DEMO_SHOPS
    .filter((shop) => storeIds.has(shop.id))
    .slice(0, 10)
    .map((shop) => ({
      type: 'store',
      id: shop.id,
      name: shop.name,
      category: shop.category,
      rating: shop.rating,
      eta: shop.eta,
      deliveryFee: shop.deliveryFee,
      deal: shop.deal,
    }));

  const restaurants = DEMO_RESTAURANTS.slice(0, 12).map((restaurant) => ({
    type: 'restaurant',
    id: restaurant.id,
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    rating: restaurant.rating,
    eta: restaurant.eta,
    deliveryFee: restaurant.deliveryFee,
    offer: restaurant.offer ?? '',
    popularItems: restaurant.menu.filter((item) => item.popular).slice(0, 3).map((item) => ({ name: item.name, price: item.price })),
  }));

  return { stores, restaurants };
}

function localReply(message: string, context: AssistantContext): KareebuAssistantReply {
  const q = message.trim().toLowerCase();
  const where = `${context.city}, ${context.country}`;
  const catalog = recommendationCatalog(context);

  if (/boda|motorbike|motorcycle/.test(q)) {
    return {
      text: `For a quick trip around ${context.city}, Boda is usually the fastest option. Add your destination and Kareebu+ will compare the live route and fare before you confirm.`,
      actions: [{ label: 'Book a Boda', screen: 'whereTo', rideMode: 'BODA' }],
      recommendations: [{ id:'boda', title:'Boda', subtitle:`Fast two-wheel travel in ${context.city}`, reason:'Best when you want a quick city trip.', badge:'Fastest', action:{label:'Choose Boda', screen:'whereTo', rideMode:'BODA'} }],
      source: 'demo',
    };
  }
  if (/ride|taxi|car|airport|uber|cab/.test(q)) {
    return {
      text: `For a car journey from ${context.city}, I’d compare Economy first, then Comfort if you want more space. Add your destination and I’ll take you to the route screen.`,
      actions: [{ label: 'Find a Ride', screen: 'whereTo', rideMode: 'RIDE' }],
      recommendations: [{ id:'ride', title:'Economy Ride', subtitle:'Lower-cost car option', reason:'A good default for everyday trips.', badge:'Best value', action:{label:'Compare rides', screen:'whereTo', rideMode:'RIDE'} }],
      source: 'demo',
    };
  }
  if (/pizza|burger|chicken|breakfast|lunch|dinner|food|restaurant|meal/.test(q)) {
    const picks = catalog.restaurants.slice(0, 3);
    return {
      text: `I found a few strong food options around ${where}. I’ve prioritised rating, delivery time and current demo offers.`,
      actions: [{ label: 'Browse all food', screen: 'food' }],
      recommendations: picks.map((restaurant) => ({
        id: restaurant.id,
        title: restaurant.name,
        subtitle: `${restaurant.rating.toFixed(1)} ★ · ${restaurant.eta}`,
        reason: restaurant.offer || `Popular ${restaurant.cuisine.toLowerCase()} option near you.`,
        badge: restaurant.offer || 'Recommended',
        action: { label: 'View menu', screen: 'restaurant', entityId: restaurant.id },
      })),
      source: 'demo',
    };
  }
  if (/pharmacy|chemist|medicine|wellness|health/.test(q)) {
    const picks = catalog.stores.filter((store) => store.category === 'Pharmacy').slice(0, 3);
    return {
      text: `These are the pharmacy options I’d check first in ${context.city}. Availability and medicine suitability must still be confirmed with the pharmacy.`,
      actions: [{ label: 'Nearby pharmacies', screen: 'shops', shopCategory: 'Pharmacy' }],
      recommendations: picks.map((store) => ({ id:store.id, title:store.name, subtitle:`${store.rating.toFixed(1)} ★ · ${store.eta}`, reason:store.deal, badge:store.deliveryFee===0?'Free delivery':'Nearby', action:{label:'Open store', screen:'shop', entityId:store.id, shopCategory:'Pharmacy'} })),
      source: 'demo',
    };
  }
  if (/grocery|groceries|supermarket|shopping|household/.test(q)) {
    const picks = catalog.stores.filter((store) => store.category === 'Groceries').slice(0, 3);
    return {
      text: `Here are grocery options available for the ${context.country} marketplace around ${context.city}.`,
      actions: [{ label: 'Shop groceries', screen: 'shops', shopCategory: 'Groceries' }],
      recommendations: picks.map((store) => ({ id:store.id, title:store.name, subtitle:`${store.rating.toFixed(1)} ★ · ${store.eta}`, reason:store.deal, badge:store.deliveryFee===0?'Free delivery':'Local store', action:{label:'Open store', screen:'shop', entityId:store.id, shopCategory:'Groceries'} })),
      source: 'demo',
    };
  }
  if (/parcel|package|courier|send|deliver/.test(q)) {
    return {
      text: `I can start a Kareebu+ Send delivery from ${context.city}. You’ll choose pickup, drop-off and parcel details before confirming.`,
      actions: [{ label: 'Send a parcel', screen: 'parcel' }],
      recommendations: [],
      source: 'demo',
    };
  }
  if (/wallet|pay|payment|money|top up|mobile money/.test(q)) {
    return {
      text: `Open Kareebu+ Wallet to manage payments and the payment methods available in ${context.country}.`,
      actions: [{ label: 'Open Wallet', screen: 'wallet' }],
      recommendations: [],
      source: 'demo',
    };
  }
  if (/order|track|delivery status|where is/.test(q)) {
    return {
      text: `I can take you to your current and recent orders so you can check delivery status.`,
      actions: [{ label: 'View orders', screen: 'orders' }],
      recommendations: [],
      source: 'demo',
    };
  }
  if (/help|support|account|settings/.test(q)) {
    return {
      text: `I can help you find account, location and support options in Kareebu+.`,
      actions: [{ label: 'Account & support', screen: 'account' }],
      recommendations: [],
      source: 'demo',
    };
  }

  return {
    text: `Tell me what you need around ${where} — for example a budget, food type, journey, pharmacy item, supermarket or delivery. I’ll recommend the best next options from Kareebu+.`,
    actions: [
      { label: 'Food near me', screen: 'food' },
      { label: 'Book a Ride', screen: 'whereTo', rideMode: 'RIDE' },
      { label: 'Shop nearby', screen: 'shops', shopCategory: 'All' },
    ],
    recommendations: [],
    source: 'demo',
  };
}

function validScreen(value: unknown): value is Screen {
  return typeof value === 'string' && [
    'home','search','assistant','services','place','whereTo','chooseRide','confirmBooking','driver','onTrip','tripComplete','rateTrip','food','restaurant','cart','orderTracking','shops','shop','parcel','wallet','account','activity','orders','locationPicker',
  ].includes(value);
}

function normaliseAction(raw: any): KareebuAssistantAction | null {
  if (!raw || typeof raw.label !== 'string' || !validScreen(raw.screen)) return null;
  return {
    label: raw.label,
    screen: raw.screen,
    rideMode: raw.rideMode === 'RIDE' || raw.rideMode === 'BODA' ? raw.rideMode : undefined,
    shopCategory: typeof raw.shopCategory === 'string' && raw.shopCategory ? raw.shopCategory : undefined,
    entityId: typeof raw.entityId === 'string' && raw.entityId ? raw.entityId : undefined,
  };
}

export async function askKareebuAssistant(message: string, context: AssistantContext): Promise<KareebuAssistantReply> {
  if (!AI_URL) return localReply(message, context);

  try {
    const response = await fetch(`${AI_URL}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context: {
          country: context.country,
          city: context.city,
          guest: context.guest,
          app: 'Kareebu+',
          catalog: recommendationCatalog(context),
          history: (context.history ?? []).slice(-8),
        },
      }),
    });
    if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
    const body = await response.json();
    if (!body || typeof body.reply !== 'string') throw new Error('Invalid AI response');
    const actions = Array.isArray(body.actions) ? body.actions.map(normaliseAction).filter(Boolean) as KareebuAssistantAction[] : [];
    const recommendations = Array.isArray(body.recommendations) ? body.recommendations.map((item: any, index: number) => {
      const action = normaliseAction(item?.action);
      if (!action || typeof item?.title !== 'string') return null;
      return {
        id: typeof item.id === 'string' ? item.id : `recommendation-${index}`,
        title: item.title,
        subtitle: typeof item.subtitle === 'string' ? item.subtitle : '',
        reason: typeof item.reason === 'string' ? item.reason : '',
        badge: typeof item.badge === 'string' && item.badge ? item.badge : undefined,
        action,
      } satisfies KareebuAssistantRecommendation;
    }).filter(Boolean) as KareebuAssistantRecommendation[] : [];
    return { text: body.reply, actions, recommendations, source: 'live' };
  } catch {
    return localReply(message, context);
  }
}
