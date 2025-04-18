import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CommunicationRoutingModule } from './communication-routing.module';
import { ChecklistsComponent } from './components/checklists/checklists.component';
import { SurveysComponent } from './components/surveys/surveys.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { NudgeGroupsComponent } from './components/nudge-groups/nudge-groups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CreateAnnouncementComponent } from './components/create-announcement/create-announcement.component';
import { CreateNudgeGroupComponent } from './components/create-nudge-group/create-nudge-group.component';
import { NudgeGroupsViewComponent } from './components/nudge-groups-view/nudge-groups-view.component';
import { AnnouncementViewComponent } from './components/announcement-view/announcement-view.component';
import { UserListDialogComponent } from './components/userlist-dialoge/userlist-dialoge.component';
import { RouterModule } from '@angular/router';
import { AppointmentConfilctDialogComponent } from './components/appointment-conflict-dialog/appointment-conflict-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NudgeGroupUpdateComponent } from './components/nudge-group-update/nudge-group-update.component';
import { ResponseViewDialogComponent } from './components/view-response-dialog/view-response-dialog.component';
import { CreateChecklistComponent } from './components/create-checklist/create-checklist.component';
import { NgChartsModule } from 'ng2-charts';
import { GraphSummaryViewComponent } from './components/graph-summary-view/graph-summary-view.component';
import { SurveyMessageComponent } from './components/survey-message/survey-message.component';
import { ChecklistViewComponent } from './components/checklist-view/checklist-view.component';
@NgModule({
  declarations: [
    ResponseViewDialogComponent,
    ChecklistsComponent,
    SurveysComponent,
    AnnouncementsComponent,
    NudgeGroupsComponent,
    CreateNudgeGroupComponent,
    CreateAnnouncementComponent,
    NudgeGroupsViewComponent,
    AnnouncementViewComponent,
    UserListDialogComponent,
    GraphSummaryViewComponent,
    AppointmentConfilctDialogComponent,
    NudgeGroupUpdateComponent,
    CreateChecklistComponent,
    SurveyMessageComponent,
    ChecklistViewComponent,
  ],
  imports: [
    NgChartsModule,
    CommonModule,
    CommunicationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    NgxMatSelectSearchModule,
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class CommunicationModule {}
