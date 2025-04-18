import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../login/models/AuthModel';
import { GlobalConstants } from '../config/GlobalConstants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authURL = GlobalConstants.API_SERVER_URL + GlobalConstants.AUTH_API;
  resetPasswordReuqestAPI =
    GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.USER_API + GlobalConstants.REQUEST_RESET_PWD_API;
  resetPasswordAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.RESET_PWD_API;
  forgotPAssword = GlobalConstants.API_SERVER_URL + GlobalConstants.FORGET_PWD;
  resetAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DELETEAPI;
  createAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CREATEAPI;
  constructor(private http: HttpClient) {}
  getAuthToken(): any {
    return localStorage.getItem('aflinxAuthToken')?.toString();
  }
  authenticate(authModal: AuthModel): Observable<any> {
    return this.http.post<any>(this.authURL, authModal);
  }
  resetPasswordRequest(userIds: string[], partnerIds: string[]): Observable<any> {
    return this.http.get<any>(this.resetPasswordReuqestAPI + '?userIds=' + userIds.join(',') + '&partnerIds=' + partnerIds.join(','));
  }
  resetPassword(q: string, p1: string, p2: string): Observable<any> {
    let formData = new FormData();
    formData.append('q', q);
    formData.append('p1', p1);
    formData.append('p2', p2);
    return this.http.post<any>(this.resetPasswordAPI, formData);
  }
  sendForgetPassword(email: string): Observable<any> {
    const url = `${this.forgotPAssword}username=&email=${email}&`;
    return this.http.get(url);
  }

  resetData() {
    return this.http.delete(this.resetAPI + '/deleteRecord');
  }

  createData() {
    return this.http.post(this.createAPI + '/saveDummyRecord', {});
  }
}
