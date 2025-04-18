import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { DesignationDto } from '../../model/designationLetter.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignationLetterService {
  constructor(private http: HttpClient) {}

  designationApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DESIGNATION_API;

  getDesignationByUserId(userId: string): Observable<DesignationDto[]> {
    return this.http.get<DesignationDto[]>(this.designationApi + '/getDesignationByUserId', { params: { userId: userId } });
  }

  saveDesignation(fileName: string, designationDto: DesignationDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('designationDto', JSON.stringify(designationDto));

    return this.http.post<any>(this.designationApi + '/designationSaveApi', formData);
  }

  updateDesignation(file: string, designation: DesignationDto): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('designation', JSON.stringify(designation));

    return this.http.post<any>(this.designationApi + '/designationUpdateApi', formData);
  }

  deleteDesignation(designationId: string): Observable<any> {
    const params = new HttpParams().set('designationId', designationId);
    return this.http.post<any>(this.designationApi + '/designationDelete', {}, { params });
  }
}
