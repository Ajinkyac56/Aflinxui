import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Country } from 'src/app/manage-org-structure/model/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  countryApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.COUNTRY_API;
  destinationApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.DESTINATION_API;
  constructor(private http: HttpClient) {}

  getAllCountry(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countryApi);
  }
}
