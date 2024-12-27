import { TokensResponse } from '../../backend/dto/index.js';
import { BaseScreener, ScreenerName } from '../base-screener.js';

// NOTE: query is pool address, token address and symbol
// https://api.geckoterminal.com/api/v2/search/pools?query=BONG&page=1
export class GeckoTerminal extends BaseScreener {
  readonly screenerName: ScreenerName;

  readonly #baseUrl = new URL('https://api.geckoterminal.com/api/v2/search/pools');

  constructor() {
    super();
    this.screenerName = ScreenerName.Geckoterminal;
  }

  override async executeSymbol(symbol: string) {
    const path = this.#baseUrl + '?query=' + symbol + '&page=1';

    return await super.executeSymbol(path);
  }

  override async executeAddress(address: string) {
    const path = this.#baseUrl + '?query=' + address + '&page=1';

    return await super.executeAddress(path);
  }

  override async executePair(_path: string): Promise<TokensResponse> {
    throw new Error('Geckoterminal does not support pair');
  }
}

export type GeckoTerminalResponse = {
  data: [
    {
      id: string;
      type: string;
      attributes: {
        name: string;
        address: string;
        base_token_price_usd: string;
        quote_token_price_usd: string;
        base_token_price_native_currency: string;
        quote_token_price_native_currency: string;
        base_token_price_quote_token: string;
        quote_token_price_base_token: string;
        pool_created_at: string;
        reserve_in_usd: string;
        fdv_usd: string;
        market_cap_usd: string | null;
        price_change_percentage: {
          h24: string;
        };
        transactions: {
          h24: {
            buys: number;
            sells: number;
            buyers: number;
            sellers: number;
          };
        };
        volume_usd: {
          h24: string;
        };
      };
      relationships: {
        base_token: {
          data: {
            id: string;
            type: string;
          };
        };
        quote_token: {
          data: {
            id: string;
            type: string;
          };
        };
        dex: {
          data: {
            id: string;
            type: string;
          };
        };
      };
    },
  ];
};
