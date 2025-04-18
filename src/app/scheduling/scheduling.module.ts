import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SchedulingRoutingModule } from './scheduling-routing.module';
import { SlotsComponent } from './components/slots/slots.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { createAppointmentsComponent } from './components/create-appointments/create-appointments.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EventViewDialogComponent } from './components/event-view-dialog/event-view-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppointmentViewDialogComponent } from './components/appointment-view-dialog/appointment-view-dialog.component';

@NgModule({
  declarations: [
    SlotsComponent,
    ScheduleComponent,
    AppointmentsComponent,
    createAppointmentsComponent,
    EventViewDialogComponent,
    AppointmentViewDialogComponent,
  ],
  imports: [
    CommonModule,
    SchedulingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FontAwesomeModule,
    NgxMatSelectSearchModule,
    FullCalendarModule,
  ],
  providers: [DatePipe],
})
export class SchedulingModule {}
