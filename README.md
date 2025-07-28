# TdsGlobalAtm

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Information

This solution was submitted for an assessment that was intended to take
approximately 2 hours to complete. Acknowledgement of the various improvements
that would be encouraged if this solution were to integrated with a production
application has been outlined below:

🏗️ Architecture

- State Management: Replace simple signals with NgRx or Akita
- Error Handling: Comprehensive error boundary and retry logic
- Type Safety: Strict TypeScript with exhaustive type checking
- Testing: Unit tests, integration tests, e2e tests
- Validation: Input validation with Angular validators

🎨 Design System

- Component Library: Reusable design system components
- Accessibility: WCAG 2.1 AA compliance, screen reader support
- Responsive: Mobile-first design with proper breakpoints
- Animations: Smooth transitions and micro-interactions
- Theming: Complete dark/light mode implementation

🔒 Security & Performance

- API Security: Backend proxy for API keys
- Caching: Sophisticated cache invalidation strategy
- Bundle Optimization: Code splitting and lazy loading
- PWA: Service worker for offline functionality
- SEO: Meta tags and structured data

🛠️ Developer Experience

- Linting: ESLint, Prettier, Stylelint configuration
- CI/CD: Automated testing and deployment pipeline
- Documentation: Comprehensive API documentation
- Monitoring: Error tracking and performance monitoring

🚀 Quick Setup

- Clone and install: npm install
- Add API key: Update env.ts with your CurrencyBeacon API key
- Run: npm run local
- Build: ng build --configuration production

💡 Trade-offs Made

✅ Functional MVP over perfect architecture
✅ Visual appeal over comprehensive accessibility
✅ Quick development over extensive testing
✅ Working solution over optimal performance
