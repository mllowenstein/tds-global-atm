import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Currency, ConversionResult, CurrencyApiResponse, CurrencyCache } from '@models';
import { env } from '@env/env';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private baseUrl = env.apiUrl;

  private cache: CurrencyCache = {
    fiat: [],
    fiatTimestamp: 0,
  };

  private currencyCache = signal<Currency[]>([]);
  private cacheTimestamp = 0;
  private CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor(private http: HttpClient) {}

  getCurrencies(type?: string): Observable<Currency[]> {
    // Check cache based on type
    const isCacheValid =
      this.cache.fiat.length > 0 &&
      Date.now() - this.cache.fiatTimestamp < this.CACHE_DURATION;

    if (isCacheValid) {
      console.log(`Returning cached ${type} currencies`);
      return of(this.cache.fiat);
    }

    console.log('this should log any mode switch...')

    const typeParam = `type=${type ? type : 'fiat'}`;
    return this.http
      .get<CurrencyApiResponse>(`${this.baseUrl}/currencies?${typeParam}`)
      .pipe(
        map((response) => {
          // Transform API response to our internal Currency interface
          return response.response.map((currency) => ({
            code: currency.short_code,
            name: currency.name,
            symbol: currency.symbol,
            precision: currency.precision,
            symbolFirst: currency.symbol_first,
            decimalMark: currency.decimal_mark,
            thousandsSeparator: currency.thousands_separator,
          }));
        }),
        tap((currencies) => {
          // Cache based on type
          this.cache.fiat = currencies;
          this.cache.fiatTimestamp = Date.now();
          console.log(`Cached ${currencies.length} ${type} currencies`);
        }),
        catchError((error) => {
          console.error('Currency fetch failed:', error);
          // TODO: Better error handling in production
          return throwError(() => new Error('Failed to load currencies'));
        })
      );
  }

  // Clear cache when needed (useful for debugging or forcing refresh)
  clearCache(type?: 'fiat' | 'crypto'): void {
    if (type === 'fiat') {
      this.cache.fiat = [];
      this.cache.fiatTimestamp = 0;
    } else {
      // Clear both
      this.cache = {
        fiat: [],
        fiatTimestamp: 0,
      };
    }
  }

  convertCurrency(
    from: string,
    to: string,
    amount: number
  ): Observable<number> {
    // Basic validation
    if (!from || !to || amount <= 0) {
      return throwError(() => new Error('Invalid conversion parameters'));
    }

    return this.http
      .get<any>(
        `${
          this.baseUrl
        }/convert?from=${from}&to=${to}&amount=${amount.toString()}`
      )
      .pipe(
        map((response) => response.value || 0),
        catchError((error) => {
          console.error('Conversion failed:', error);
          return throwError(() => new Error('Conversion failed'));
        })
      );
  }

  // specific utility with proper formatting based on currency precision
  formatCurrency(amount: number, currency: Currency): string {
    const formattedAmount = amount.toFixed(currency.precision);

    // Apply thousands separator and decimal mark formatting
    // This is a simplified version - in production would use proper i18n formatting
    if (currency.symbolFirst) {
      return `${currency.symbol}${formattedAmount}`;
    } else {
      return `${formattedAmount} ${currency.symbol}`;
    }
  }

  // generic fallback utility
  currencyFormat(amount: number, currencyCode: string): string {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}
