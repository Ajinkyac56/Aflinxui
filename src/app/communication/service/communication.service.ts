import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { NudgeGroup } from '../model/nudgeGroup.model';
import { SuccessResponse } from 'src/app/models/success.response.model';
import { Announcement } from '../model/announcement.model';
import { nudgeGroupSearchDto, nudgeUserGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { RequirementModel } from '../model/requirement.model';
import { Slots } from 'src/app/scheduling/model/slots.model';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  NudgeUserGroup = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MESSAGE_GROUP_USER_API;
  AnnouncemntApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MESSAGE_API;
  GetRequirementList = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.REQUIREMENT_API;
  GetSlot = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SLOTS_API;

  constructor(private http: HttpClient) {}

  saveAnnouncement(announcement: Announcement): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.AnnouncemntApi + '/saveMessage', announcement);
  }
  getSlotById(requirementId: string): Observable<Slots[]> {
    return this.http.get<Slots[]>(this.GetSlot + '/getSlotsByReqId', {
      params: { requirementId: requirementId },
    });
  }
}
