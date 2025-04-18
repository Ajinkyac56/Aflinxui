import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ChecklistDetailSearchDto, ChecklistUserSearchDto } from 'src/app/models/SearchCondition.model';
import { ChecklistMessage } from '../../model/checklist.model';

@Injectable({
  providedIn: 'root',
})
export class ChecklistMessageService {
  checklistApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CHECKLIST_MESSAGE_API;
  constructor(private http: HttpClient) {}

  searchChecklist(SearchCondition: ChecklistDetailSearchDto) {
    return this.http.post(this.checklistApi + '/checklistdetailssearch', SearchCondition);
  }

  searchChecklistUsers(SearchCondition: ChecklistUserSearchDto) {
    return this.http.post(this.checklistApi + '/checklistusersearch', SearchCondition);
  }

  addChecklist(checklist: ChecklistMessage): Observable<ChecklistMessage> {
    return this.http.post<ChecklistMessage>(this.checklistApi + '/savechecklist', checklist);
  }
}
