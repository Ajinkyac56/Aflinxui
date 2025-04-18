import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { announcementSearchDto, announcementUserSearchDto } from 'src/app/models/SearchCondition.model';
import { messageDto } from 'src/app/my-message/model/messageDto.model';
import { Announcement, AnnouncementResponse } from '../../model/announcement.model';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  announcementApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MESSAGE_API;
  constructor(private http: HttpClient) {}

  searchAnnouncementList(SearchCondition: announcementSearchDto) {
    return this.http.post(this.announcementApi + '/messagesearchlist', SearchCondition);
  }

  searchUserGroupList(SearchCondition: announcementUserSearchDto): Observable<any[]> {
    return this.http.post<any[]>(this.announcementApi + '/messageusersearchlist', SearchCondition);
  }

  messageList(userId: string): Observable<messageDto[]> {
    return this.http.get<messageDto[]>(this.announcementApi + '/getMyMessageList', {
      params: { userId: userId },
    });
  }

  updateEvent(updateEvent: Announcement, msgId): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(this.announcementApi + '/updateMessageEvent', updateEvent, {
      params: {
        messageDetailId: msgId,
      },
    });
  }

  getResponseList(): Observable<AnnouncementResponse[]> {
    return this.http.get<AnnouncementResponse[]>(this.announcementApi + '/messagePollOptionList');
  }

  MessageUserList(msgUserid: string, userId: string): Observable<any[]> {
    const params = new HttpParams().set('messageUserId', msgUserid).set('userId', userId);
    return this.http.get<any[]>(this.announcementApi + '/messageUserlist', { params });
  }

  getResponsePercentange(messageDetailId: string): Observable<any[]> {
    const params = new HttpParams().set('messageDetailId', messageDetailId);
    return this.http.get<any[]>(this.announcementApi + '/responseList', { params });
  }

  updateViewStatus(messageDetailId: string, userId: string) {
    const params = new HttpParams().set('messageDetailId', messageDetailId).set('userId', userId);
    return this.http.put<any[]>(this.announcementApi + '/viewStatus', {}, { params });
  }
}
