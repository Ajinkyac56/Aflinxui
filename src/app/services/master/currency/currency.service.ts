import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Currency } from 'src/app/models/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currencyApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CURRENCY_API;
  currencyNoAuthApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CURRENCY_NO_AUTH_API;
  constructor(private http: HttpClient) {}

  getAllCurrency(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.currencyApi);
  }
  getAllCurrencyNoAuth(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.currencyNoAuthApi);
  }
}
