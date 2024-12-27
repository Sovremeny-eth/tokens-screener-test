import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BackendModule } from './backend/index.js';

@Module({
  imports: [ConfigModule.forRoot(), BackendModule.forRoot()],
})
export class AppModule {}
