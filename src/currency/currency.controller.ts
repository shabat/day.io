import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';

@Controller('currency')
@ApiTags('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('supported')
  @ApiOperation({ summary: 'Get list of supported currencies' })
  @ApiResponse({
    status: 200,
    description: 'List of supported currencies',
    schema: {
      example: {
        USD: {
          name: 'US Dollar',
          number: '840',
          code: 'USD',
        },
      },
    },
  })
  async getSupportedCurrencies() {
    return this.currencyService.getSupportedCurrencies();
  }

  @Post('convert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert amount between currencies' })
  @ApiResponse({
    status: 200,
    description: 'Successful conversion',
    schema: {
      example: {
        amount: 3700,
        sourceCurrency: 'USD',
        targetCurrency: 'UAH',
        rate: 37,
        timestamp: '2024-11-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid currency pair' })
  async convertCurrency(@Body() convertCurrencyDto: ConvertCurrencyDto) {
    return this.currencyService.convertCurrency(convertCurrencyDto);
  }
}
