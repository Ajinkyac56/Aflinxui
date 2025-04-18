import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { specialitySeachDto } from 'src/app/models/SearchCondition.model';
import { Observable } from 'rxjs';
import { Speciality } from '../../models/speciality.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialityService {
  constructor(private http: HttpClient) {}

  private specialityApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SPECIALITY_API;

  getAllSpeciality() {
    return this.http.get<Speciality[]>(this.specialityApi + '/specialityList');
  }

  getSpecialityById(specialityId: string): Observable<Speciality> {
    return this.http.get<Speciality>(this.specialityApi + '/getSpeciality', { params: { specialityId: specialityId } });
  }

  addSpeciality(speciality: Speciality): Observable<Speciality> {
    return this.http.post<Speciality>(this.specialityApi + '/saveSpeciality', speciality);
  }

  updateSpeciality(speciality: Speciality): Observable<Speciality> {
    return this.http.post<Speciality>(this.specialityApi + '/updateSpeciality', speciality);
  }

  deleteSpeciality(specialityId: string, isDelete: number) {
    const params = new HttpParams().set('specialityId', specialityId).set('isDelete', isDelete);
    return this.http.post<Speciality>(this.specialityApi + '/deleteSpeciality', {}, { params });
  }

  searchSpeciality(searchCondition: specialitySeachDto): Observable<Speciality[]> {
    return this.http.post<Speciality[]>(this.specialityApi + '/searchSpeciality', searchCondition);
  }
}
