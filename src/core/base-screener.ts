import { HttpException } from '@nestjs/common';
import { ProxyAgent, fetch as undiciFetch } from 'undici';

import { DexScreenerResponse } from './screeners/dex-screener.js';
import { GeckoTerminalResponse } from './screeners/gecko-terminal.js';
import { TokensResponse } from '../backend/dto/index.js';

export const ScreenerName = {
  DexScreener: 'DexScreener',
  Geckoterminal: 'Geckoterminal',
} as const;

export type ScreenerName = (typeof ScreenerName)[keyof typeof ScreenerName];

export class FetchRetryException extends Error {
  constructor(cause: Error) {
    super('Fetch failed after retries', { cause });
  }
}

const proxyUrls = [
  'http://DNPRS25131:EIJNQTU5@74.80.152.183:5863',
  'http://DNPRS25131:EIJNQTU5@74.80.173.177:4796',
];

export abstract class BaseScreener {
  abstract readonly screenerName: ScreenerName;

  protected constructor() {}

  async executeSymbol(path: string): Promise<TokensResponse> {
    const response = await this.#execute(path);
    return this.#deserialize(response);
  }

  async executeAddress(path: string): Promise<TokensResponse> {
    const response = await this.#execute(path);
    return this.#deserialize(response);
  }

  async executePair(path: string): Promise<TokensResponse> {
    const response = await this.#execute(path);
    return this.#deserialize(response);
  }

  async #execute<T extends DexScreenerResponse | GeckoTerminalResponse>(path: string): Promise<T> {
    let err: Error | HttpException | null = null;

    for (let retries = 1; retries <= 5; ++retries) {
      try {
        const response = await undiciFetch(path, {
          method: 'GET',
          dispatcher: new ProxyAgent(proxyUrls[Math.floor(Math.random() * proxyUrls.length)]!),
        });

        if (response.ok) {
          return (await response.json()) as T;
        }

        throw new HttpException(await response.text(), response.status);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (!(error instanceof HttpException) || error.getStatus() !== 429) {
          throw error;
        }

        err = error;

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new FetchRetryException(err!);
  }

  #deserialize(data: DexScreenerResponse | GeckoTerminalResponse): TokensResponse {
    if ('schemaVersion' in data) {
      if (data.pairs === null) {
        return [];
      }

      return data.pairs.map((value) => {
        return {
          blockchain: value.chainId,
          dex: value.dexId,
          pairAddress: value.pairAddress,
          baseToken: value.baseToken,
          quoteToken: value.quoteToken,
          liquidity: value.liquidity,
          volume24h: value.volume?.h24,
          mcap: value.marketCap,
          pairCreatedAt: value.pairCreatedAt,
          trades24h: value.txns ? value.txns.h24.buys + value.txns.h24.sells : undefined,
          usdPrice: value.priceUsd,
          priceInBaseToken: value.priceNative,
          priceChangePercent24h: value.priceChange?.h24,
          logo: value.info?.imageUrl,
          socials: value.info?.socials,
        };
      });
    }

    return data.data.map((value) => ({
      blockchain: value.id.split('_')[0]!,
      dex: value.relationships.dex.data.id,
      pairAddress: value.attributes.address,
      baseToken: {
        address: value.relationships.base_token.data.id.split('_')[1]!,
        name: value.attributes.name.split(' ')[0]!,
        symbol: value.attributes.name.split(' ')[0]!,
      },
      quoteToken: {
        address: value.relationships.quote_token.data.id.split('_')[1]!,
        name: value.attributes.name.split(' ')[value.attributes.name.split(' ').length - 1]!,
        symbol: value.attributes.name.split(' ')[value.attributes.name.split(' ').length - 1]!,
      },
      liquidity: {
        usd: Number(value.attributes.reserve_in_usd),
      },
      volume24h: value.attributes.volume_usd ? Number(value.attributes.volume_usd.h24) : undefined,
      mcap:
        value.attributes.market_cap_usd === null
          ? undefined
          : Number(value.attributes.market_cap_usd),
      pairCreatedAt: Number(value.attributes.pool_created_at),
      trades24h: value.attributes.transactions
        ? value.attributes.transactions.h24.buys + value.attributes.transactions.h24.sells
        : undefined,
      usdPrice: value.attributes.base_token_price_usd,
      priceInBaseToken: value.attributes.base_token_price_native_currency,
      priceChangePercent24h: value.attributes.price_change_percentage
        ? Number(value.attributes.price_change_percentage.h24)
        : undefined,
    }));
  }
}
