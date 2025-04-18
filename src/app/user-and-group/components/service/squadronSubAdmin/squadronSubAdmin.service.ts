import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SquadronSubAdmin } from 'src/app/user-and-group/models/squadronSubAdmin.model';
import { SquadronSubAdminSearchDto } from 'src/app/models/SearchCondition.model';
import { SuccessResponse } from 'src/app/models/success.response.model';
import { SquadronAddSubAdmin } from 'src/app/user-and-group/models/squadronAddSubAdmin.model';

@Injectable({
  providedIn: 'root',
})
export class SquadronSubAdminService {
  private squadronSubAdminApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SQUADRON_SUBADMIN_API;
  constructor(private http: HttpClient) {}

  getSubAdmins(id: string): Observable<SquadronSubAdmin[]> {
    return this.http.get<SquadronSubAdmin[]>(this.squadronSubAdminApi + '/getSquadronSubAdmin');
  }

  searchSqauadronSubAdmin(SearchCondition: SquadronSubAdminSearchDto): Observable<any[]> {
    return this.http.post<any[]>(this.squadronSubAdminApi + '/getSquadronSubAdminList', SearchCondition);
  }

  saveDeptSubAdmin(squadronSubAdmin: SquadronAddSubAdmin): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.squadronSubAdminApi + '/saveSquadronSubAdmin', squadronSubAdmin);
  }

  deleteSquadronSubAdmin(squadronId: string, subAdminId: string, isDelete: number): Observable<void> {
    return this.http.post<void>(this.squadronSubAdminApi + '/deleteSquadronSubAdmin', null, {
      params: new HttpParams().set('squadronId', squadronId).set('subAdminId', subAdminId).set('isDelete', isDelete),
    });
  }
}
