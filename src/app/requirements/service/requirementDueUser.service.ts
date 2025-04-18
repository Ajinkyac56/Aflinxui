import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { RequirementDueUser } from '../model/requirementDueUser.model';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementDueUserService {
  requirementApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.REQUIREMENT_DUE_USER_API;
  constructor(private http: HttpClient) {}

  saveRequirementsDueUser(requirementDueUser: RequirementDueUser[]): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.requirementApi + '/saveReqDueUser', requirementDueUser);
  }
}
