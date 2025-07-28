import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { Currency } from '@models';
import { CurrencyService } from '@app/services/currency';
import { StateService } from '@app/services/state';
import { Loader } from '@components/loader';
import { Funds } from '@components/funds';
import { Toolbar } from '@components/toolbar';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader, Funds, Toolbar],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Converter implements OnInit, OnDestroy {
  subtitle: string = 'Convert currencies with real-time rates';
  title: string = 'TDS Currency Exchange';
  showBanner = false;

  fiatCurrencies = signal<Currency[]>([]);
  cryptoCurrencies = signal<Currency[]>([]);
  isLoadingCurrencies = signal(false);
  isConvertingCurrencies = signal(false);

  // computed signal for filtered currencies based on mode and crypto toggle
  filteredCurrencies = computed(() => {
    const fiat = this.fiatCurrencies();
    const crypto = this.cryptoCurrencies();
    const withCrypto = this.stateService.currentState().withCrypto;

    if (withCrypto) {
      return [...fiat, ...crypto];
    }
    return fiat;
  });

  private destroy$ = new Subject<void>();
  private conversion$ = new Subject<void>();

  constructor(
    public currencyService: CurrencyService,
    public stateService: StateService
  ) {}

  ngOnInit(): void {
    this.loadCurrencies();
    this.setupAutoConversion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCurrencies(): void {
    this.isLoadingCurrencies.set(true);
    this.isConvertingCurrencies.set(false);

    this.currencyService
      .getCurrencies('fiat')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currencies) => {
          console.log('Fiat Currencies:', currencies);
          this.fiatCurrencies.set(currencies);
          this.setDefaultCurrencies(currencies); // for demo -> USD -> EUR
          this.isLoadingCurrencies.set(false);
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
      const usd = currencies.find((c) => c.code === 'USD');
      const eur = currencies.find((c) => c.code === 'EUR');
      this.stateService.updateState({
        fromCurrency: usd?.code || currencies[0]?.code || '',
        toCurrency: eur?.code || currencies[1]?.code || '',
      });
    }
  }

  private setupAutoConversion(): void {
    // Auto-convert on amount change and only
    // connect the loop in advanced mode
    this.conversion$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        if (
          this.stateService.isAdvancedMode() &&
          this.stateService.currentState().fromFund > 0
        ) {
          this.onConvert();
        }
      });
  }

  onSwitchMode(): void {
    console.log('Switch Exchange Mode...');
    // Re-setup auto conversion when switching modes
    this.setupAutoConversion();
  }

  onFromFundChange(amount: number): void {
    this.stateService.updateState({ fromFund: amount });
    if (this.stateService.isAdvancedMode()) {
      this.conversion$.next();
    }
  }

  onFromCurrencyChange(currency: string): void {
    this.stateService.updateState({ fromCurrency: currency });
    if (
      this.stateService.isAdvancedMode() &&
      this.stateService.currentState().fromFund > 0
    ) {
      this.conversion$.next();
    }
  }

  onToCurrencyChange(currency: string): void {
    this.stateService.updateState({ toCurrency: currency });
    if (
      this.stateService.isAdvancedMode() &&
      this.stateService.currentState().fromFund > 0
    ) {
      this.conversion$.next();
    }
  }

  onSwapCurrencies(): void {
    this.stateService.swapCurrencies();
    if (
      this.stateService.isAdvancedMode() &&
      this.stateService.currentState().fromFund > 0
    ) {
      this.conversion$.next();
    }
  }

  onConvert(): void {
    const state = this.stateService.currentState();

    // ad-hoc basic validation
    if (!state.fromCurrency || !state.toCurrency || state.fromFund <= 0) {
      this.stateService.setError(
        'Please enter a valid amount and select currencies'
      );
      return;
    }
    this.stateService.setConverting(true);
    this.isConvertingCurrencies.set(true);
    this.isLoadingCurrencies.set(false);
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

          // Add to history in advanced mode
          if (this.stateService.isAdvancedMode()) {
            this.stateService.addToHistory({
              from: state.fromCurrency,
              to: state.toCurrency,
              fromFund: state.fromFund,
              toFund: convertedAmount,
            });
            this.stateService.setConverting(false);
          }
          this.stateService.setConverting(false);
        },
        error: (error: any) => {
          this.stateService.setError(`Conversion failed: ${error.message}`);
          this.stateService.setConverting(false);
        },
      });
  }

  onRetry(): void {
    this.stateService.setError(null);
    this.onConvert();
  }

  formatTimestamp(date: Date | undefined): string {
    if (!date) return '';

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  // Helper to get currency object for formatting
  getCurrency(code: string): Currency | undefined {
    return this.filteredCurrencies().find((c) => c.code === code);
  }
}
