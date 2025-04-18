import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SuccessResponse } from 'src/app/models/success.response.model';
import { AppointmentModule } from '../model/appointment.model';
import { ScheduleModel } from '../model/schedule.model';
import { bookSlot, Slots } from '../model/slots.model';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { catchError } from 'rxjs/operators';
import { appointmentSearchDto, appointmentUserSearchDto, nudgeGroupSearchDto, ScheduleListSearch } from 'src/app/models/SearchCondition.model';
import { AppointmentConflictDto } from 'src/app/communication/model/appointmentConflict';
import { Calendar } from '@fullcalendar/core';
import { CalenderModule } from '../model/calender.model';
import { Announcement } from 'src/app/communication/model/announcement.model';

@Injectable({
  providedIn: 'root',
})
export class SchedulingService {
  appointmentAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.APPOINTMENT_API;
  scheduleAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SCHEDULE_API;
  getSlotAPI = GlobalConstants.API_SERVER_URL + GlobalConstants.API_BASE_URL + GlobalConstants.SLOTS_API;

  constructor(private http: HttpClient) {}

  // saveAppointment
  saveAppointment(appointment: AppointmentModule): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.appointmentAPI + '/saveAppointment', appointment);
  }

  getScheduleList(schedule: ScheduleListSearch): Observable<ScheduleModel[]> {
    return this.http.post<ScheduleModel[]>(this.scheduleAPI + '/getScheduleList', schedule);
  }

  searchAppointment(appointmentSearch: appointmentSearchDto): Observable<AppointmentModule[]> {
    return this.http.post<AppointmentModule[]>(this.appointmentAPI + '/searchAppointment', appointmentSearch);
  }

  searchUserAppointmentList(SearchCondition: appointmentUserSearchDto): Observable<any[]> {
    return this.http.post<any[]>(this.appointmentAPI + '/searchAppointmentUser', SearchCondition);
  }

  // getAppointmentList(): Observable<AppointmentModule[]> {
  //   return this.http.get<AppointmentModule[]>(this.appointmentAPI + '/searchAppointment', {
  //     params: { userId: userId },
  //   });
  // }

  // Getting Slot List
  getSlotList(): Observable<Slots[]> {
    return this.http.get<Slots[]>(this.getSlotAPI + '/getSlot');
  }

  saveslotAppointment(scheduleSlot: bookSlot): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(this.appointmentAPI + '/saveslotAppointment', scheduleSlot);
  }

  checkAppointmentConflict(chkConflict: AppointmentModule): Observable<AppointmentConflictDto> {
    return this.http.post<AppointmentConflictDto>(this.appointmentAPI + '/appointmentConflict', chkConflict);
  }

  conflictAvailableTime(suggestedTime: AppointmentModule): Observable<string[]> {
    return this.http.post<string[]>(this.appointmentAPI + '/conflictSuggestedTime', suggestedTime);
  }

  getCalendarEvents(userId: string): Observable<CalenderModule[]> {
    return this.http.get<CalenderModule[]>(`${this.appointmentAPI}/getAppointmentSlotlist?userId=${userId}`);
  }

  updateStatus(status: AppointmentModule): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(this.appointmentAPI + '/updateRecordStatus', status);
  }

  updateViewStatus(appMessageId: string, userId: string) {
    const params = new HttpParams().set('appMessageId', appMessageId).set('userId', userId);
    return this.http.put<any[]>(this.appointmentAPI + '/viewStatus', {}, { params });
  }
}
