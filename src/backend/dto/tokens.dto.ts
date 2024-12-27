import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TokensResponseSchema = z.array(
  z.object({
    blockchain: z.string(),
    dex: z.string(),
    pairAddress: z.string(),
    baseToken: z.object({
      address: z.string(),
      name: z.string(),
      symbol: z.string(),
    }),
    quoteToken: z.object({
      address: z.string(),
      name: z.string(),
      symbol: z.string(),
    }),
    liquidity: z
      .object({
        usd: z.number(),
        base: z.number().optional(),
        quote: z.number().optional(),
      })
      .optional(),
    volume24h: z.number().optional(),
    mcap: z.number().optional(),
    pairCreatedAt: z.number(),
    trades24h: z.number().optional(),
    usdPrice: z.string().optional(),
    priceInBaseToken: z.string(),
    priceChangePercent24h: z.number().optional(),
    logo: z.string().optional(),
    socials: z
      .array(
        z.object({
          platform: z.string(),
          handle: z.string(),
        }),
      )
      .optional(),
  }),
);

export class TokensResponseDto extends createZodDto(TokensResponseSchema) {}

export type TokensResponse = z.infer<typeof TokensResponseSchema>;
