import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../security/auth.guard';
import { SlotsComponent } from './components/slots/slots.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { createAppointmentsComponent } from './components/create-appointments/create-appointments.component';
import { AppointmentViewDialogComponent } from './components/appointment-view-dialog/appointment-view-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: SlotsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'appointments',
    component: AppointmentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-appointments',
    component: createAppointmentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-appointments',
    component: AppointmentViewDialogComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulingRoutingModule {}
