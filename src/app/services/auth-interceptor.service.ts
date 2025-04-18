import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstants } from '../config/GlobalConstants';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();

    if (!request.url.includes('https://api.postalpincode.in/pincode') && !request.url.includes(GlobalConstants.OCR_IMAGE_URL) && token) {
      // If we have a token, we set it to the header
      let headerData = request.headers;
      headerData = headerData.append('Authorization', `Bearer ${token}`);
      request = request.clone({
        headers: headerData,
      });
    }

    return next.handle(request).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // redirect user to the logout page
            this.router.navigateByUrl('/login');
          }
        }
        return throwError(err);
      })
    );
  }
}
