import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { workDto } from '../../model/work.model';
import { Observable } from 'rxjs';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class WorkService {
  constructor(private http: HttpClient) {}

  workApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.WORK_API;

  getWork(userId: string) {
    return this.http.get<workDto[]>(this.workApi + '/getWorkExperience/', { params: { userId: userId } });
  }

  saveWork(fileName: string, work: workDto): Observable<any> {
    const formDt = new FormData();
    formDt.append('fileName', fileName);
    formDt.append('workDto', JSON.stringify(work));

    return this.http.post<any>(this.workApi + '/saveWorkExperience', formDt);
  }

  updateWork(fileName: string, work: workDto): Observable<any> {
    const formDt = new FormData();
    formDt.append('fileName', fileName);
    formDt.append('work', JSON.stringify(work));

    return this.http.post<any>(this.workApi + '/updateWorkExperience', formDt);
  }

  deleteWork(workId: string): Observable<SuccessResponse> {
    const params = new HttpParams().set('workId', workId);
    return this.http.post<SuccessResponse>(this.workApi + '/deleteWorkExperience', {}, { params });
  }
}
