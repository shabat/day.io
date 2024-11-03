import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RateFetchException } from '../common/exceptions/currency.exception';
import { CACHE_KEYS } from './constants';
import { ConfigService } from '@nestjs/config';

export interface MonobankRate {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateBuy: number;
  rateSell: number;
  rateCross: number;
}

@Injectable()
export class MonobankService {
  private readonly logger = new Logger(MonobankService.name);
  private readonly API_URL = this.configService.get<string>('MONOBANK_API_URL');
  private readonly CACHE_TTL = this.configService.get<number>('CACHE_TTL');
  private readonly MIN_API_REQUEST_INTERVAL = this.configService.get<number>(
    'MIN_API_REQUEST_INTERVAL',
  );
  private lastRequestTime: number = 0;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async makeRequest(): Promise<MonobankRate[]> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_API_REQUEST_INTERVAL) {
      await this.delay(this.MIN_API_REQUEST_INTERVAL - timeSinceLastRequest);
    }

    const response = await fetch(this.API_URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    this.lastRequestTime = Date.now();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Monobank');
    }

    return data;
  }

  async fetchRates(forceRefresh = false): Promise<MonobankRate[]> {
    try {
      if (!forceRefresh) {
        const cachedRates = await this.cacheManager.get<MonobankRate[]>(
          CACHE_KEYS.MONOBANK,
        );
        if (cachedRates) {
          this.logger.debug('Returning rates from cache');
          return cachedRates;
        }
      }

      this.logger.debug('Fetching fresh rates from Monobank API');
      const rates = await this.makeRequest();
      await this.cacheManager.set(CACHE_KEYS.MONOBANK, rates, this.CACHE_TTL);

      return rates;
    } catch (error) {
      this.logger.error('Failed to fetch rates:', error);

      const staleRates = await this.cacheManager.get<MonobankRate[]>(
        CACHE_KEYS.MONOBANK,
      );
      if (staleRates) {
        this.logger.warn('Returning stale rates from cache due to fetch error');
        return staleRates;
      }

      throw new RateFetchException();
    }
  }

  async getCachedRates(): Promise<MonobankRate[] | null> {
    return this.cacheManager.get<MonobankRate[]>(CACHE_KEYS.MONOBANK);
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.del(CACHE_KEYS.MONOBANK);
  }

  async refreshRates(): Promise<MonobankRate[]> {
    return this.fetchRates(true);
  }

  async isRateStale(): Promise<boolean> {
    const rates = await this.getCachedRates();
    if (!rates) return true;

    const cacheTime = await this.cacheManager.store.get(
      `${CACHE_KEYS.MONOBANK}:timestamp`,
    );
    if (!cacheTime) return true;

    const now = Date.now();
    return now - Number(cacheTime) > this.CACHE_TTL;
  }
}
