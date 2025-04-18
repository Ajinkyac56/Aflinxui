import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { slotsSearchDto } from 'src/app/models/SearchCondition.model';
import { bookSlot, Slots } from '../model/slots.model';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class SlotsService {
  slotsApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SLOTS_API;

  constructor(private http: HttpClient) {}

  getSlot(): Observable<Slots[]> {
    return this.http.get<Slots[]>(this.slotsApi + '/getSlot');
  }

  getSlotById(requirementId: string) {
    const params = new HttpParams().set('requirementId', requirementId);
    return this.http.get(this.slotsApi + '/getSlotsByReqId', { params });
  }

  searchSlots(SearchCondition: slotsSearchDto): Observable<any[]> {
    return this.http.post<any[]>(this.slotsApi + '/searchSlot', SearchCondition);
  }

  saveSlots(slots: Slots): Observable<any> {
    return this.http.post<any>(this.slotsApi + '/saveSlot', slots);
  }

  updateSlots(slots: Slots): Observable<any> {
    return this.http.put<any>(this.slotsApi + '/updateSlot', slots);
  }
}
