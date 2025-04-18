import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../security/auth.guard';
import { ManageAirmanComponent } from './components/manage-airman/manage-airman.component';
import { CreateAirmanComponent } from './components/create-airman/create-airman.component';
import { RolesComponent } from './components/roles/roles.component';
import { CommandActivitesComponent } from './components/command-activites/command-activites.component';
import { AlphaRosterComponent } from './components/alpha-roster/alpha-roster.component';
import { SquadronComponent } from './components/squadrons/squadrons.component';
import { FlightComponent } from './components/flight/flight.component';
import { ImportAirmanComponent } from './components/import-airman/import-airman.component';
import { CommandActivityViewComponent } from './components/command-activity-view/command-activity-view.component';
import { SquadronSubAdminViewComponent } from './components/squadron-sub-admin-view/squadron-sub-admin-view.component';

const routes: Routes = [
  {
    path: '',
    component: ManageAirmanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'createAirman',
    component: CreateAirmanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'importAirman',
    component: ImportAirmanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'command-activites',
    component: CommandActivitesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'alpha-roster',
    component: AlphaRosterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'squadrons',
    component: SquadronComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'squadrons-subAdmin-view',
    component: SquadronSubAdminViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'flight',
    component: FlightComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'command-activity-view',
    component: CommandActivityViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAndGroupRoutingModule {}
