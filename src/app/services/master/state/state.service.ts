import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from 'src/app/manage-org-structure/model/state.model';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  stateApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.STATE_API;

  constructor(private http: HttpClient) {}

  getAllState(): Observable<State[]> {
    return this.http.get<State[]>(this.stateApi);
  }
}
