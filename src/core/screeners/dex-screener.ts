import { BaseScreener, ScreenerName } from '../base-screener.js';

// NOTE: query is token address, symbols and pairs
// https://api.dexscreener.com/latest/dex/tokens/{tokenAddresses}'
// https://api.dexscreener.com/latest/dex/search?q=SOL/USDC or USDC
export class DexScreener extends BaseScreener {
  readonly screenerName: ScreenerName;

  readonly #baseUrl = new URL('https://api.dexscreener.com/latest/dex/');

  constructor() {
    super();
    this.screenerName = ScreenerName.DexScreener;
  }

  override async executeSymbol(symbol: string) {
    const path = this.#baseUrl + 'search/?q=' + symbol;

    return await super.executeSymbol(path);
  }

  override async executeAddress(address: string) {
    const path = this.#baseUrl + 'tokens/' + address;

    return await super.executeAddress(path);
  }

  override async executePair(pair: string) {
    const path = this.#baseUrl + 'search/?q=' + pair;

    return await super.executePair(path);
  }
}

export type DexScreenerResponse = {
  schemaVersion: string;
  pairs:
    | [
        {
          chainId: string;
          dexId: string;
          url: string;
          pairAddress: string;
          labels?: [string];
          baseToken: {
            address: string;
            name: string;
            symbol: string;
          };
          quoteToken: {
            address: string;
            name: string;
            symbol: string;
          };
          priceNative: string;
          priceUsd?: string;
          liquidity?: {
            usd: number;
            base: number;
            quote: number;
          };
          volume?: {
            h24: number;
          };
          priceChange?: {
            h24: number;
          };
          txns?: {
            h24: {
              buys: number;
              sells: number;
            };
          };
          fdv?: number;
          marketCap?: number;
          pairCreatedAt: number;
          info?: {
            imageUrl?: string;
            websites?: [
              {
                url: string;
              },
            ];
            socials?: [
              {
                platform: string;
                handle: string;
              },
            ];
          };
        },
      ]
    | null;
};
