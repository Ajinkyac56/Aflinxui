import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { District } from 'src/app/manage-org-structure/model/district.model';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  districtApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DISTRICT_API;
  constructor(private http: HttpClient) {}

  getAllDistrict(): Observable<District[]> {
    return this.http.get<District[]>(this.districtApi);
  }
}
