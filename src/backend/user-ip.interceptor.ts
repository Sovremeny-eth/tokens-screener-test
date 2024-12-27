import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { type Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class UserIpInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const userIp = request.ip ?? request.socket.remoteAddress;
    this.cls.set('ip', userIp);
    return next.handle();
  }
}
