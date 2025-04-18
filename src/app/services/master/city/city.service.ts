import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { City } from 'src/app/manage-org-structure/model/city.model';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  cityApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CITY_API;
  constructor(private http: HttpClient) {}

  getAllCity(): Observable<City[]> {
    return this.http.get<City[]>(this.cityApi);
  }
}
