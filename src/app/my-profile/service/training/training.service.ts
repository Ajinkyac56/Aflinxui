import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { TrainingDto } from '../../model/training.model';
import { Observable } from 'rxjs';
import { SuccessResponse } from 'src/app/models/success.response.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  constructor(private http: HttpClient) {}

  trainingApi = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.TRAINING_API;

  getTraining(userId: string) {
    return this.http.get(this.trainingApi + '/getTrainingByUserId', { params: { userId: userId } });
  }

  saveTraining(fileName: string, training: TrainingDto): Observable<any> {
    const formDt = new FormData();
    formDt.append('fileName', fileName);
    formDt.append('trainingDto', JSON.stringify(training));

    return this.http.post<any>(this.trainingApi + '/trainingSaveApi', formDt);
  }

  updateTraining(fileName: string, training: TrainingDto): Observable<any> {
    const formDt = new FormData();
    formDt.append('fileName', fileName);
    formDt.append('training', JSON.stringify(training));

    return this.http.post<any>(this.trainingApi + '/trainingUpdateApi', formDt);
  }

  deleteTraining(trainingId: string): Observable<SuccessResponse> {
    const params = new HttpParams().set('trainingId', trainingId);
    return this.http.post<SuccessResponse>(this.trainingApi + '/trainingDelete', {}, { params });
  }
}
