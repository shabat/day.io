import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';

interface ErrorResponse {
  statusCode: number;
  message: string;
  code: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const errorResponse = this.createErrorResponse(exception, request.url);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private createErrorResponse(exception: unknown, path: string): ErrorResponse {
    if (exception instanceof CustomException) {
      return this.handleCustomException(exception, path);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, path);
    }

    return this.handleUnknownException(path);
  }

  private handleCustomException(
    exception: CustomException,
    path: string,
  ): ErrorResponse {
    return {
      statusCode: exception.status,
      message: exception.message,
      code: exception.code,
      details: exception.details,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  private handleHttpException(
    exception: HttpException,
    path: string,
  ): ErrorResponse {
    const response = exception.getResponse() as Record<string, any>;

    return {
      statusCode: exception.getStatus(),
      message: response.message || exception.message,
      code: 'HTTP_ERROR',
      details: response.error ? { error: response.error } : undefined,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  private handleUnknownException(path: string): ErrorResponse {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path,
    };
  }
}
