# TdsGlobalAtm

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

## Development server

To start a local development server, run:

```bash
git clone https://github.com/mllowenstein/tds-global-atm
cd tds-global-atm
npm install
npm run local
```

Once the server is running, open your browser and navigate to `https://localhost:4200/`.
The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
npm run build # local build
npm run build:prod # production build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Additional Information

This solution was submitted for an assessment that was intended to take
approximately 2 hours to complete. Acknowledgement of the various improvements
that would be encouraged if this solution were to integrated with a production
application has been outlined below:

Architecture

- State Management: Replace simple signals with NgRx or Akita
- Error Handling: Comprehensive error boundary and retry logic
- Type Safety: Strict TypeScript with exhaustive type checking
- Testing: Unit tests, integration tests, e2e tests meaningfully configured (CI/CD?)
- Validation: Input validation with Angular validators

Design System

- Component Library: Reusable design system components
- Responsive: Mobile-first design with proper breakpoints
- Animations: Smooth transitions and micro-interactions

Security & Performance

- SSL Keys would not be included with version control
- API Security: Backend proxy for API keys
- Caching: Sophisticated cache invalidation strategy
- Bundle Optimization: Code splitting and lazy loading
- PWA: Service worker for offline functionality
- SEO: Meta tags and structured data

Developer Experience

- Linting: ESLint, Prettier, Stylelint configuration
- CI/CD: Automated testing and deployment pipeline
- Documentation: Comprehensive API documentation
- Monitoring: Error tracking and performance monitoring

Quick Setup

- Clone and install: npm install
- Add API key: Update env.ts with your CurrencyBeacon API key
- Run: npm run local
- Build: ng build --configuration production

Trade-offs Made

- Functional MVP over perfect architecture
- Visual appeal over comprehensive accessibility
- Working solution over optimal performance
- Quick development over extensive testing

Final Note

- I admittedly ended up take 2 hr and 35 min to submit;
- My apologies, but I could not let the last issue I was stuck on go;
- By introducing a simplified cache mechanism, I was unable to return the additional currencies in 'Advanced Mode';
- This was until I realized that a cache-buster was required when switching exchange modes;
- Fun assessment, thank you for the opportunity;
- Best,
- Michael Lowenstein
