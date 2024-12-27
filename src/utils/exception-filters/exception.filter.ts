import {
  ArgumentsHost,
  ExceptionFilter as BaseExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

import { LocalStorageService } from '../local-storage.service.js';

type ErrorResponse = {
  cause?: ErrorResponse;
  errors?: unknown[];
  message: string;
  stacktrace?: string;
};

@Catch()
export class ExceptionFilter implements BaseExceptionFilter<unknown> {
  constructor(private readonly localStorage: LocalStorageService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { method = 'GET', url = '/' } = request;

    const logger = new Logger(`${method} ${url}`);

    const [statusCode, errResponse] = this.#internalHandle(exception, true, logger);

    response.status(statusCode).json(errResponse);
  }

  #internalHandle(
    exception: unknown,
    withLogs: boolean,
    logger: Logger,
  ): [HttpStatus, ErrorResponse] {
    let status: HttpStatus;
    let errResponse: ErrorResponse;

    if (exception instanceof ZodValidationException) {
      [status, errResponse] = this.#handleZodValidationException(exception, logger);
    } else if (exception instanceof HttpException) {
      [status, errResponse] = this.#handleHttpException(exception, logger);
    } else if (exception instanceof Error) {
      [status, errResponse] = this.#handleError(exception, logger);
    } else {
      [status, errResponse] = this.#notErrorException(exception);
    }

    if (withLogs) {
      logger.error('Error with context', {
        error: errResponse,
        context: this.localStorage.getContext(),
      });
    }

    delete errResponse.stacktrace;

    return [status, errResponse];
  }

  #handleZodValidationException(
    err: ZodValidationException,
    logger: Logger,
  ): [HttpStatus, ErrorResponse] {
    return [
      HttpStatus.BAD_REQUEST,
      {
        errors: err.getZodError().errors,
        ...(err.cause ? { cause: this.#internalHandle(err.cause, false, logger)[1] } : null),
        message: err.message,
        ...(err.stack && { stacktrace: err.stack }),
      },
    ];
  }

  #handleHttpException(err: HttpException, logger: Logger): [HttpStatus, ErrorResponse] {
    return [
      err.getStatus(),
      {
        ...(err.cause ? { cause: this.#internalHandle(err.cause, false, logger)[1] } : null),
        message: err.message,
        ...(err.stack && { stacktrace: err.stack }),
      },
    ];
  }

  #handleError(err: Error, logger: Logger): [HttpStatus, ErrorResponse] {
    return [
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        ...(err.cause ? { cause: this.#internalHandle(err.cause, false, logger)[1] } : null),
        message: err.message,
        ...(err.stack && { stacktrace: err.stack }),
      },
    ];
  }

  #notErrorException(exception: unknown): [HttpStatus, ErrorResponse] {
    return [
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        message: String(exception),
      },
    ];
  }
}
