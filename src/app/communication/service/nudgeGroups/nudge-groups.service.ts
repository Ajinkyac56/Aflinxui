import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { nudgeGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { SuccessResponse } from 'src/app/models/success.response.model';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { MultipleNudgeUsers } from '../../model/nudgeGroupUsersMultiple';

@Injectable({
  providedIn: 'root',
})
export class NudgeGroupsService {
  NudgeGroupApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MESSAGE_GROUP_API;

  constructor(private http: HttpClient) {}

  getNudgeGroupById(messageGroupId: string) {
    const params = new HttpParams().set('messageGroupId', messageGroupId);
    return this.http.get(this.NudgeGroupApi + '/getMessageGroup', { params });
  }

  updateNudgeGroup(nudgeGroup: NudgeGroup): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.NudgeGroupApi + '/updateMessageGroup', nudgeGroup);
  }

  saveNudgeGroup(nudgeGroup: NudgeGroup): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.NudgeGroupApi + '/saveMessageGroup', nudgeGroup);
  }

  searchGroupList(SearchCondition: nudgeGroupSearchDto): Observable<NudgeGroup[]> {
    return this.http.post<NudgeGroup[]>(this.NudgeGroupApi + '/searchMessageGroup', SearchCondition);
  }

  deleteUserGroupList(messageGroupId: string, isDelete: number): Observable<any[]> {
    const params = new HttpParams().set('messageGroupId', messageGroupId).set('isDelete', isDelete);
    return this.http.post<any[]>(this.NudgeGroupApi + '/deleteMessageGroup', {}, { params });
  }
}
