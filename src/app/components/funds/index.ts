import { Component, EventEmitter, forwardRef, Input, Output, computed, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CryptoIcons, FlagNations } from '@constants';
import { StateService } from '@app/services/state';
import { Currency } from '@models';
import * as util from '@utils';

@Component({
  selector: 'app-funds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Funds),
      multi: true,
    },
  ],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Funds implements OnInit, OnChanges {
  @Input() label: string = 'Amount';
  @Input() currencies: Currency[] = [];
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() value: string = '';
  @Input() amount: number = 0;
  @Input() showFlags = false;
  @Output() currencyChange = new EventEmitter<string>();
  @Output() amountChange = new EventEmitter<number>();

  constructor(public stateService: StateService) {}

  // Internal model for two-way binding
  selectedCurrency: string = '';
  inputAmount: number = 0;

  // Computed properties to separate fiat and crypto
  fiatCurrencies = computed(() => {
    return this.currencies.filter((c) => !util.isCrypto(c.code));
  });

  cryptoCurrencies = computed(() => {
    return this.currencies.filter((c) => util.isCrypto(c.code));
  });

  hasFiatCurrencies = computed(() => this.fiatCurrencies().length > 0);
  hasCryptoCurrencies = computed(() => this.cryptoCurrencies().length > 0);

  ngOnInit(): void {
    // Initialize internal values from inputs
    this.selectedCurrency = this.value;
    this.inputAmount = this.amount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update internal values when inputs change
    if (changes['value'] && !changes['value'].firstChange) {
      this.selectedCurrency = this.value;
    }
    if (changes['amount'] && !changes['amount'].firstChange) {
      this.inputAmount = this.amount;
    }
  }

  onAmountChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.inputAmount = value;
    this.amountChange.emit(value);
  }

  onCurrencyChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCurrency = value;
    this.currencyChange.emit(value);
  }

  getSelectedCurrency(): Currency | undefined {
    return this.currencies.find((c) => c.code === this.value);
  }

  getSelectedIndex(): number | undefined {
    return this.currencies.findIndex((c) => c.code === this.value);
  }

  formatCurrencyHint(): string {
    const currency = this.getSelectedCurrency();
    if (!currency) return '';

    const formattedAmount = this.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: currency.precision || 2,
    });

    return `≈ ${formattedAmount} ${currency.name}`;
  }

  getFlagEmoji(currencyCode: string): string {
    // Map currency codes to country codes for flag emojis
    const currencyToCountry: { [key: string]: string } = FlagNations;
    const countryCode = currencyToCountry[currencyCode];
    if (!countryCode) return '';

    // Convert country code to flag emoji
    if (countryCode === 'EU') return '🇪🇺';

    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  getCryptoIcon(code: string): string {
    // Return crypto icons
    const cryptoIcons: { [key: string]: string } = CryptoIcons;
    return cryptoIcons[code] || '◆';
  }

  onChange = (value: any) => {};

  onTouched = () => {};

  writeValue(value: any): void {
    if (value && typeof value === 'object') {
      this.amount = value.amount || 0;
      this.selectedCurrency = value.currency || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private emitValue(): void {
    // Simplified value emission - would be more structured in prod
    this.onChange({
      amount: this.amount,
      currency: this.selectedCurrency,
    });
  }
}
