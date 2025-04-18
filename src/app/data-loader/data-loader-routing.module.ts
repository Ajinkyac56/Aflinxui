import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlphaRoasterComponent } from './components/alpha-roaster/alpha-roaster.component';
import { AuthGuard } from '../security/auth.guard';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { AlphaRoasterViewComponent } from './components/alpha-roaster-view/alpha-roaster-view.component';
import { RequirementsViewComponent } from './components/requirements-view/requirements-view.component';

const routes: Routes = [
  {
    path: '',
    component: AlphaRoasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'requirements',
    component: RequirementsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'alphaRoasterComponentView',
    component: AlphaRoasterViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'requirementsViewComponent',
    component: RequirementsViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataLoaderRoutingModule {}
