import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SearchRequirementImpoart } from 'src/app/models/SearchCondition.model';
import { RequirementImport } from '../model/requirementImport.model';
import { UserRequirementModel } from '../model/userRequirement.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementImportService {
  requirementApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.REQUIREMENT_IMPORT_API;
  constructor(private http: HttpClient) {}

  searchViewImportRequirements(search: SearchRequirementImpoart): Observable<RequirementImport[]> {
    return this.http.post<RequirementImport[]>(this.requirementApi + '/searchReqImport', search);
  }
  getUserRequirements(userId: string): Observable<UserRequirementModel[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<UserRequirementModel[]>(this.requirementApi + '/userRequirementsList', { params });
  }
}
