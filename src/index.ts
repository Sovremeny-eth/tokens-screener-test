import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useAdapter } from '@type-cacheable/lru-cache-adapter';
import { LRUCache } from 'lru-cache';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app.module.js';
import { BackendConfigService } from './config/index.js';

const lruCacheClient = new LRUCache<string, never>({
  max: 1000,
});
useAdapter(lruCacheClient);

patchNestJsSwagger();

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = application.get(BackendConfigService);
  await config.bootstrap(application);

  // eslint-disable-next-line no-console
  console.log(`Application is running on: ${await application.getUrl()}`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Startup failed', error);
  process.exit(1);
});
