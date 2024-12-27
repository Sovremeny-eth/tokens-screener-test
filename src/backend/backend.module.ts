import { DynamicModule, Module } from '@nestjs/common';

import { BackendController } from './backend.controller.js';
import { BackendService } from './backend.service.js';
import {
  AsyncBackendConfigOptions,
  BackendConfigModule,
  BackendConfigOptions,
} from '../config/index.js';

@Module({})
export class BackendModule {
  static forRoot(options?: BackendConfigOptions): DynamicModule {
    return BackendModule$register(options, true);
  }

  static forFeature(options?: BackendConfigOptions): DynamicModule {
    return BackendModule$register(options);
  }

  static forRootAsync(options: AsyncBackendConfigOptions): DynamicModule {
    return BackendModule$registerAsync(options, true);
  }

  static forFeatureAsync(options: AsyncBackendConfigOptions): DynamicModule {
    return BackendModule$registerAsync(options);
  }
}

const BackendModule$draft = {
  module: BackendModule,
  //imports: [],
  providers: [BackendService],
  controllers: [BackendController],
};

function BackendModule$register(
  options: BackendConfigOptions = {},
  global?: boolean,
): DynamicModule {
  return {
    ...BackendModule$draft,
    imports: [BackendConfigModule.forRoot(options)],
    global: global ?? false,
  };
}

function BackendModule$registerAsync(
  options: AsyncBackendConfigOptions,
  global?: boolean,
): DynamicModule {
  return {
    ...BackendModule$draft,
    imports: [BackendConfigModule.forRootAsync(options)],
    global: global ?? false,
  };
}
