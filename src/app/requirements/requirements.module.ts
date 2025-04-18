import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RequirementsRoutingModule } from './requirements-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CreateRequirementComponent } from './component/create-requirement/create-requirement.component';
import { ImportRequirementComponent } from './component/import-requirement/import-requirement.component';
import { ManageRequirementComponent } from './component/manage-requirement/manage-requirement.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from '../shared/loader/shared.module';

@NgModule({
  declarations: [CreateRequirementComponent, ManageRequirementComponent, ImportRequirementComponent],
  imports: [CommonModule, RequirementsRoutingModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, NgxMatSelectSearchModule, SharedModule],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class RequirementsModule {}
