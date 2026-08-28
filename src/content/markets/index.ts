import { kenyaContent } from './kenya';
import { tanzaniaContent } from './tanzania';
import type { MarketContentPack } from './types';
import { ugandaContent } from './uganda';

export type { MarketContentPack } from './types';

const MARKET_CONTENT: Record<MarketContentPack['country'], MarketContentPack> = {
  Uganda: ugandaContent,
  Kenya: kenyaContent,
  Tanzania: tanzaniaContent,
};

export function marketContent(country: string): MarketContentPack {
  return MARKET_CONTENT[country as MarketContentPack['country']] ?? MARKET_CONTENT.Uganda;
}
