export const CACHE_KEYS = {
  RATES: 'exchange_rates',
  CURRENCIES: 'supported_currencies',
  MONOBANK: 'monobank_rates',
} as const;

export const CURRENCIES = {
  BASE: 'UAH',
  BASE_NUMERIC: '980',
} as const;

export interface ConversionRate {
  rate: number;
  type: ConversionType;
}
export enum ConversionType {
  CROSS = 'cross',
  BUY_SELL = 'buy-sell',
  SAME_CURRENCY = 'same-currency',
}
