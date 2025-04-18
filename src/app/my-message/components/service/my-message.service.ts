import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from 'src/app/communication/model/announcement.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class MyMessageService {
  myMessageApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MESSAGE_API;
  constructor(private http: HttpClient) {}

  getMessage(id: string, messageType: string, userId: string): Observable<Announcement[]> {
    const params = new HttpParams().set('id', id).set('messageType', messageType).set('userId', userId);

    return this.http.get<Announcement[]>(this.myMessageApi + '/getMessagebyMesssageType', { params });
  }

  submitPollFeedback(data: any): Observable<SuccessResponse> {
    return this.http.patch<SuccessResponse>(this.myMessageApi + '/patchUserResponse', data);
  }
}
