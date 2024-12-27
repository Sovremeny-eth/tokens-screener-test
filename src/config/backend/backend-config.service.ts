import { INestApplication, Inject, Injectable, Logger, VersioningType } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import {
  BACKEND_CONFIG,
  BACKEND_CONFIG_OPTIONS_TOKEN,
  type BackendConfigOptions,
} from './backend-config.options.js';

@Injectable()
export class BackendConfigService {
  readonly #logger: Logger;
  readonly #config: BackendConfigOptions;

  readonly #openAPI: Omit<OpenAPIObject, 'paths'>;

  constructor(
    @Inject(BACKEND_CONFIG_OPTIONS_TOKEN) options: BackendConfigOptions,
    @Inject(BACKEND_CONFIG.KEY) envConfig: ConfigType<typeof BACKEND_CONFIG>,
  ) {
    this.#logger = new Logger(BackendConfigService.name);

    this.#config = options.port ? options : envConfig;

    this.#openAPI = new DocumentBuilder().setTitle('Tokens Screener').setVersion('1.0').build();
  }

  get config() {
    return this.#config;
  }

  async bootstrap(instanceApplication: INestApplication): Promise<boolean> {
    this.setup(instanceApplication);
    await instanceApplication.listen(this.#config.port || 3000, () => {
      this.#logger.log(`Application is running on: ${this.#config.port || 3000}`);
    });

    return true;
  }

  setup(application: INestApplication): void {
    application.enableShutdownHooks();
    application.enableCors({ origin: '*' });

    application.use(helmet());
    application.enableVersioning({
      defaultVersion: '1',
      prefix: 'v',
      type: VersioningType.URI,
    });

    SwaggerModule.setup(
      'api',
      application,
      SwaggerModule.createDocument(application, this.#openAPI),
    );
  }
}
