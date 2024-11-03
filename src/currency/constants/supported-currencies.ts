export const LAST_UPDATED = '2024-11-03T11:27:56.349Z';

export const SUPPORTED_CURRENCIES = [
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'AOA',
  'ARS',
  'AUD',
  'AZN',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BND',
  'BOB',
  'BRL',
  'BWP',
  'BYN',
  'CAD',
  'CDF',
  'CHF',
  'CLP',
  'CNY',
  'COP',
  'CRC',
  'CUP',
  'CZK',
  'DJF',
  'DKK',
  'DZD',
  'EGP',
  'ETB',
  'EUR',
  'GBP',
  'GEL',
  'GHS',
  'GMD',
  'GNF',
  'HKD',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'IQD',
  'ISK',
  'JOD',
  'JPY',
  'KES',
  'KGS',
  'KHR',
  'KRW',
  'KWD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MNT',
  'MUR',
  'MWK',
  'MXN',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PEN',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'RON',
  'RSD',
  'SAR',
  'SCR',
  'SDG',
  'SEK',
  'SGD',
  'SOS',
  'SRD',
  'SZL',
  'THB',
  'TJS',
  'TND',
  'TRY',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USD',
  'UYU',
  'UZS',
  'VND',
  'XAF',
  'XOF',
  'YER',
  'ZAR',
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_DETAILS = {
  AED: {
    name: 'UAE Dirham',
    number: '784',
    code: 'AED',
  },
  AFN: {
    name: 'Afghani',
    number: '971',
    code: 'AFN',
  },
  ALL: {
    name: 'Lek',
    number: '008',
    code: 'ALL',
  },
  AMD: {
    name: 'Armenian Dram',
    number: '051',
    code: 'AMD',
  },
  AOA: {
    name: 'Kwanza',
    number: '973',
    code: 'AOA',
  },
  ARS: {
    name: 'Argentine Peso',
    number: '032',
    code: 'ARS',
  },
  AUD: {
    name: 'Australian Dollar',
    number: '036',
    code: 'AUD',
  },
  AZN: {
    name: 'Azerbaijan Manat',
    number: '944',
    code: 'AZN',
  },
  BDT: {
    name: 'Taka',
    number: '050',
    code: 'BDT',
  },
  BGN: {
    name: 'Bulgarian Lev',
    number: '975',
    code: 'BGN',
  },
  BHD: {
    name: 'Bahraini Dinar',
    number: '048',
    code: 'BHD',
  },
  BIF: {
    name: 'Burundi Franc',
    number: '108',
    code: 'BIF',
  },
  BND: {
    name: 'Brunei Dollar',
    number: '096',
    code: 'BND',
  },
  BOB: {
    name: 'Boliviano',
    number: '068',
    code: 'BOB',
  },
  BRL: {
    name: 'Brazilian Real',
    number: '986',
    code: 'BRL',
  },
  BWP: {
    name: 'Pula',
    number: '072',
    code: 'BWP',
  },
  BYN: {
    name: 'Belarusian Ruble',
    number: '933',
    code: 'BYN',
  },
  CAD: {
    name: 'Canadian Dollar',
    number: '124',
    code: 'CAD',
  },
  CDF: {
    name: 'Congolese Franc',
    number: '976',
    code: 'CDF',
  },
  CHF: {
    name: 'Swiss Franc',
    number: '756',
    code: 'CHF',
  },
  CLP: {
    name: 'Chilean Peso',
    number: '152',
    code: 'CLP',
  },
  CNY: {
    name: 'Yuan Renminbi',
    number: '156',
    code: 'CNY',
  },
  COP: {
    name: 'Colombian Peso',
    number: '170',
    code: 'COP',
  },
  CRC: {
    name: 'Costa Rican Colon',
    number: '188',
    code: 'CRC',
  },
  CUP: {
    name: 'Cuban Peso',
    number: '192',
    code: 'CUP',
  },
  CZK: {
    name: 'Czech Koruna',
    number: '203',
    code: 'CZK',
  },
  DJF: {
    name: 'Djibouti Franc',
    number: '262',
    code: 'DJF',
  },
  DKK: {
    name: 'Danish Krone',
    number: '208',
    code: 'DKK',
  },
  DZD: {
    name: 'Algerian Dinar',
    number: '012',
    code: 'DZD',
  },
  EGP: {
    name: 'Egyptian Pound',
    number: '818',
    code: 'EGP',
  },
  ETB: {
    name: 'Ethiopian Birr',
    number: '230',
    code: 'ETB',
  },
  EUR: {
    name: 'Euro',
    number: '978',
    code: 'EUR',
  },
  GBP: {
    name: 'Pound Sterling',
    number: '826',
    code: 'GBP',
  },
  GEL: {
    name: 'Lari',
    number: '981',
    code: 'GEL',
  },
  GHS: {
    name: 'Ghana Cedi',
    number: '936',
    code: 'GHS',
  },
  GMD: {
    name: 'Dalasi',
    number: '270',
    code: 'GMD',
  },
  GNF: {
    name: 'Guinean Franc',
    number: '324',
    code: 'GNF',
  },
  HKD: {
    name: 'Hong Kong Dollar',
    number: '344',
    code: 'HKD',
  },
  HUF: {
    name: 'Forint',
    number: '348',
    code: 'HUF',
  },
  IDR: {
    name: 'Rupiah',
    number: '360',
    code: 'IDR',
  },
  ILS: {
    name: 'New Israeli Sheqel',
    number: '376',
    code: 'ILS',
  },
  INR: {
    name: 'Indian Rupee',
    number: '356',
    code: 'INR',
  },
  IQD: {
    name: 'Iraqi Dinar',
    number: '368',
    code: 'IQD',
  },
  ISK: {
    name: 'Iceland Krona',
    number: '352',
    code: 'ISK',
  },
  JOD: {
    name: 'Jordanian Dinar',
    number: '400',
    code: 'JOD',
  },
  JPY: {
    name: 'Yen',
    number: '392',
    code: 'JPY',
  },
  KES: {
    name: 'Kenyan Shilling',
    number: '404',
    code: 'KES',
  },
  KGS: {
    name: 'Som',
    number: '417',
    code: 'KGS',
  },
  KHR: {
    name: 'Riel',
    number: '116',
    code: 'KHR',
  },
  KRW: {
    name: 'Won',
    number: '410',
    code: 'KRW',
  },
  KWD: {
    name: 'Kuwaiti Dinar',
    number: '414',
    code: 'KWD',
  },
  KZT: {
    name: 'Tenge',
    number: '398',
    code: 'KZT',
  },
  LAK: {
    name: 'Lao Kip',
    number: '418',
    code: 'LAK',
  },
  LBP: {
    name: 'Lebanese Pound',
    number: '422',
    code: 'LBP',
  },
  LKR: {
    name: 'Sri Lanka Rupee',
    number: '144',
    code: 'LKR',
  },
  LYD: {
    name: 'Libyan Dinar',
    number: '434',
    code: 'LYD',
  },
  MAD: {
    name: 'Moroccan Dirham',
    number: '504',
    code: 'MAD',
  },
  MDL: {
    name: 'Moldovan Leu',
    number: '498',
    code: 'MDL',
  },
  MGA: {
    name: 'Malagasy Ariary',
    number: '969',
    code: 'MGA',
  },
  MKD: {
    name: 'Denar',
    number: '807',
    code: 'MKD',
  },
  MNT: {
    name: 'Tugrik',
    number: '496',
    code: 'MNT',
  },
  MUR: {
    name: 'Mauritius Rupee',
    number: '480',
    code: 'MUR',
  },
  MWK: {
    name: 'Malawi Kwacha',
    number: '454',
    code: 'MWK',
  },
  MXN: {
    name: 'Mexican Peso',
    number: '484',
    code: 'MXN',
  },
  MYR: {
    name: 'Malaysian Ringgit',
    number: '458',
    code: 'MYR',
  },
  MZN: {
    name: 'Mozambique Metical',
    number: '943',
    code: 'MZN',
  },
  NAD: {
    name: 'Namibia Dollar',
    number: '516',
    code: 'NAD',
  },
  NGN: {
    name: 'Naira',
    number: '566',
    code: 'NGN',
  },
  NIO: {
    name: 'Cordoba Oro',
    number: '558',
    code: 'NIO',
  },
  NOK: {
    name: 'Norwegian Krone',
    number: '578',
    code: 'NOK',
  },
  NPR: {
    name: 'Nepalese Rupee',
    number: '524',
    code: 'NPR',
  },
  NZD: {
    name: 'New Zealand Dollar',
    number: '554',
    code: 'NZD',
  },
  OMR: {
    name: 'Rial Omani',
    number: '512',
    code: 'OMR',
  },
  PEN: {
    name: 'Sol',
    number: '604',
    code: 'PEN',
  },
  PHP: {
    name: 'Philippine Peso',
    number: '608',
    code: 'PHP',
  },
  PKR: {
    name: 'Pakistan Rupee',
    number: '586',
    code: 'PKR',
  },
  PLN: {
    name: 'Zloty',
    number: '985',
    code: 'PLN',
  },
  PYG: {
    name: 'Guarani',
    number: '600',
    code: 'PYG',
  },
  QAR: {
    name: 'Qatari Rial',
    number: '634',
    code: 'QAR',
  },
  RON: {
    name: 'Romanian Leu',
    number: '946',
    code: 'RON',
  },
  RSD: {
    name: 'Serbian Dinar',
    number: '941',
    code: 'RSD',
  },
  SAR: {
    name: 'Saudi Riyal',
    number: '682',
    code: 'SAR',
  },
  SCR: {
    name: 'Seychelles Rupee',
    number: '690',
    code: 'SCR',
  },
  SDG: {
    name: 'Sudanese Pound',
    number: '938',
    code: 'SDG',
  },
  SEK: {
    name: 'Swedish Krona',
    number: '752',
    code: 'SEK',
  },
  SGD: {
    name: 'Singapore Dollar',
    number: '702',
    code: 'SGD',
  },
  SOS: {
    name: 'Somali Shilling',
    number: '706',
    code: 'SOS',
  },
  SRD: {
    name: 'Surinam Dollar',
    number: '968',
    code: 'SRD',
  },
  SZL: {
    name: 'Lilangeni',
    number: '748',
    code: 'SZL',
  },
  THB: {
    name: 'Baht',
    number: '764',
    code: 'THB',
  },
  TJS: {
    name: 'Somoni',
    number: '972',
    code: 'TJS',
  },
  TND: {
    name: 'Tunisian Dinar',
    number: '788',
    code: 'TND',
  },
  TRY: {
    name: 'Turkish Lira',
    number: '949',
    code: 'TRY',
  },
  TWD: {
    name: 'New Taiwan Dollar',
    number: '901',
    code: 'TWD',
  },
  TZS: {
    name: 'Tanzanian Shilling',
    number: '834',
    code: 'TZS',
  },
  UAH: {
    name: 'Hryvnia',
    number: '980',
    code: 'UAH',
  },
  UGX: {
    name: 'Uganda Shilling',
    number: '800',
    code: 'UGX',
  },
  USD: {
    name: 'US Dollar',
    number: '840',
    code: 'USD',
  },
  UYU: {
    name: 'Peso Uruguayo',
    number: '858',
    code: 'UYU',
  },
  UZS: {
    name: 'Uzbekistan Sum',
    number: '860',
    code: 'UZS',
  },
  VND: {
    name: 'Dong',
    number: '704',
    code: 'VND',
  },
  XAF: {
    name: 'CFA Franc BEAC',
    number: '950',
    code: 'XAF',
  },
  XOF: {
    name: 'CFA Franc BCEAO',
    number: '952',
    code: 'XOF',
  },
  YER: {
    name: 'Yemeni Rial',
    number: '886',
    code: 'YER',
  },
  ZAR: {
    name: 'Rand',
    number: '710',
    code: 'ZAR',
  },
};
