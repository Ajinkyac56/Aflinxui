import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { SuccessResponse } from 'src/app/models/success.response.model';
import { User } from 'src/app/user/model/user.model';
import { UserNameDto } from 'src/app/user/model/usernamedto.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.USER_API;
  constructor(private http: HttpClient) {}
  profileUploadApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.PROFILE_UPLOAD;
  profileFetchAPi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.PROFILE_FETCH;

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(this.userApi);
  }
  getNonPartnerAllUser(): Observable<User[]> {
    return this.http.get<User[]>(this.userApi + '/nonPartnerUsers');
  }
  createAirman(user: User, file?: File): Observable<SuccessResponse> {
    const formDt = new FormData();
    formDt.append('userDto', JSON.stringify(user));
    if (file) {
      formDt.append('photo', file);
    }
    return this.http.post<SuccessResponse>(`${this.userApi}/create`, formDt);
  }

  updateAirman(user: User, file: File): Observable<SuccessResponse> {
    const formDt = new FormData();
    formDt.append('userDto', JSON.stringify(user));
    if (file) {
      formDt.append('photo', file);
    }
    return this.http.post<SuccessResponse>(this.userApi + '/update', formDt);
  }
  searchAirman(pageableData: EmployeeSearchDto): Observable<User[]> {
    return this.http.post<User[]>(this.userApi + '/employee', pageableData);
  }
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(this.userApi + '/' + userId);
  }

  updateUserStatus(userId: string, status: string): Observable<SuccessResponse> {
    return this.http.get<SuccessResponse>(this.userApi + '/' + userId + '/' + status);
  }
  profileUpload(email: any, file: any) {
    const formDt = new FormData();
    formDt.append('email', email);
    formDt.append('photo', file);
    return this.http.post<any>(this.profileUploadApi, formDt);
  }
  getProfilePhoto(email: any) {
    return this.http.get<any>(this.profileFetchAPi + '?email=' + email);
  }
  importUsers(user: User[], fileName: string): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.userApi}/createUser`, user, {
      params: {
        fileName: fileName,
      },
    });
  }
}
