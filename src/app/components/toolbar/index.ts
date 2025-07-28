
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
  @Output() switchMode = new EventEmitter<void>();

  constructor(public stateService: StateService) {}

  // Computed properties to separate fiat and crypto
  fiatCurrencies = computed(() => {
    return this.currencies.filter((c) => !util.isCrypto(c.code));
  });

  onToggleMode(): void {
    this.stateService.toggleMode();
    this.switchMode.emit();
  }
}
