import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './component/category/category.component';
import { RequirementWeightComponent } from './component/requirement-weight/requirement-weight.component';
import { SpecialityComponent } from './component/speciality/speciality.component';
import { SubCategoryComponent } from './component/sub-category/sub-category.component';
import { SurveyComponent } from './component/survey/survey.component';
import { ManageChecklistComponent } from './component/manage-checklist/manage-checklist.component';
import { ChecklistTaskViewComponent } from './component/checklist-task-view-component/checklist-task-view-component.component';

const routes: Routes = [
  {
    path: 'speciality',
    component: SpecialityComponent,
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'sub-category',
    component: SubCategoryComponent,
  },
  {
    path: 'requirement-weight',
    component: RequirementWeightComponent,
  },
  {
    path: 'survey',
    component: SurveyComponent,
  },
  {
    path: 'manage-checklists',
    component: ManageChecklistComponent,
  },
  {
    path: 'checklist-view',
    component: ChecklistTaskViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
