import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { ZodValidationPipe } from 'nestjs-zod';

import {
  AsyncBackendConfigOptions,
  BACKEND_CONFIG,
  BACKEND_CONFIG_OPTIONS_TOKEN,
  BackendConfigOptions,
} from './backend-config.options.js';
import { BackendConfigService } from './backend-config.service.js';
import { ExceptionFilter, LocalStorageService } from '../../utils/index.js';

@Module({})
export class BackendConfigModule {
  static forRoot(options?: BackendConfigOptions): DynamicModule {
    return BackendConfigModule$register(options, true);
  }

  static forFeature(options?: BackendConfigOptions): DynamicModule {
    return BackendConfigModule$register(options);
  }

  static forRootAsync(options: AsyncBackendConfigOptions): DynamicModule {
    return BackendConfigModule$registerAsync(options, true);
  }

  static forFeatureAsync(options: AsyncBackendConfigOptions): DynamicModule {
    return BackendConfigModule$registerAsync(options);
  }
}

const BackendConfigModule$draft = {
  module: BackendConfigModule,
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
      },
    }),
    ConfigModule.forFeature(BACKEND_CONFIG),
  ],
  providers: [
    BackendConfigService,
    LocalStorageService,
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_FILTER, useClass: ExceptionFilter },
  ],
  exports: [BackendConfigService, LocalStorageService],
};

function BackendConfigModule$register(
  options: BackendConfigOptions = {},
  global?: boolean,
): DynamicModule {
  return {
    ...BackendConfigModule$draft,
    providers: [
      ...BackendConfigModule$draft.providers,
      { provide: BACKEND_CONFIG_OPTIONS_TOKEN, useValue: options },
    ],
    global: global ?? false,
  };
}

function BackendConfigModule$registerAsync(
  options: AsyncBackendConfigOptions,
  global?: boolean,
): DynamicModule {
  return {
    ...BackendConfigModule$draft,
    providers: [
      ...BackendConfigModule$draft.providers,
      { provide: BACKEND_CONFIG_OPTIONS_TOKEN, ...options } as Provider<BackendConfigOptions>,
    ],
    global: global ?? false,
  };
}
