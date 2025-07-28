import { HttpHeaders } from '@angular/common/http';
import { env } from '@env/env';

export const requestInterceptor = (req: any, next: any) => {
  if (req.url.includes('currencybeacon.com')) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${env.apiKey}`),
    });
  }
  return next(req);
};
