import { beforeAll, describe, expect, it } from '@jest/globals';

import { BaseScreener } from './base-screener.js';
import { DexScreener } from './screeners/dex-screener.js';
import { GeckoTerminal } from './screeners/gecko-terminal.js';

const symbols = ['SOL', 'USDT', 'USDC', 'ETH'];
const addresses = [
  'So11111111111111111111111111111111111111112',
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
];
const pairs = ['SOL/USDC', 'ETH/USDT'];

const badAddress = '00000000000000000000000000000000';
const badSymbol = 'qwettgvcxsnhsdf';

describe('BaseScreener', () => {
  let dexScreener: BaseScreener;
  let geckoTerminal: BaseScreener;

  beforeAll(async () => {
    dexScreener = new DexScreener();
    geckoTerminal = new GeckoTerminal();
  });

  describe('test screeners', () => {
    it('dex screener', async () => {
      const resSymbols = symbols.map((symbol) => dexScreener.executeSymbol(symbol));
      const resAddresses = addresses.map((address) => dexScreener.executeAddress(address));
      const resPairs = pairs.map((pair) => dexScreener.executePair(pair));

      const result = await Promise.all([...resSymbols, ...resAddresses, ...resPairs]);

      expect(result.length).toBe(symbols.length + addresses.length + pairs.length);

      const [badResAddress, badResSymbol] = await Promise.all([
        dexScreener.executeAddress(badAddress),
        dexScreener.executeSymbol(badSymbol),
      ]);

      expect(badResAddress).toEqual([]);
      expect(badResSymbol).toEqual([]);
    }, 10000);

    it('gecko terminal', async () => {
      const resSymbols = symbols.map((symbol) => geckoTerminal.executeSymbol(symbol));
      const resAddresses = addresses.map((address) => geckoTerminal.executeAddress(address));

      const result = await Promise.all([...resSymbols, ...resAddresses]);
      expect(result.length).toBe(symbols.length + addresses.length);

      const [badResAddress, badResSymbol] = await Promise.all([
        geckoTerminal.executeAddress(badAddress),
        geckoTerminal.executeSymbol(badSymbol),
      ]);

      expect(badResAddress).toEqual([]);
      expect(badResSymbol).toEqual([]);

      const errRes = async () => await geckoTerminal.executePair(pairs[0]!);
      await expect(errRes()).rejects.toThrow();
    }, 10000);
  });
});
