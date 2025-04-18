import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './component/my-profile/my-profile.component';
import { WorkDialogComponent } from './component/work-dialog/work-dialog.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EducationDialogComponent } from './component/education-dialog/education-dialog.component';
import { TrainingDialogComponent } from './component/training-dialog/training-dialog.component';
import { CertificationDialogComponent } from './component/certification-dialog/certification-dialog.component';
import { LicenseDialogComponent } from './component/license-dialog/license-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentationDialogComponent } from './component/documentation-dialog/documentation-dialog.component';
import { DesignationLetterDialogComponent } from './component/designation-letter-dialog/designation-letter-dialog.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    MyProfileComponent,
    WorkDialogComponent,
    EducationDialogComponent,
    TrainingDialogComponent,
    CertificationDialogComponent,
    LicenseDialogComponent,
    DocumentationDialogComponent,
    DesignationLetterDialogComponent,
  ],
  imports: [CommonModule, MyProfileRoutingModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MyProfileModule {}
