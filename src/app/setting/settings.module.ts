import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SpecialityComponent } from './component/speciality/speciality.component';
import { CategoryComponent } from './component/category/category.component';
import { SubCategoryComponent } from './component/sub-category/sub-category.component';
import { RequirementWeightComponent } from './component/requirement-weight/requirement-weight.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SurveyComponent } from './component/survey/survey.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AddQuestionDialogComponent } from '../dialog/add-question-dialog/add-question-dialog.component';
import { AddRequirementDialogComponent } from '../dialog/add-requirement-dialog/add-requirement-dialog.component';
import { CategoryDialogComponent } from '../dialog/category-dialog/category-dialog.component';
import { SpecialityDialogComponent } from '../dialog/speciality-dialog/speciality-dialog.component';
import { SubCategoryDialogComponent } from '../dialog/sub-category-dialog/sub-category-dialog.component';
import { SurveyDialogComponent } from '../dialog/survey-dialog/survey-dialog.component';
import { AppointmentSlotDialogComponent } from '../scheduling/components/appointment-slot-dialog/appointment-slot-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ManageChecklistComponent } from './component/manage-checklist/manage-checklist.component';
import { ManageChecklistDialogComponent } from '../dialog/manage-checklist-dialog/manage-checklist-dialog.component';
import { ChecklistsTaskDialogComponent } from '../dialog/checklists-task-dialog/checklists-task-dialog.component';
import { ChecklistTaskViewComponent } from './component/checklist-task-view-component/checklist-task-view-component.component';

@NgModule({
  declarations: [
    AddRequirementDialogComponent,
    CategoryDialogComponent,
    SpecialityDialogComponent,
    SubCategoryDialogComponent,
    SurveyDialogComponent,
    AddQuestionDialogComponent,
    AppointmentSlotDialogComponent,
    SpecialityComponent,
    CategoryComponent,
    SubCategoryComponent,
    RequirementWeightComponent,
    SurveyComponent,
    ManageChecklistComponent,
    ManageChecklistDialogComponent,
    ChecklistsTaskDialogComponent,
    ChecklistTaskViewComponent,
  ],
  imports: [CommonModule, SettingsRoutingModule, ReactiveFormsModule, AngularMaterialModule, NgxMatSelectSearchModule],
})
export class SettingsModule {}
