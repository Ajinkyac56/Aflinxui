import { ManageAirmanComponent } from './components/manage-airman/manage-airman.component';
import { CreateAirmanComponent } from './components/create-airman/create-airman.component';
import { UserAndGroupRoutingModule } from './user-and-group-routing.module.ts';
import { RolesComponent } from './components/roles/roles.component';
import { RolesDialogComponent } from './components/roles-dialog/roles-dialog.component';
import { CommandActivitesComponent } from './components/command-activites/command-activites.component';
import { CommandActivitesDialogComponent } from './components/command-activites-dialog/command-activites-dialog.component';
import { AlphaRosterComponent } from './components/alpha-roster/alpha-roster.component';
import { SquadronComponent } from './components/squadrons/squadrons.component';
import { FlightComponent } from './components/flight/flight.component';
import { ImportAirmanComponent } from './components/import-airman/import-airman.component';
import { SquadronDialogComponent } from './components/squadron-dialog/squadron-dialog.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { CommandActivityViewComponent } from './components/command-activity-view/command-activity-view.component';
import { SquadronSubAdminViewComponent } from './components/squadron-sub-admin-view/squadron-sub-admin-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MyProfileDialogComponent } from '../dialog/my-profile-dialog/my-profile-dialog.component';
import { SharedModule } from '../shared/loader/shared.module';

@NgModule({
  declarations: [
    ManageAirmanComponent,
    CreateAirmanComponent,
    RolesComponent,
    RolesDialogComponent,
    CommandActivitesComponent,
    CommandActivitesDialogComponent,
    AlphaRosterComponent,
    SquadronComponent,
    FlightComponent,
    ImportAirmanComponent,
    SquadronDialogComponent,
    CommandActivityViewComponent,
    SquadronSubAdminViewComponent,
    MyProfileDialogComponent,
  ],
  imports: [CommonModule, UserAndGroupRoutingModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, MatDialogModule, SharedModule],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class UserAndGroupModule {}
