import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LocalStorageService {
  constructor(private readonly cls: ClsService) {}

  getContext(): { reqId: string; userIp: string | undefined } {
    const reqId = this.cls.getId();
    const userIp = this.cls.get<string | undefined>('ip');
    return { reqId, userIp };
  }
}
