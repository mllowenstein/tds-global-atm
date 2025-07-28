import { Injectable, signal, computed } from '@angular/core';
import { ConverterState } from '@models';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state = signal<ConverterState>({
    fromCurrency: 'USD',
    toCurrency: 'USD',
    fromFund: 1,
    toFund: 0,
    isLoading: false,
    error: null,
  });

  readonly currentState = this.state.asReadonly();
  // validation for the components prior to conversion
  readonly isValid = computed(() => {
    const s = this.state();
    return s.fromFund > 0 && s.fromCurrency && s.toCurrency;
  });

  updateState(partial: Partial<ConverterState>): void {
    this.state.update(current => ({ ...current, ...partial }));
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
}

