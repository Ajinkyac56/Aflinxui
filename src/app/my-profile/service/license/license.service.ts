import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { LicenseDto } from '../../model/license.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LicenseService {
  constructor(private http: HttpClient) {}

  licenseApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.LICENSE_API;

  getLicenses(userId: string): Observable<LicenseDto[]> {
    return this.http.get<LicenseDto[]>(this.licenseApi + '/getLicenseByUserId', { params: { userId: userId } });
  }

  saveLicense(fileName: string, license: LicenseDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('licenseDto', JSON.stringify(license));

    return this.http.post<any>(this.licenseApi + '/licenseSaveApi', formData);
  }

  updateLicense(file: string, license: LicenseDto): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('license', JSON.stringify(license));

    return this.http.post<any>(this.licenseApi + '/licenseUpdateApi', formData);
  }

  deleteLicense(licenseId: string): Observable<any> {
    const params = new HttpParams().set('licenseId', licenseId);
    return this.http.post<any>(this.licenseApi + '/licenseDelete', {}, { params });
  }
}
