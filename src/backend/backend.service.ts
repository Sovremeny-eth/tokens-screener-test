import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cacheable } from '@type-cacheable/core';

import {
  BaseScreener,
  DexScreener,
  FetchRetryException,
  GeckoTerminal,
  ScreenerName,
} from '../core/index.js';
import { LocalStorageService } from '../utils/index.js';
import { TokensResponse } from './dto/index.js';

export const NameType = {
  symbol: 'symbol',
  address: 'address',
  pair: 'pair',
} as const;

export type NameType = (typeof NameType)[keyof typeof NameType];

@Injectable()
export class BackendService {
  readonly #logger: Logger;
  readonly #localStorage: LocalStorageService;

  readonly #screenerServices: Record<ScreenerName, BaseScreener>;

  constructor(localStorage: LocalStorageService) {
    this.#logger = new Logger(new.target.name);
    this.#localStorage = localStorage;

    this.#screenerServices = {
      [ScreenerName.Geckoterminal]: new GeckoTerminal(),
      [ScreenerName.DexScreener]: new DexScreener(),
    };
  }

  @Cacheable({
    cacheKey: (params): string => {
      const args = params[0];
      return `${args.name}:${args.data}`;
    },
    hashKey: 'getTokenMetadata',
    ttlSeconds: 5,
  })
  async getTokenMetadata(args: { name: NameType; data: string }): Promise<TokensResponse> {
    const { name, data } = args;

    try {
      switch (name) {
        case NameType.symbol: {
          const values = Object.values(ScreenerName);
          const randomIndex = Math.floor(Math.random() * values.length);

          const result = await this.#screenerServices[values[randomIndex]!].executeSymbol(data);
          this.#logger.log(`Success response for ${data} symbol`, this.#localStorage.getContext());
          return result;
        }

        case NameType.address: {
          const values = Object.values(ScreenerName);
          const randomIndex = Math.floor(Math.random() * values.length);

          const result = await this.#screenerServices[values[randomIndex]!].executeAddress(data);
          this.#logger.log(`Success response for ${data} address`, this.#localStorage.getContext());
          return result;
        }

        case NameType.pair: {
          const result = await this.#screenerServices[ScreenerName.DexScreener].executePair(data);
          this.#logger.log(`Success response for ${data} pair`, this.#localStorage.getContext());
          return result;
        }
      }
    } catch (err) {
      if (err instanceof FetchRetryException) {
        throw new BadRequestException(err.message, { cause: err.cause });
      }

      throw err;
    }
  }
}
