import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SurveyDetailSearchDto } from 'src/app/models/SearchCondition.model';
import { SurveyMessageService } from '../../service/survey/survey.service';
import { ToastrService } from 'ngx-toastr';
import { surveyDetails } from '../../model/surveyDetails.model';
import { User } from '../../model/announcement.model';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css'],
})
export class SurveysComponent implements OnInit {
  expandAction: boolean = false;
  noMoreRecords: boolean = false;

  searchForm: FormGroup;

  selectedSurveys: surveyDetails[];
  surveyList: surveyDetails[];

  hasAccessToAdd: boolean = false;
  hasAccessToView: boolean = false;

  pageableData: SurveyDetailSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };

  constructor(
    private surveyService: SurveyMessageService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.searchForm = this.fb.group({
      messageTitle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.searchSurveys(true);
    this.hasAccess();
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'Add');
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'View');
  }

  searchSurveys(clearData: boolean) {
    this.pageableData.messageTitle = this.searchForm.get('messageTitle')?.value;

    if (clearData) {
      this.surveyList = [];
      this.pageableData.page = 0;
    }

    this.surveyService.searchSurvey(this.pageableData).subscribe({
      next: (responseData: surveyDetails[]) => {
        if (clearData) {
          this.surveyList = responseData;
        } else {
          this.surveyList = [...this.surveyList, ...responseData];
        }
        this.noMoreRecords = responseData.length < this.pageableData.size;
      },
      error: error => {
        this.toaster.error('Unable to Load Checklist Data', 'Error!');
      },
    });
  }

  checkBoxValueClicked(event: any, type: string, item?: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.Survey-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSurveys = [...this.surveyList];
      } else {
        this.selectedSurveys = [];
      }
    } else if (item) {
      if (targetCheckbox.checked) {
        this.selectedSurveys.push(item);
      } else {
        const index = this.selectedSurveys.findIndex(data => data.surveyDetailsId === item.surveyDetailsId);
        if (index >= 0) {
          this.selectedSurveys.splice(index, 1);
        }
      }
    }
  }
}
