// models/currency.model.ts
// Updated interfaces based on actual CurrencyBeacon API response

export interface CurrencyApiMeta {
  code: number;
  disclaimer: string;
}

export interface CurrencyApiItem {
  id: number;
  name: string;
  short_code: string;
  code: string;
  precision: number;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  decimal_mark: string;
  thousands_separator: string;
}

export interface CurrencyApiResponse {
  meta: CurrencyApiMeta;
  response: CurrencyApiItem[];
  // Note: API also returns numbered properties (0, 1, 2...) - we'll ignore these
  [key: string]: any; // For the numbered properties we don't need
}

// Simplified interface for our app usage
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  precision: number;
  symbolFirst: boolean;
  decimalMark: string;
  thousandsSeparator: string;
}

export interface ConversionResult {
  value: number;
  from: string;
  to: string;
  amount: number;
}

// Quick state interface - would use proper state management in prod
export interface ConverterState {
  fromCurrency: string;
  toCurrency: string;
  fromFund: number;
  toFund: number;
  isLoading: boolean;
  isConverting: boolean;
  error: string | null;
}

export enum InfoLevel {
  Advanced = 'advanced',
  Basic = 'basic',
}

export interface ExchangeState extends ConverterState {
  mode: InfoLevel;
  withCrypto: boolean;
  lastUpdated?: Date;
  history?: PreviousConversion[];
}

export interface PreviousConversion {
  fromFund: number;
  toFund: number;
  timestamp: Date;
  from: string;
  to: string;
}

export interface CurrencyCache {
  fiat: Currency[];
  fiatTimestamp: number;
}
