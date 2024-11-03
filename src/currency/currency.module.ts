import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { MonobankService } from './monobank.service';
import { CurrencyGenerator } from './tasks/currency.generator';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService, MonobankService, CurrencyGenerator],
})
export class CurrencyModule {}
