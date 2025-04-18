import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { FeatureGroup } from 'src/app/manage-permission/model/feature-group.model';
import { Role } from 'src/app/manage-permission/model/role.model';
import { UserPermissionResponse } from 'src/app/manage-permission/model/user-permission-response.model';
import { UserPermission } from 'src/app/manage-permission/model/user-permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  permissionUrl = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.PERMISSION;
  userPermissionUrl = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.USER_PERMISSION;
  constructor(private http: HttpClient) {}

  fetchPermission(): Observable<FeatureGroup[]> {
    return this.http.get<FeatureGroup[]>(this.permissionUrl);
  }

  updateUserPermission(userId: string, userPermissionPayload: UserPermission[]): Observable<any> {
    return this.http.post<any>(this.userPermissionUrl + '/' + userId + '/update', userPermissionPayload);
  }
  updateUserPermissionApproval(userId: string, userPermissionPayload: UserPermission[]): Observable<any> {
    return this.http.post<any>(this.userPermissionUrl + '/' + userId + '/update/approvals', userPermissionPayload);
  }
  getUserPermission(userId: string | undefined): Observable<UserPermissionResponse> {
    return this.http.get<UserPermissionResponse>(this.userPermissionUrl + '/' + userId);
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.permissionUrl + '/role');
  }
}
