import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DataLoaderRoutingModule } from './data-loader-routing.module';
import { AlphaRoasterComponent } from './components/alpha-roaster/alpha-roaster.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AlphaRoasterViewComponent } from './components/alpha-roaster-view/alpha-roaster-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { RequirementsViewComponent } from './components/requirements-view/requirements-view.component';

@NgModule({
  declarations: [AlphaRoasterComponent, RequirementsComponent, AlphaRoasterViewComponent, RequirementsViewComponent],
  imports: [CommonModule, DataLoaderRoutingModule, FormsModule, ReactiveFormsModule, AngularMaterialModule],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class DataLoaderModule {}
