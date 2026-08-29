/**
 * The Forge Line — the product registry of Trades 2.0.
 *
 * One entry per trade being migrated from manual craft to automated systems.
 * Same discipline as every registry in the network: this file is the single
 * source of truth; cards, links and structured data derive from it. Honesty
 * rule: taglines say what a product is FOR and its real status — no invented
 * capabilities, and `live`/`repo` only when a visitor can actually open it.
 */

export type ForgeProduct = {
  key: string;
  name: string;
  /** i18n key for the trade label. */
  tradeKey: string;
  /** i18n key for the tagline. */
  taglineKey: string;
  repo?: string;
  live?: string;
  status: 'shipped' | 'in-development';
};

export const forgeLine: ForgeProduct[] = [
  {
    key: 'palletizer',
    name: 'Palletizer OS',
    tradeKey: 'pz_trade',
    taglineKey: 'pz_tag',
    repo: 'https://github.com/iceccarelli/palletizer',
    live: 'https://palletizer-app.vercel.app',
    status: 'shipped',
  },
  {
    key: 'floorforge',
    name: 'FloorForge AI',
    tradeKey: 'ff_trade',
    taglineKey: 'ff_tag',
    repo: 'https://github.com/iceccarelli/floorforge-ai',
    status: 'in-development',
  },
  {
    key: 'paintforge',
    name: 'PaintForge AI',
    tradeKey: 'pf_trade',
    taglineKey: 'pf_tag',
    repo: 'https://github.com/iceccarelli/paintforge-ai',
    status: 'in-development',
  },
  {
    key: 'dryforge',
    name: 'DryForge AI',
    tradeKey: 'df_trade',
    taglineKey: 'df_tag',
    repo: 'https://github.com/iceccarelli/dryforge-ai',
    status: 'in-development',
  },
];
