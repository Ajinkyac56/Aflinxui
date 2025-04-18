import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ChecklistSearchDto, SurveySearchDto } from 'src/app/models/SearchCondition.model';
import { checklist } from '../../models/checklist.model';
import { Survey } from '../../models/survey.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  surveylistApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SURVEY_API;
  constructor(private http: HttpClient) {}

  getAllSurveys() {
    return this.http.get(this.surveylistApi + '/getSurveyList');
  }

  searchSurveylist(SearchCondition: SurveySearchDto) {
    return this.http.post(this.surveylistApi + '/searchSurvey', SearchCondition);
  }

  addSurvey(surveylist: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.surveylistApi + '/saveSurvey', surveylist);
  }

  deleteSurvey(surveyId: string, isDelete: number) {
    const params = new HttpParams().set('surveyId', surveyId).set('isDelete', isDelete);
    return this.http.delete(this.surveylistApi + '/deleteSurvey', { params });
  }

  updateSurveyList(surveyId: string, surveyList: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.surveylistApi + '/updateSurvey', surveyList, {
      params: { surveyId: surveyId },
    });
  }
}
