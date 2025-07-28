import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { Currency } from '@models';
import { CurrencyService } from '@app/services/currency';
import { StateService } from '@app/services/state';
import { Loader } from '@components/loader';
import { Funds } from '@components/funds';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader, Funds],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Converter implements OnInit, OnDestroy {
  subtitle: string = 'Convert currencies with real-time rates';
  title: string = 'TDS Currency Exchange';
  currencies = signal<Currency[]>([]);
  isLoadingCurrencies = signal(false);

  private destroy$ = new Subject<void>();
  private conversion$ = new Subject<void>();

  constructor(
    public currencyService: CurrencyService,
    public stateService: StateService
  ) {}

  ngOnInit(): void {
    this.loadCurrencies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrencies(): void {
    this.isLoadingCurrencies.set(true);

    this.currencyService
      .getCurrencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currencies) => {
          console.log(currencies);
          this.currencies.set(currencies);
          this.isLoadingCurrencies.set(false);

          // Set sensible defaults
          this.setDefaultCurrencies(currencies);
        },
        error: (error) => {
          console.error('Failed to load currencies:', error);
          this.isLoadingCurrencies.set(false);
        },
      });
  }

  private setDefaultCurrencies(currencies: Currency[]): void {
    const state = this.stateService.currentState();
    if (!state.fromCurrency || !state.toCurrency) {
      this.stateService.updateState({
        fromCurrency:
          currencies.find((c) => c.code === 'USD')?.code ||
          currencies[0]?.code ||
          '',
        toCurrency:
          currencies.find((c) => c.code === 'EUR')?.code ||
          currencies[1]?.code ||
          '',
      });
    }
  }

  // Simple, explicit actions - no hidden complexity
  onFromAmountChange(evt: any): void {
    this.stateService.updateState({ fromFund: evt.target.value });
  }

  onFromCurrencyChange(evt: any): void {
    this.stateService.updateState({ fromCurrency: evt.target.value });
  }

  onToCurrencyChange(evt: any): void {
    this.stateService.updateState({ toCurrency: evt.target.value });
  }

  onSwapCurrencies(): void {
    this.stateService.swapCurrencies();
  }

  // The main action - clean and explicit
  onConvert(): void {
    const state = this.stateService.currentState();

    // Quick validation
    if (!state.fromCurrency || !state.toCurrency || state.fromFund <= 0) {
      this.stateService.setError(
        'Please enter a valid amount and select currencies'
      );
      return;
    }

    this.stateService.setLoading(true);
    this.stateService.setError(null);

    this.currencyService
      .convertCurrency(state.fromCurrency, state.toCurrency, state.fromFund)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (convertedAmount) => {
          this.stateService.updateState({
            toFund: convertedAmount,
            isLoading: false,
            error: null,
          });
        },
        error: (error) => {
          this.stateService.setError('Conversion failed. Please try again.');
        },
      });
  }

  onRetry(): void {
    this.stateService.setError(null);
    this.onConvert();
  }

  // Helper to get currency object for formatting
  getCurrency(code: string): Currency | undefined {
    return this.currencies().find((c) => c.code === code);
  }
}
