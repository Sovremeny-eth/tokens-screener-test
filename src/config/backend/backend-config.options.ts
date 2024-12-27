import { ModuleMetadata, Provider } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

/**
 * {@link BackendConfigModule Backend} initialization options.
 */
export interface BackendConfigOptions {
  /**
   * Config for NestFactory
   *
   */
  readonly port?: string | undefined;
  readonly useProxy?: boolean;
}

/**
 * Options for asynchronous {@link BackendConfigModule Backend} initialization.
 */
export type AsyncBackendConfigOptions = Pick<ModuleMetadata, 'imports' | 'providers'> &
  Omit<Provider<BackendConfigOptions>, 'provider'>;

/**
 * @internal
 */
export const BACKEND_CONFIG_OPTIONS_TOKEN = Symbol('BackendConfigOptions');

/**
 * @internal
 */
export const BACKEND_CONFIG = registerAs<BackendConfigOptions>(
  'config',
  (): BackendConfigOptions => {
    return {
      port: process.env.PORT,
      useProxy: parseBoolean(process.env.USE_PROXY),
    };
  },
);

function parseBoolean(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const val = value.trim().toLowerCase();

  if (val === 'disabled' || val === 'off' || val === '0' || val === 'false') {
    return false;
  }
  if (val === 'true' || val === '1' || val === 'on' || val === 'enabled') {
    return true;
  }

  return false;
}
