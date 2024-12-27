import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TokensQuerySchema = z.object({
  symbol: z.string().optional().describe('The token symbol to search'),
  address: z.string().optional().describe('The token address to search'),
  pair: z.string().optional().describe('The pair to search'),
});

export class TokensQueryDto extends createZodDto(TokensQuerySchema) {}

export type TokensQuery = z.infer<typeof TokensQuerySchema>;
