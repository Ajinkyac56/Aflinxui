import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { EducationDto } from '../../model/education.model'; // Assuming you have an EducationDto model
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor(private http: HttpClient) {}

  educationApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.EDUCATION_API;

  getEducationByUserId(userId: string): Observable<EducationDto[]> {
    return this.http.get<EducationDto[]>(this.educationApi + '/getEducationByUserId', { params: { userId: userId } });
  }

  saveEducation(fileName: string, education: EducationDto): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('educationDto', JSON.stringify(education));

    return this.http.post<any>(this.educationApi + '/educationSaveApi', formData);
  }

  updateEducation(file: string, education: EducationDto): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('education', JSON.stringify(education));

    return this.http.post<any>(this.educationApi + '/educationUpdateApi', formData);
  }

  deleteEducation(educationid: string): Observable<any> {
    const params = new HttpParams().set('educationid', educationid);
    return this.http.post<any>(this.educationApi + '/educationDelete', {}, { params });
  }
}
