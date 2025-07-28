
import { Component, Input, signal, computed, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@services/state';
import { Currency } from '@models';
import * as util from '@utils';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Toolbar {
  @Input() currencies: Currency[] = [];
  @Output() withCrypto = new EventEmitter<void>();
  @Output() switchMode = new EventEmitter<void>();

  constructor(public stateService: StateService) {}

  // Computed properties to separate fiat and crypto
  fiatCurrencies = computed(() => {
    return this.currencies.filter((c) => !util.isCrypto(c.code));
  });

  cryptoCurrencies = computed(() => {
    return this.currencies.filter((c) => util.isCrypto(c.code));
  });

  onToggleMode(): void {
    this.stateService.toggleMode();
    this.switchMode.emit();
  }

  onToggleCrypto(): void {
    this.stateService.toggleCrypto();

    // Check if we need to load crypto currencies
    if (
      this.stateService.currentState().withCrypto &&
      this.cryptoCurrencies().length === 0
    ) {
      console.log('Emitting request for crypto currencies...');
      this.withCrypto.emit();
    }

    // Reset to fiat currencies if current selection is crypto and we're disabling crypto
    const state = this.stateService.currentState();
    if (!state.withCrypto) {
      const isCrypto = (code: string) =>
        this.cryptoCurrencies().some((c) => c.code === code);

      if (isCrypto(state.fromCurrency)) {
        this.stateService.updateState({ fromCurrency: 'USD' });
      }
      if (isCrypto(state.toCurrency)) {
        this.stateService.updateState({ toCurrency: 'EUR' });
      }
    }
  }
}
