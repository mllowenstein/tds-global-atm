import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [class.small]="size === 'small'">
      <div class="spinner"></div>
      <span class="spinner-text" *ngIf="message">{{ message }}</span>
    </div>
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f4f6;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .small .spinner {
        width: 20px;
        height: 20px;
        border-width: 2px;
      }

      .spinner-text {
        color: #6b7280;
        font-size: 0.875rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class Loader {
  @Input() size: 'normal' | 'small' = 'normal';
  @Input() message = '';
}
