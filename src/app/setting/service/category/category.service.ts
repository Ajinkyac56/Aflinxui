import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { CategorySeachDto } from 'src/app/models/SearchCondition.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CATEGORY_API;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl + '/categoryList');
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<Category>(this.apiUrl + '/getCategoryById', {
      params: { categoryId: categoryId },
    });
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl + '/categorySave', category);
  }

  updateCategory(categoryId: string, category: Category): Observable<Category> {
    return this.http.put<Category>(this.apiUrl + '/categoryUpdate', category, {
      params: { categoryId: categoryId },
    });
  }

  deleteCategory(categoryId: string, isDelete: number) {
    const params = new HttpParams().set('categoryId', categoryId).set('isDelete', isDelete);
    return this.http.put(this.apiUrl + '/categoryDelete', {}, { params });
  }

  searchCategory(SearchCondition: CategorySeachDto): Observable<Category> {
    return this.http.post<Category>(this.apiUrl + '/searchCategory', SearchCondition);
  }
}
