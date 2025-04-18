import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SubCategory } from '../../models/sub-category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  constructor(private http: HttpClient) {}

  subCategoryApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SUBCATEGORY_API;

  getAllSubCategory() {
    return this.http.get<SubCategory[]>(this.subCategoryApi + '/categoryList');
  }

  getSubCategoryById(subCategoryId: string): Observable<SubCategory> {
    return this.http.get<SubCategory>(this.subCategoryApi + '/getSubCategoryById', { params: { subCategoryId: subCategoryId } });
  }

  saveSubCategory(subCategory: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.subCategoryApi + '/saveSubCategory', subCategory);
  }

  searchSubCategory(searchCondition): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.subCategoryApi + '/subCategorySearch', searchCondition);
  }

  updateSubCategory(subCategoryId: string, subCategory: SubCategory): Observable<SubCategory> {
    const params = new HttpParams().set('subCategoryId', subCategoryId);
    return this.http.put<SubCategory>(this.subCategoryApi + '/updateCategory', subCategory, { params });
  }

  deleteSubCategory(subCategoryId: string, isDelete: number): Observable<SubCategory> {
    const params = new HttpParams().set('subCategoryId', subCategoryId).set('isDelete', isDelete);
    return this.http.put<SubCategory>(this.subCategoryApi + '/subCategoryDelete', {}, { params });
  }
}
