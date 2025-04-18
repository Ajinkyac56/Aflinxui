import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { MasterSelectType } from 'src/app/models/master.select-type.model';

@Injectable({
  providedIn: 'root',
})
export class MasterSelectTypeService {
  masterSelectApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MASTER_SELECT_API;
  masterSelectNoAUthApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.MASTER_SELECT_NO_AUTH_API;

  constructor(private http: HttpClient) {}
  getAllMasterSelectByType(type: string): Observable<MasterSelectType[]> {
    return this.http.get<MasterSelectType[]>(this.masterSelectApi + '/' + type);
  }
  getAllMasterSelectByTypeNoAuth(type: string): Observable<MasterSelectType[]> {
    return this.http.get<MasterSelectType[]>(this.masterSelectNoAUthApi + '/' + type);
  }
}
