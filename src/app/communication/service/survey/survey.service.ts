import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SurveyDetailSearchDto } from 'src/app/models/SearchCondition.model';
import { ChecklistMessage } from '../../model/checklist.model';
import { SurveyMessage } from '../../model/survey.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyMessageService {
  surveyApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SURVEY_MESSAGE_API;
  constructor(private http: HttpClient) {}

  searchSurvey(SearchCondition: SurveyDetailSearchDto) {
    return this.http.post(this.surveyApi + '/surveydetailssearch', SearchCondition);
  }

  addSurvey(survey: SurveyMessage): Observable<SurveyMessage> {
    return this.http.post<SurveyMessage>(this.surveyApi + '/savesurvey', survey);
  }
}
