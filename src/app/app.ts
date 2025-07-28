import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class App {
  protected title = 'TDS Global ATM';
}
