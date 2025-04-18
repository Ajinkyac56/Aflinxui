import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { nudgeUserGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { MultipleNudgeUsers } from '../../model/nudgeGroupUsersMultiple';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class NudgeUserGroupsService {
  NudgeUserGroup = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MESSAGE_GROUP_USER_API;

  constructor(private http: HttpClient) {}

  searchUserGroupList(SearchCondition: nudgeUserGroupSearchDto): Observable<any[]> {
    return this.http.post<any[]>(this.NudgeUserGroup + '/getMessageGroupUserList', SearchCondition);
  }

  deleteUserGroupList(groupUserId: string, isDelete: number): Observable<any[]> {
    const params = new HttpParams().set('groupUserId', groupUserId).set('isDelete', isDelete);
    return this.http.post<any[]>(this.NudgeUserGroup + '/deleteMessageGroupUser', {}, { params });
  }

  saveNudgeGroupUsers(nudgeUsers: MultipleNudgeUsers): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.NudgeUserGroup + '/saveMessageGroupUser', nudgeUsers);
  }
}
