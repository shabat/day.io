import { IsEnum, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
} from '../constants/supported-currencies';

export class ConvertCurrencyDto {
  @ApiProperty({
    enum: SUPPORTED_CURRENCIES,
    enumName: 'Currency',
    description: 'Source currency',
    example: SUPPORTED_CURRENCIES[0],
  })
  @IsEnum(SUPPORTED_CURRENCIES, {
    message: 'Target currency should be one of the allowed values',
  })
  @IsNotEmpty()
  sourceCurrency: SupportedCurrency;

  @ApiProperty({
    enum: SUPPORTED_CURRENCIES,
    enumName: 'Currency',
    description: 'Target currency',
    example: SUPPORTED_CURRENCIES[0],
  })
  @IsEnum(SUPPORTED_CURRENCIES, {
    message: 'Target currency should be one of the allowed values',
  })
  @IsNotEmpty()
  targetCurrency: SupportedCurrency;

  @ApiProperty({
    description: 'Amount to convert',
    example: 100,
    minimum: 0,
  })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
