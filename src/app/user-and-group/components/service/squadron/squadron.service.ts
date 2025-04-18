import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Squadron } from 'src/app/user-and-group/models/squadron.model';
import { SquadronSearchDto } from 'src/app/models/SearchCondition.model';

@Injectable({
  providedIn: 'root',
})
export class SquadronService {
  private squadronApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SQAUDRON_API;

  constructor(private http: HttpClient) {}

  getSquadrons(): Observable<Squadron[]> {
    return this.http.get<Squadron[]>(this.squadronApi + '/getSquadronList').pipe(
      catchError(error => {
        console.error('Error fetching squadrons', error);
        return throwError(() => new Error('Error fetching squadrons'));
      })
    );
  }

  getSquadronById(squadronId: string): Observable<Squadron> {
    return this.http.get<Squadron>(this.squadronApi + '/getSquadron', { params: new HttpParams().set('squadronId', squadronId) });
  }

  searchSqauadron(SearchCondition: SquadronSearchDto): Observable<Squadron[]> {
    return this.http.post<Squadron[]>(this.squadronApi + '/searchSquadrons', SearchCondition);
  }

  saveSquadron(logo: File, squadron: Squadron): Observable<Squadron> {
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('squadron', JSON.stringify(squadron));

    return this.http.post<Squadron>(this.squadronApi + '/saveSquadron', formData);
  }

  updateSquadron(logo: File, squadron: Squadron): Observable<Squadron> {
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('squadron', JSON.stringify(squadron));
    return this.http.post<Squadron>(this.squadronApi + '/updateSquadron', formData);
  }

  deleteSquadron(squadronId: string, isDelete: number): Observable<void> {
    return this.http.post<void>(this.squadronApi + '/deleteSquadron', null, {
      params: new HttpParams().set('squadronId', squadronId).set('isDelete', isDelete),
    });
  }
}
