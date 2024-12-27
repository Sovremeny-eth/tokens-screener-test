import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';

import { BackendConfigModule } from './backend-config.module.js';
import { BackendConfigService } from './backend-config.service.js';

describe('BackendConfigService', () => {
  let moduleRef$default: TestingModule;
  let moduleRef$withOptions: TestingModule;

  let service$default: BackendConfigService;
  let service$withOptions: BackendConfigService;

  let options: Record<string, string>;

  beforeAll(async () => {
    options = {
      port: '3456',
    };

    moduleRef$default = await Test.createTestingModule({
      imports: [BackendConfigModule.forRoot()],
    }).compile();

    moduleRef$withOptions = await Test.createTestingModule({
      imports: [BackendConfigModule.forRoot(options)],
    }).compile();

    service$default = moduleRef$default.get(BackendConfigService);
    service$withOptions = moduleRef$withOptions.get(BackendConfigService);
  });

  afterAll(async () => {
    await moduleRef$default.close();
    await moduleRef$withOptions.close();
  });

  describe('test default', () => {
    it('testing', () => {
      expect(service$default.config.port).toBeUndefined();
    });
  });

  describe('test with options', () => {
    it('testing', () => {
      expect(service$withOptions.config.port).toBe('3456');
    });
  });
});
