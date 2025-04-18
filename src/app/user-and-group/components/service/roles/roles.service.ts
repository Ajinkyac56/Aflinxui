import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from 'src/app/manage-permission/model/role.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { rolesSearchDto } from 'src/app/models/SearchCondition.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiUrl = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/role/getRole`);
  }

  getRoleById(roleId: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/role/getRoleById`, {
      params: new HttpParams().set('roleId', roleId),
    });
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/role/saveRole`, role);
  }

  updateRole(roleId: string, role: Role): Observable<Role> {
    const params = new HttpParams().set('roleId', roleId); // Set roleId as query parameter
    return this.http.put<Role>(`${this.apiUrl}/role/updateRole`, role, { params });
  }

  deleteRole(roleId: string, isDelete: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/role/deleteRole`, null, {
      params: new HttpParams().set('roleId', roleId).set('isDelete', isDelete.toString()),
    });
  }

  searchRole(searchCondition: rolesSearchDto): Observable<Role> {
    return this.http.post<Role>(this.apiUrl + '/role/rolesearch', searchCondition);
  }
}
