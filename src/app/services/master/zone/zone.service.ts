import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Zone } from 'src/app/manage-org-structure/model/zone.model';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  zoneApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.ZONE_API;

  constructor(private http: HttpClient) {}

  getAllZone(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.zoneApi);
  }
}
