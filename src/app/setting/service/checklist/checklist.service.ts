import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ChecklistSearchDto } from 'src/app/models/SearchCondition.model';
import { checklist } from '../../models/checklist.model';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  checklistApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CHECKLIST_API;
  constructor(private http: HttpClient) {}

  getAllChecklist() {
    return this.http.get(this.checklistApi + '/getChecklistList');
  }

  searchChecklist(SearchCondition: ChecklistSearchDto) {
    return this.http.post(this.checklistApi + '/searchChecklist', SearchCondition);
  }

  addChecklist(checklist: checklist): Observable<checklist> {
    return this.http.post<checklist>(this.checklistApi + '/saveChecklist', checklist);
  }

  deleteChecklist(checklistId: string, isDelete: number) {
    const params = new HttpParams().set('checklistId', checklistId).set('isDelete', isDelete);
    return this.http.post(this.checklistApi + '/deleteChecklist', {}, { params });
  }

  updateChecklist(checklistId: string, checklist: checklist): Observable<checklist> {
    return this.http.post<checklist>(this.checklistApi + '/updateChecklist', checklist, {
      params: { checklistId: checklistId },
    });
  }
}
