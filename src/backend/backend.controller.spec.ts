import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { BackendModule } from './backend.module.js';
import { BackendConfigService } from '../config/index.js';

describe('EventsControllerV1', () => {
  let application: INestApplication;
  let moduleRef: TestingModule;

  const pathGlobalRoute = '/v1/';

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [BackendModule.forRoot({ port: '3001' })],
    }).compile();

    application = moduleRef.createNestApplication();

    const config = application.get(BackendConfigService);
    await config.bootstrap(application);
  });

  afterAll(async () => {
    await application.close();
  });

  describe('test API', () => {
    const pathApiSignRoute = 'tokens';

    describe('/GET token metadata', () => {
      it('Participation #1', async () => {
        await request(application.getHttpServer())
          .get(pathGlobalRoute + pathApiSignRoute + '?symbol=SOL&address=123523')
          .set('Accept', 'application/json')
          .expect(400)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Participation #2', async () => {
        const response = await request(application.getHttpServer())
          .get(pathGlobalRoute + pathApiSignRoute + '?address=1235236325')
          .set('Accept', 'application/json')
          .expect(200)
          .expect(HttpStatus.OK);

        expect(response.body).toEqual([]);
      });
    });
  });
});
