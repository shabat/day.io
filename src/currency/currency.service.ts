import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MonobankService, MonobankRate } from './monobank.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import {
  CURRENCY_DETAILS,
  SupportedCurrency,
} from './constants/supported-currencies';
import {
  CACHE_KEYS,
  ConversionRate,
  ConversionType,
  CURRENCIES,
} from './constants';
import {
  ConversionNotSupportedException,
  CurrencyNotFoundException,
} from '../common/exceptions/currency.exception';

@Injectable()
export class CurrencyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly currencyProvider: MonobankService,
  ) {}

  async getRates(): Promise<MonobankRate[]> {
    return this.getCachedData<MonobankRate[]>(CACHE_KEYS.RATES, () =>
      this.currencyProvider.fetchRates(),
    );
  }

  async convertCurrency(convertCurrencyDto: ConvertCurrencyDto) {
    const { sourceCurrency, targetCurrency, amount } = convertCurrencyDto;
    this.validateCurrencies(sourceCurrency, targetCurrency);

    const conversionRate = await this.getConversionRate(
      sourceCurrency,
      targetCurrency,
    );
    return this.formatConversionResult(
      amount,
      conversionRate,
      sourceCurrency,
      targetCurrency,
    );
  }

  private async getConversionRate(
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
  ): Promise<ConversionRate> {
    if (sourceCurrency === targetCurrency) {
      return { rate: 1, type: ConversionType.SAME_CURRENCY };
    }

    const rates = await this.getRates();

    if (targetCurrency === CURRENCIES.BASE) {
      return this.handleDirectConversionToUAH(rates, sourceCurrency);
    }

    if (sourceCurrency === CURRENCIES.BASE) {
      return this.handleDirectConversionFromUAH(rates, targetCurrency);
    }

    return this.handleCrossConversion(rates, sourceCurrency, targetCurrency);
  }

  private handleDirectConversionToUAH(
    rates: MonobankRate[],
    sourceCurrency: SupportedCurrency,
  ): ConversionRate {
    const sourceNumericCode = this.getCurrencyNumericCode(sourceCurrency);
    const directRate = this.findRate(rates, sourceNumericCode);

    if (!directRate) {
      throw new ConversionNotSupportedException(
        sourceCurrency,
        CURRENCIES.BASE,
      );
    }

    return {
      rate: directRate.rateCross ?? directRate.rateSell,
      type: directRate.rateCross
        ? ConversionType.CROSS
        : ConversionType.BUY_SELL,
    };
  }

  private handleDirectConversionFromUAH(
    rates: MonobankRate[],
    targetCurrency: SupportedCurrency,
  ): ConversionRate {
    const targetNumericCode = this.getCurrencyNumericCode(targetCurrency);
    const directRate = this.findRate(rates, targetNumericCode);

    if (!directRate) {
      throw new ConversionNotSupportedException(
        CURRENCIES.BASE,
        targetCurrency,
      );
    }

    return {
      rate: 1 / (directRate.rateCross ?? directRate.rateBuy),
      type: directRate.rateCross
        ? ConversionType.CROSS
        : ConversionType.BUY_SELL,
    };
  }

  private handleCrossConversion(
    rates: MonobankRate[],
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
  ): ConversionRate {
    const sourceNumericCode = this.getCurrencyNumericCode(sourceCurrency);
    const targetNumericCode = this.getCurrencyNumericCode(targetCurrency);

    const directCrossRate = this.findDirectCrossRate(
      rates,
      sourceNumericCode,
      targetNumericCode,
    );

    if (directCrossRate) {
      return { rate: directCrossRate.rateCross, type: ConversionType.CROSS };
    }

    return this.calculateCrossRateViaBase(
      rates,
      sourceNumericCode,
      targetNumericCode,
      sourceCurrency,
      targetCurrency,
    );
  }

  private getCurrencyNumericCode(currency: SupportedCurrency): number {
    return parseInt(CURRENCY_DETAILS[currency].number);
  }

  private findRate(
    rates: MonobankRate[],
    currencyCode: number,
  ): MonobankRate | undefined {
    return rates.find((r) => r.currencyCodeA === currencyCode);
  }

  private findDirectCrossRate(
    rates: MonobankRate[],
    sourceCode: number,
    targetCode: number,
  ): MonobankRate | undefined {
    return rates.find(
      (r) =>
        r.currencyCodeA === sourceCode &&
        r.currencyCodeB === targetCode &&
        r.rateCross !== undefined,
    );
  }

  private calculateCrossRateViaBase(
    rates: MonobankRate[],
    sourceCode: number,
    targetCode: number,
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
  ): ConversionRate {
    const sourceRate = this.findRate(rates, sourceCode);
    const targetRate = this.findRate(rates, targetCode);

    if (!sourceRate || !targetRate) {
      throw new ConversionNotSupportedException(sourceCurrency, targetCurrency);
    }

    const sourceToUah = sourceRate.rateCross ?? sourceRate.rateSell;
    const uahToTarget = 1 / (targetRate.rateCross ?? targetRate.rateBuy);

    return {
      rate: sourceToUah * uahToTarget,
      type: ConversionType.CROSS,
    };
  }

  private validateCurrencies(
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
  ): void {
    if (
      !CURRENCY_DETAILS[sourceCurrency] ||
      !CURRENCY_DETAILS[targetCurrency]
    ) {
      const invalidCurrency = !CURRENCY_DETAILS[sourceCurrency]
        ? sourceCurrency
        : targetCurrency;
      throw new CurrencyNotFoundException(invalidCurrency);
    }
  }

  private formatConversionResult(
    amount: number,
    conversionRate: ConversionRate,
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
  ) {
    const convertedAmount = amount * conversionRate.rate;

    return {
      amount: Number(convertedAmount.toFixed(2)),
      sourceCurrency,
      targetCurrency,
      sourceInfo: CURRENCY_DETAILS[sourceCurrency].name,
      targetInfo: CURRENCY_DETAILS[targetCurrency].name,
      rate: Number(conversionRate.rate.toFixed(5)),
      conversionType: conversionRate.type,
      timestamp: new Date().toISOString(),
    };
  }

  private async getCachedData<T>(
    key: string,
    fetchData: () => Promise<T>,
  ): Promise<T> {
    const cachedData = await this.cacheManager.get<T>(key);
    if (cachedData) return cachedData;

    const freshData = await fetchData();
    await this.cacheManager.set(key, freshData);
    return freshData;
  }

  async getSupportedCurrencies() {
    return this.getCachedData(CACHE_KEYS.CURRENCIES, () =>
      Promise.resolve(CURRENCY_DETAILS),
    );
  }
}
