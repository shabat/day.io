import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as codes from 'currency-codes';
import { ConfigService } from '@nestjs/config';
import { MonobankService } from '../monobank.service';
import { LAST_UPDATED } from '../constants/supported-currencies';

@Injectable()
export class CurrencyGenerator implements OnModuleInit {
  private readonly SUPPORTED_CURRENCIES_UPDATE_INTERVAL =
    this.configService.get<number>('SUPPORTED_CURRENCIES_UPDATE_INTERVAL');
  private readonly logger = new Logger(CurrencyGenerator.name);
  private readonly filePath = join(
    process.cwd(),
    'src',
    'currency',
    'constants',
    'supported-currencies.ts',
  );

  constructor(
    private readonly monobankService: MonobankService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.checkAndUpdateCurrencies();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledGeneration() {
    await this.checkAndUpdateCurrencies();
  }

  private getISOCurrencyCode(numericCode: number): string {
    const currency = codes.number(numericCode.toString().padStart(3, '0'));
    return currency?.code || numericCode.toString();
  }

  private async checkAndUpdateCurrencies() {
    try {
      const lastUpdate = new Date(LAST_UPDATED);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdate.getTime();

      if (timeDiff >= this.SUPPORTED_CURRENCIES_UPDATE_INTERVAL) {
        this.logger.log('Currency file is outdated, updating...');
        await this.updateCurrencies();
      } else {
        this.logger.log('Currency file is up to date');
      }
    } catch (error) {
      this.logger.error('Error checking currency file:', error);
    }
  }

  private async updateCurrencies() {
    try {
      const rates = await this.monobankService.fetchRates();
      const uniqueCurrencies = new Set<string>();

      rates.forEach((rate) => {
        if (
          rate.rateCross !== undefined ||
          (rate.rateBuy !== undefined && rate.rateSell !== undefined)
        ) {
          const currencyA = this.getISOCurrencyCode(rate.currencyCodeA);
          const currencyB = this.getISOCurrencyCode(rate.currencyCodeB);

          if (codes.code(currencyA)) uniqueCurrencies.add(currencyA);
          if (codes.code(currencyB)) uniqueCurrencies.add(currencyB);
        }
      });

      const currenciesArray = Array.from(uniqueCurrencies).sort();
      await this.generateFileWithCurrencies(currenciesArray);
      this.logger.log('Currency file updated successfully');
    } catch (error) {
      this.logger.warn(
        'Failed to fetch new rates, keeping existing currency file',
        error,
      );
    }
  }

  private async generateFileWithCurrencies(currencies: string[]) {
    const fileContent = this.generateFileContent(currencies);
    await writeFile(this.filePath, fileContent);
  }

  private generateFileContent(currencies: string[]): string {
    return `export const LAST_UPDATED = '${new Date().toISOString()}';

export const SUPPORTED_CURRENCIES = ${JSON.stringify(currencies, null, 2)} as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_DETAILS = ${JSON.stringify(
      Object.fromEntries(
        currencies.map((code) => {
          const currency = codes.code(code);
          return [
            code,
            {
              name: currency?.currency || code,
              number: currency?.number || '',
              code,
            },
          ];
        }),
      ),
      null,
      2,
    )};
`;
  }
}
