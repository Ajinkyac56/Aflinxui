import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private jwtHelper: JwtHelperService) {}
  isLoggedIn() {
    return !!localStorage.getItem('aflinxAuthToken') && !this.jwtHelper.isTokenExpired(localStorage.getItem('aflinxAuthToken'));
  }
  setAflinxToken(aflinxAuthToken: any) {
    localStorage.setItem('aflinxAuthToken', aflinxAuthToken);
  }
  isAflinxTokenExpired() {
    return this.jwtHelper.isTokenExpired(localStorage.getItem('aflinxAuthToken'));
  }
  getTokenExpireDate(): any {
    const token = localStorage.getItem('aflinxAuthToken')?.toString();
    if (token) {
      return this.jwtHelper.getTokenExpirationDate(token);
    }
    return null;
  }
  logout() {
    localStorage.removeItem('aflinxAuthToken');
    localStorage.clear();
  }
}
