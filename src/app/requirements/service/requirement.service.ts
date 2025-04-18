import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Requirement, RequirementSearchDto } from '../model/requirement.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementService {
  requirementApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.REQUIREMENT_API;
  constructor(private http: HttpClient) {}

  getAllRequirements(): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(this.requirementApi + '/requirementList');
  }

  getRequirementById(requirementId: string): Observable<Requirement> {
    return this.http.get<Requirement>(this.requirementApi + '/getRequirement', { params: { requirementId: requirementId } });
  }

  saveRequirement(fileName: File, requirementData: Requirement): Observable<Requirement> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('requirementDto', JSON.stringify(requirementData));
    return this.http.post<Requirement>(this.requirementApi + '/saveRequirement', formData);
  }

  searchRequirement(searchcondition: RequirementSearchDto): Observable<Requirement[]> {
    return this.http.post<Requirement[]>(this.requirementApi + '/searchRequirement', searchcondition);
  }

  updateRequirement(fileName: File, requirementData: Requirement): Observable<Requirement> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('requirementDto', JSON.stringify(requirementData));
    return this.http.post<Requirement>(this.requirementApi + '/updateRequirement', formData);
  }
}
