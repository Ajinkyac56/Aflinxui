import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { CommonResponse } from 'src/app/models/common-response.model';
import { OtpCommonData } from 'src/app/models/common/otp-common.model';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class EmailOtpService {
  sendOtpEmailAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.EMAIL_OTP;
  VerifyEmailOtpAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.EMAIL_OTP_VERIFY;
  sendCommonOtpAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.COMMON_OTP;
  verifyCommonOtpAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.COMMON_OTP_VERIFY;
  constructor(private http: HttpClient) {}
  sentEmailToOtp(email: string, userName: string): Observable<SuccessResponse> {
    return this.http.get<SuccessResponse>(this.sendOtpEmailAPI + '?email=' + email + '&userName=' + userName);
  }
  verifyEmailToOtp(email: string, otp: string): Observable<CommonResponse> {
    return this.http.get<CommonResponse>(this.VerifyEmailOtpAPI + '?email=' + email + '&otp=' + otp);
  }

  sentCommonToOtp(otpData: OtpCommonData): Observable<SuccessResponse> {
    let params = new URLSearchParams();
    for (let key in otpData) {
      if (otpData[key]) {
        params.set(key, otpData[key]);
      }
    }
    return this.http.get<SuccessResponse>(this.sendCommonOtpAPI + '?' + params.toString());
  }
  verifyCommonToOtp(otpData: OtpCommonData): Observable<CommonResponse> {
    let params = new URLSearchParams();
    for (let key in otpData) {
      if (otpData[key]) {
        params.set(key, otpData[key]);
      }
    }
    return this.http.get<CommonResponse>(this.verifyCommonOtpAPI + '?' + params.toString());
  }
}
