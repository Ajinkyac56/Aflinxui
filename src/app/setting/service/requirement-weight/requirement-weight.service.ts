import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { RequirementWeight } from '../../models/requirementWeight.model';
import { Observable } from 'rxjs';
import { ReqWeightSearchDto } from 'src/app/models/SearchCondition.model';

@Injectable({
  providedIn: 'root',
})
export class RequirementWeightService {
  constructor(private http: HttpClient) {}

  requirementWeightApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.REQUIREMENT_WEIGHT_API;

  getAllReqWeight() {
    return this.http.get<RequirementWeight[]>(this.requirementWeightApi + '/requirementWeightList');
  }

  getreqWeightById(weightId: string): Observable<RequirementWeight> {
    return this.http.get<RequirementWeight>(this.requirementWeightApi + '/getRequirementWeight', { params: { weightId: weightId } });
  }

  saveReqWeight(requirementWeight: RequirementWeight): Observable<RequirementWeight> {
    return this.http.post<RequirementWeight>(this.requirementWeightApi + '/saveRequirementWeight', requirementWeight);
  }

  updateReqWeight(requirementWeight: RequirementWeight): Observable<RequirementWeight> {
    return this.http.post<RequirementWeight>(this.requirementWeightApi + '/updateRequirementWeight', requirementWeight);
  }

  deleteReqWeight(weightId: string, isDelete: boolean): Observable<RequirementWeight> {
    return this.http.post<RequirementWeight>(this.requirementWeightApi + '/deleteRequirementWeight', {
      params: { weightId: weightId, isDelete: isDelete },
    });
  }

  searchReqWeight(searchCondition: ReqWeightSearchDto): Observable<RequirementWeight[]> {
    return this.http.post<RequirementWeight[]>(this.requirementWeightApi + '/searchRequirementWeight', searchCondition);
  }
}
