import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Currency, ConversionResult, CurrencyApiResponse } from '@models';
import { env } from '@env/env';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private baseUrl = env.apiUrl;

  private currencyCache = signal<Currency[]>([]);
  private cacheTimestamp = 0;
  private CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor(private http: HttpClient) { }

  getCurrencies(type: string = 'fiat'): Observable<Currency[]> {
    // Simple cache check - in prod would be more sophisticated
    if (
      this.currencyCache().length > 0 &&
      Date.now() - this.cacheTimestamp < this.CACHE_DURATION
    ) {
      return of(this.currencyCache());
    }

    return this.http
      .get<CurrencyApiResponse>(`${this.baseUrl}/currencies?type=${type}`)
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
          this.currencyCache.set(currencies);
          this.cacheTimestamp = Date.now();
        }),
        catchError((error) => {
          console.error('Currency fetch failed:', error);
          // TODO: Better error handling in production
          return throwError(() => new Error('Failed to load currencies'));
        })
      );
  }

  convertCurrency(
    from: string,
    to: string,
    amount: number
  ): Observable<number> {
    // Basic validation - would be more comprehensive in prod
    if (!from || !to || amount <= 0) {
      return throwError(() => new Error('Invalid conversion parameters'));
    }

    return this.http
      .get<any>(`${this.baseUrl}/convert?from=${from}&to=${to}&amount=${amount.toString()}`)
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
