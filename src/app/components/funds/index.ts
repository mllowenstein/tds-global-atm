import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Currency } from '@app/data/models';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StateService } from '@app/services/state';

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
export class Funds {
  @Input() label: string = 'Amount';
  @Input() currencies: Currency[] = [];
  @Input() disabled = false;
  @Input() readonly = false;
  @Output() currencyChange = new EventEmitter<string>();

  amount = 0;
  selectedCurrency = '';

  constructor(public stateService: StateService) {}

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

  onAmountChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.amount = value;
    this.emitValue();
  }

  onCurrencyChange(event: Event): void {
    this.selectedCurrency = (event.target as HTMLSelectElement).value;
    this.currencyChange.emit(this.selectedCurrency);
    this.emitValue();
  }

  private emitValue(): void {
    // Simplified value emission - would be more structured in prod
    this.onChange({
      amount: this.amount,
      currency: this.selectedCurrency,
    });
  }
}
