import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../security/auth.guard';
import { ChecklistsComponent } from './components/checklists/checklists.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { NudgeGroupsComponent } from './components/nudge-groups/nudge-groups.component';
import { SurveysComponent } from './components/surveys/surveys.component';
import { CreateAnnouncementComponent } from './components/create-announcement/create-announcement.component';
import { CreateNudgeGroupComponent } from './components/create-nudge-group/create-nudge-group.component';
import { NudgeGroupsViewComponent } from './components/nudge-groups-view/nudge-groups-view.component';
import { AnnouncementViewComponent } from './components/announcement-view/announcement-view.component';
import { CreateChecklistComponent } from './components/create-checklist/create-checklist.component';
import { SurveyMessageComponent } from './components/survey-message/survey-message.component';
import { ChecklistViewComponent } from './components/checklist-view/checklist-view.component';

const routes: Routes = [
  {
    path: '',
    component: ChecklistsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'surveys',
    component: SurveysComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'nudge-groups',
    component: NudgeGroupsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-announcement',
    component: CreateAnnouncementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-nudge-group',
    component: CreateNudgeGroupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-checklist',
    component: CreateChecklistComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'survey-message',
    component: SurveyMessageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-nudge-group',
    component: NudgeGroupsViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-announcement',
    component: AnnouncementViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-checklist',
    component: ChecklistViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule {}
