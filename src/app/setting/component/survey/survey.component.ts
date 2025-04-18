import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { AddQuestionDialogComponent } from 'src/app/dialog/add-question-dialog/add-question-dialog.component';
import { SurveyDialogComponent } from 'src/app/dialog/survey-dialog/survey-dialog.component';
import { SurveySearchDto } from 'src/app/models/SearchCondition.model';
import { Survey } from '../../models/survey.model';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from '../../service/survey/survey.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
})
export class SurveyComponent implements OnInit {
  pageableData: SurveySearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  searchForm: FormGroup;
  surveyList: Survey[] = [];
  selectedChecklists: Survey[] = [];
  noMoreRecords: boolean = false;
  selectedSurveyList: Survey[] = [];
  expandAction: boolean = false;

  constructor(private surveyService: SurveyService, private dialog: MatDialog, private toaster: ToastrService, private fb: FormBuilder) {
    // Initialize the search form
    this.searchForm = this.fb.group({
      surveyName: [''], // Form control for search input
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchSurveyList(true); // Initial search with clear
  }

  searchSurveyList(clearData: boolean = true) {
    this.pageableData.surveyName = this.searchForm.get('surveyName')?.value;

    if (clearData) {
      this.surveyList = [];
      this.pageableData.page = 0;
    }

    this.surveyService.searchSurveylist(this.pageableData).subscribe({
      next: (responseData: Survey[]) => {
        if (clearData) {
          this.surveyList = responseData;
        } else {
          this.surveyList = [...this.surveyList, ...responseData]; // Append for "Load More"
        }
        this.noMoreRecords = responseData.length < this.pageableData.size; // Update noMoreRecords
      },
      error: error => {
        this.toaster.error('Unable to Load Survey Data', 'Error!');
      },
    });
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.searchSurveyList(true); // Reload the survey list
  }

  openDialog(data?: Survey): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '500px',
      height: '370px',
      maxHeight: '370px', // Prevents dialog from resizing
      data: data,
      panelClass: 'custom-dialog-container', // For additional styling
      autoFocus: false, // Prevents auto-focus from causing layout shifts
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateSurveyList(result);
        } else {
          this.addSurveylist(result);
        }
      }
    });
  }

  updateSurveyList(surveyList: Survey) {
    const surveyId = surveyList.surveyId;

    this.surveyService.updateSurveyList(surveyId, surveyList).subscribe({
      next: () => {
        this.toaster.success('Survey Updated Successfully', 'Sucess!');
        this.searchSurveyList(true);
      },
      error: error => {
        this.toaster.error('Failed to update Survey', 'Error!');
      },
    });
  }

  checkBoxValueClicked(event: any, type: string, survey?: Survey) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.Checklist-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: any) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSurveyList = [...this.surveyList];
      } else {
        this.selectedSurveyList = [];
      }
    } else if (survey) {
      if (targetCheckbox.checked) {
        this.selectedSurveyList.push(survey);
      } else {
        const index = this.selectedSurveyList.findIndex(data => data.surveyId === survey.surveyId);
        if (index >= 0) {
          this.selectedSurveyList.splice(index, 1);
        }
      }
    }
  }

  openAddQuestionDialog(data?: Survey): void {
    const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
      width: '500px',
      height: '370px',
      maxHeight: '370px', // Prevents dialog from resizing
      data: data,
      panelClass: 'custom-dialog-container', // For additional styling
      autoFocus: false, // Prevents auto-focus from causing layout shifts
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateSurveyList(result);
        } else {
          this.addSurveylist(result);
        }
      }
    });
  }

  addSurveylist(surveylist: Survey) {
    this.surveyService.addSurvey(surveylist).subscribe({
      next: () => {
        this.toaster.success('Category Saved Successfully', 'Sucess!');
        this.searchSurveyList(true);
      },
      error: error => {
        this.toaster.error('Unable to Create Checklist', 'Error!');
      },
    });
  }

  deleteSurveyList(surveyId: string, isDelete: number) {
    this.surveyService.deleteSurvey(surveyId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Survey Delete Successfully', 'Sucess!');
        this.searchSurveyList(true);
      },
      error: error => {
        this.toaster.error('Failed to Delete Survey', 'Error!');
      },
    });
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.selectedSurveyList = isChecked ? [...this.surveyList] : [];
  }
}
