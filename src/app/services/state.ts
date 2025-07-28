import { Injectable, signal, computed } from '@angular/core';
import { ExchangeState, InfoLevel } from '@models';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state = signal<ExchangeState>({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    fromFund: 100,
    toFund: 0,
    isLoading: false,
    error: null,
    mode: InfoLevel.Basic,
    withCrypto: false,
    history: [],
  });

  readonly currentState = this.state.asReadonly();

  // validation for the components prior to conversion
  readonly isValid = computed(() => {
    const s = this.state();
    return s.fromFund > 0 && s.fromCurrency && s.toCurrency;
  });

  readonly isAdvancedMode = computed(() => {
    return this.state().mode.toString() === 'advanced';
  });

  updateState(partial: Partial<ExchangeState>): void {
    this.state.update((current) => ({ ...current, ...partial }));
  }

  swapCurrencies(): void {
    this.state.update((current) => ({
      ...current,
      fromCurrency: current.toCurrency,
      toCurrency: current.fromCurrency,
      fromFund: current.toFund,
      toFund: current.fromFund,
    }));
  }

  setLoading(loading: boolean): void {
    this.updateState({ isLoading: loading });
  }

  setError(error: string | null): void {
    this.updateState({ error, isLoading: false });
  }

  toggleMode(): void {
    this.state.update((current) => ({
      ...current,
      mode:
        current.mode.valueOf() === 'basic'
          ? InfoLevel.Advanced
          : InfoLevel.Basic,
    }));
  }

  toggleCrypto(): void {
    this.state.update((current) => ({
      ...current,
      withCrypto: !current.withCrypto,
    }));
  }

  addToHistory(conversion: {
    from: string;
    to: string;
    fromFund: number;
    toFund: number;
  }): void {
    this.state.update((current) => ({
      ...current,
      conversionHistory: [
        { ...conversion, timestamp: new Date() },
        ...(current.history || []).slice(0, 9), // Keep last 10
      ],
      lastUpdated: new Date(),
    }));
  }
}

