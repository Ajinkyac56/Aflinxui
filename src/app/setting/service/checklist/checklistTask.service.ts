import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskPayload } from '../../models/checklistTask.model'; // Adjust path as needed
import { GlobalConstants } from 'src/app/config/GlobalConstants';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class ChecklistTaskService {
  private apiUrl = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.CHECKLIST_TASK_API; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  addTask(task: TaskPayload): Observable<TaskPayload> {
    return this.http.post<TaskPayload>(this.apiUrl + '/saveChecklistTask', task);
  }

  getChecklistTasks(checklistId: string): Observable<TaskPayload[]> {
    const params = new HttpParams().set('checklistId', checklistId); // Set the checklistId as a query parameter
    return this.http.get<TaskPayload[]>(this.apiUrl + '/getChecklistTaskList', { params }); // Pass params to the HTTP request
  }

  updateChecklistTask(taskId: string, task: TaskPayload): Observable<TaskPayload> {
    return this.http.post<TaskPayload>(this.apiUrl + '/updateChecklistTask', task, {
      params: { taskId: taskId },
    });
  }

  deleteChecklist(taskId: string, isDelete: number) {
    const params = new HttpParams().set('taskId', taskId).set('isDelete', isDelete);
    return this.http.delete(this.apiUrl + '/deleteChecklistTask', { params });
  }
}
