import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SearchDataLoader, searchViewAlphaRostar } from 'src/app/models/SearchCondition.model';
import { DataFiles } from '../model/dataFiles.model';
import { UserImport } from '../model/userImport.model';

@Injectable({
  providedIn: 'root',
})
export class DataLoaderService {
  Api = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DATA_FILES_API;
  userApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.USERS_IMPORT_API;
  requirementApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.REQUIREMENT_IMPORT_API;
  constructor(private http: HttpClient) {}

  searchDataFile(searchAlphaRoster: SearchDataLoader): Observable<DataFiles[]> {
    return this.http.post<DataFiles[]>(this.Api + '/searchDataFiles', searchAlphaRoster);
  }
  searchViewImportUser(search: searchViewAlphaRostar): Observable<UserImport[]> {
    return this.http.post<UserImport[]>(this.userApi + '/searchUsersList', search);
  }
}
