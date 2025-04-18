import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRequirementComponent } from './component/create-requirement/create-requirement.component';
import { ImportRequirementComponent } from './component/import-requirement/import-requirement.component';
import { ManageRequirementComponent } from './component/manage-requirement/manage-requirement.component';

const routes: Routes = [
  {
    path: 'create-requirements',
    component: CreateRequirementComponent,
  },
  {
    path: 'manage-requirements',
    component: ManageRequirementComponent,
  },
  {
    path: 'import-requirements',
    component: ImportRequirementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementsRoutingModule {}
