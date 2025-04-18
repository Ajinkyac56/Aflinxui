import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Observable } from 'rxjs';
import { CertificationDto } from '../../model/certification.model';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  constructor(private http: HttpClient) {}

  certificationApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CERTIFICATION_API;

  getCertificationByUserId(userId: string): Observable<CertificationDto[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<CertificationDto[]>(this.certificationApi + '/getCertificate', { params });
  }

  saveCertification(fileName: string, certificate: CertificationDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('certificate', JSON.stringify(certificate));

    return this.http.post<any>(this.certificationApi + '/saveCertificate', formData);
  }

  updateCertification(fileName: string, certificate: CertificationDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('certificate', JSON.stringify(certificate));

    return this.http.post<any>(this.certificationApi + '/updateCertificate', formData);
  }

  deleteCertification(certificationId: string): Observable<any> {
    const params = new HttpParams().set('certificateId', certificationId);
    return this.http.post<any>(this.certificationApi + '/deleteCertificate', {}, { params });
  }
}
