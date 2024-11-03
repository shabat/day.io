import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class CurrencyNotFoundException extends CustomException {
  constructor(currency: string) {
    super(
      `Currency ${currency} is not supported`,
      'CURRENCY_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      { currency },
    );
  }
}

export class ConversionNotSupportedException extends CustomException {
  constructor(from: string, to: string) {
    super(
      `Conversion from ${from} to ${to} is not supported`,
      'CONVERSION_NOT_SUPPORTED',
      HttpStatus.BAD_REQUEST,
      { sourceCurrency: from, targetCurrency: to },
    );
  }
}

export class RateFetchException extends CustomException {
  constructor(details?: any) {
    super(
      'Failed to fetch exchange rates',
      'RATE_FETCH_FAILED',
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
    );
  }
}

export class CacheException extends CustomException {
  constructor(operation: string, details?: any) {
    super(
      `Cache ${operation} operation failed`,
      'CACHE_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    );
  }
}
