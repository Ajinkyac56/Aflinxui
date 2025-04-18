import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { AuthGuard } from '../security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ManagePermissionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manageApprovals',
    component: ManagePermissionComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePermissionRoutingModule {}
