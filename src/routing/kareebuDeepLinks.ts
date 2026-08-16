import type { Screen } from '../types';

const ROUTES: Array<{ match: RegExp; screen: Screen }> = [
  { match: /^\/?home\/?$/i, screen: 'home' },
  { match: /^\/?search\/?$/i, screen: 'search' },
  { match: /^\/?food\/?$/i, screen: 'food' },
  { match: /^\/?food\/(search|discover)\/?$/i, screen: 'food' },
  { match: /^\/?food\/schedule\/?$/i, screen: 'foodSchedule' },
  { match: /^\/?rides?\/?$/i, screen: 'mobilityHome' },
  { match: /^\/?rides?\/business\/?$/i, screen: 'rideBusiness' },
  { match: /^\/?rides?\/settings\/?$/i, screen: 'rideSettings' },
  { match: /^\/?shops?\/?$/i, screen: 'shops' },
  { match: /^\/?shops?\/help\/?$/i, screen: 'shopHelp' },
  { match: /^\/?pay\/?$/i, screen: 'wallet' },
  { match: /^\/?pay\/send\/?$/i, screen: 'paySend' },
  { match: /^\/?pay\/request\/?$/i, screen: 'payRequest' },
  { match: /^\/?pay\/topup\/?$/i, screen: 'payTopUp' },
  { match: /^\/?pay\/bills\/?$/i, screen: 'payBills' },
  { match: /^\/?pay\/recharge\/?$/i, screen: 'payRecharge' },
  { match: /^\/?pay\/gift-cards\/?$/i, screen: 'payGiftCards' },
  { match: /^\/?pay\/send-abroad\/?$/i, screen: 'payRemittance' },
  { match: /^\/?plus\/?$/i, screen: 'plusManage' },
  { match: /^\/?plus\/savings\/?$/i, screen: 'plusSavings' },
  { match: /^\/?explore\/?$/i, screen: 'exploreHub' },
  { match: /^\/?stories\/?$/i, screen: 'stories' },
  { match: /^\/?support\/?$/i, screen: 'support' },
  { match: /^\/?support\/inbox\/?$/i, screen: 'supportInbox' },
  { match: /^\/?account\/?$/i, screen: 'account' },
  { match: /^\/?account\/privacy\/?$/i, screen: 'accountPrivacy' },
  { match: /^\/?orders?\/?$/i, screen: 'orders' },
  { match: /^\/?activity\/?$/i, screen: 'activity' },
  { match: /^\/?order-anything\/?$/i, screen: 'orderAnything' },
  { match: /^\/?for-good\/?$/i, screen: 'donations' },
];

function pathFromUrl(url: string) {
  const cleaned = url.trim();
  if (!cleaned) return '';
  const schemeSplit = cleaned.split('://');
  if (schemeSplit.length < 2) return cleaned.split(/[?#]/)[0] ?? '';
  const rest = schemeSplit.slice(1).join('://');
  const withoutQuery = rest.split(/[?#]/)[0] ?? '';
  const slash = withoutQuery.indexOf('/');
  if (slash < 0) return withoutQuery;
  const host = withoutQuery.slice(0, slash);
  const pathname = withoutQuery.slice(slash + 1);
  // kareebuplus://pay/send => host=pay, pathname=send
  return pathname ? `${host}/${pathname}` : host;
}

export function resolveKareebuDeepLink(url: string): Screen | null {
  const path = pathFromUrl(url).replace(/^\/+|\/+$/g, '');
  for (const route of ROUTES) {
    if (route.match.test(path)) return route.screen;
  }
  return null;
}

export const KAREEBU_DEEP_LINK_EXAMPLES = [
  'kareebuplus://food',
  'kareebuplus://rides',
  'kareebuplus://pay/send',
  'kareebuplus://explore',
  'kareebuplus://support/inbox',
] as const;
