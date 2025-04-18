import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagePermissionRoutingModule } from './manage-permission-routing.module';
import { ManagePermissionComponent } from './components/manage-permission/manage-permission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [ManagePermissionComponent],
  imports: [CommonModule, ManagePermissionRoutingModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, NgxMatSelectSearchModule],
})
export class ManagePermissionModule {}
