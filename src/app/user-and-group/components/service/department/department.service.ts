import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Department } from 'src/app/user-and-group/models/department.model';
import { CommandActivitySearchDto, DeptSubAdminSearchDto } from 'src/app/models/SearchCondition.model';
import { MultipleDeptSubAdmin } from 'src/app/user-and-group/models/deptSubAdminMultiple';
import { SuccessResponse } from 'src/app/models/success.response.model';
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL;
  private deptSubAdmin = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DEPT_SUB_ADMIN_API;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departmentApi/getDepartmentList`);
  }

  getDepartmentById(departmentId: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/department/getDepartmentById`, { params: new HttpParams().set('departmentId', departmentId) });
  }

  saveDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departmentApi/saveDepartment`, department);
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departmentApi/updateDepartment`, department, {});
  }

  deleteDepartment(departmentId: string, isDelete: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/departmentApi/deleteDepartment`, null, {
      params: new HttpParams().set('departmentId', departmentId).set('isDelete', isDelete.toString()),
    });
  }

  searchCommand(searchCondition: CommandActivitySearchDto): Observable<Department> {
    return this.http.post<Department>(this.apiUrl + '/departmentApi/searchDepartment', searchCondition);
  }

  searchSubAdminList(SearchCondition: DeptSubAdminSearchDto): Observable<any[]> {
    return this.http.post<any[]>(this.deptSubAdmin + '/getDeptSubAdminList', SearchCondition);
  }

  deleteSubAdminList(subAdminId: string, deptId: string, isDelete: number): Observable<any[]> {
    const params = new HttpParams().set('subAdminId', subAdminId).set('deptId', deptId).set('isDelete', isDelete);
    return this.http.post<any[]>(this.deptSubAdmin + '/deleteDeptSubAdmin', {}, { params });
  }

  saveDeptSubAdmin(multiplesubAdmin: MultipleDeptSubAdmin): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.deptSubAdmin + '/saveDeptSubAdmin', multiplesubAdmin);
  }
}
