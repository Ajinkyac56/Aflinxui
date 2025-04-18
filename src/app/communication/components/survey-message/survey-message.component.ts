import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from 'src/app/setting/service/survey/survey.service'; // Assuming this exists
import { nudgeGroupSearchDto, SurveySearchDto } from 'src/app/models/SearchCondition.model'; // Assuming this exists
import { Survey } from 'src/app/setting/models/survey.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { ChecklistMessageService } from '../../service/checklist/checklist.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/components/user/user.service';
import { NudgeGroupsService } from '../../service/nudgeGroups/nudge-groups.service';
import { User } from 'src/app/user/model/user.model';
import { SurveyMessageService } from '../../service/survey/survey.service';

@Component({
  selector: 'app-survey-message',
  templateUrl: './survey-message.component.html',
  styleUrls: ['./survey-message.component.css'],
})
export class SurveyMessageComponent implements OnInit {
  currentTab: number = 1;
  createSurveys: FormGroup;
  canLoadMore: boolean = false;
  dataGroupRecord: any[] = [];

  surveyList: Survey[] = [];
  filteredSurvey: Survey[] = [];
  surveySearchControl = new FormControl('');

  datafilerecords: User[] = [];
  selectData: User[] = [];

  dataGroupFile: NudgeGroup[] = [];

  pageableData: EmployeeSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    employeeName: '',
  };

  pageableDataGroup: nudgeGroupSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
  };

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private surveyMessageService: SurveyMessageService,
    private toaster: ToastrService,
    private router: Router,
    private userService: UserService,
    private nudgeGroupsService: NudgeGroupsService
  ) {
    this.createSurveys = this.fb.group({
      userGroup: ['Group'],
      messageTitle: ['', Validators.required],
      surveyId: ['', Validators.required],
      scheduleMessage: [false],
      messageText: [''],
      sendDate: [''],
      userName: [''],
      status: [''],
      surveyDetailsId: [''],
    });
  }

  ngOnInit(): void {
    this.searchAirman(true);
    this.searchGroupData(true);
    this.getAllSurveys();
    this.createSurveys.get('userName')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.searchOnCondition();
      }
    });
  }

  getAllSurveys(clearData: boolean = true): void {
    if (clearData) {
      this.surveyList = [];
      this.pageableData.page = 0;
    }

    this.surveyService.getAllSurveys().subscribe({
      next: (responseData: Survey[]) => {
        this.surveyList = responseData;
        this.filteredSurvey = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Survey Data', 'Error!');
      },
    });
  }

  filterSurveyListItem(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredSurvey = this.surveyList;
    } else {
      this.filteredSurvey = this.surveyList.filter(survey => survey.surveyName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }

  searchOnCondition() {
    if (this.createSurveys.get('userGroup').value === 'Users') {
      this.searchAirman(true);
    } else {
      this.searchGroupData(true);
    }
  }

  searchAirman(clearData: boolean): void {
    this.pageableData.employeeName = this.createSurveys.get('userName')?.value || '';

    if (clearData) {
      this.datafilerecords = [];
      this.pageableData.page = 0;
    }
    this.userService.searchAirman(this.pageableData).subscribe({
      next: (responseData: User[]) => {
        this.datafilerecords = [...this.datafilerecords, ...responseData];
        if (responseData.length < this.pageableData.size) {
          this.canLoadMore = false;
        } else {
          this.canLoadMore = true;
        }
      },
      error: error => {
        this.toaster.error('Unable to load data', 'Error');
      },
    });
  }

  searchGroupData(clearData: boolean) {
    this.pageableDataGroup.messageGroupName = this.createSurveys.get('userName')?.value;
    if (clearData) {
      this.dataGroupFile = [];
      this.pageableDataGroup.page = 0;
    }
    this.nudgeGroupsService.searchGroupList(this.pageableDataGroup).subscribe({
      next: responseData => {
        this.dataGroupFile = [...this.dataGroupFile, ...responseData]; // Append new records

        if (responseData.length < this.pageableData.size) {
          this.canLoadMore = false;
        } else {
          this.canLoadMore = true;
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Data', 'Error!');
      },
    });
  }

  loadMore() {
    this.pageableData.page += 1;
    this.searchAirman(false);
  }

  isFormValid(): boolean {
    return (this.createSurveys.get('messageTitle')?.valid && this.createSurveys.get('surveyId')?.valid) || false;
  }

  previousTab(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }

  nextTab(): void {
    if (!this.isFormValid()) {
      this.createSurveys.markAllAsTouched();
      return;
    }
    this.currentTab++;
  }

  toggleSelection(user: User): void {
    const selectedUsers = this.createSurveys.get('selectedUsers') as FormArray;
    const index = selectedUsers.controls.findIndex(control => control.value === user.id);

    if (index >= 0) {
      selectedUsers.removeAt(index);
      this.selectData = this.selectData.filter(u => u.id !== user.id);
    } else {
      selectedUsers.push(this.fb.control(user.id));
      this.selectData.push(user);
    }
  }

  isSelected(userId: number): boolean {
    const selectedUsers = this.createSurveys.get('selectedUsers') as FormArray;
    return selectedUsers.controls.some(control => control.value === userId);
  }

  saveSurveylist(): void {
    if (this.createSurveys.valid) {
      const userGroup = this.createSurveys.get('userGroup')?.value;
      const isUsersGroup = userGroup === 'Users';
      const isGroupGroup = userGroup === 'Group';

      if (isUsersGroup && this.selectData.length === 0) {
        this.toaster.warning('Please select at least one user from the list', 'Warning');
        return;
      }

      if (isGroupGroup && this.dataGroupRecord.length === 0) {
        this.toaster.warning('Please select at least one group from the list', 'Warning');
        return;
      }

      if ((isUsersGroup && this.datafilerecords.length === 0) || (isGroupGroup && this.dataGroupFile.length === 0)) {
        const listType = isUsersGroup ? 'user' : 'group';
        this.toaster.warning(`There are no records available in the ${listType} list.`, 'Warning!');
        return;
      }

      const surveyMessage = {
        surveyMessageId: '',
        sendToGroup: [],
        sendToUser: [],
        messageText: this.createSurveys.get('messageText')?.value,
        scheduleMessage: this.createSurveys.get('scheduleMessage')?.value,
        sendDate: this.createSurveys.get('sendDate')?.value,
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        status: '',
        messageTitle: this.createSurveys.get('messageTitle')?.value,
        readCount: 0,
        surveyId: this.createSurveys.get('surveyId')?.value,
        surveyDetailsId: this.createSurveys.get('surveyDetailsId')?.value,
      };

      if (this.selectData.length > 0 && isUsersGroup) {
        surveyMessage.sendToUser = this.selectData.map(user => user.id);
      } else if (this.dataGroupRecord.length > 0 && isGroupGroup) {
        surveyMessage.sendToGroup = this.dataGroupRecord.map(group => group.messageGroupId);
      }

      this.surveyMessageService.addSurvey(surveyMessage).subscribe({
        next: response => {
          this.toaster.success('Survey Message Created successfully', 'Success!');
          this.router.navigate(['/dashboard/communication/surveys']);
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to Create Survey Message';
          this.toaster.error(errorMessage, 'Error!');
        },
      });
    }
  }

  checkBoxValueClicked(event: any, type: any, item: any, category: string) {
    const announcementCheckbox = event.target as HTMLInputElement;
    if (category === 'userData') {
      if (type === 'all') {
        const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]');
        checkboxes.forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = announcementCheckbox.checked;
        });

        if (announcementCheckbox.checked) {
          this.selectData = [...this.datafilerecords];
        } else {
          this.selectData = [];
        }
      } else {
        if (announcementCheckbox.checked) {
          this.selectData.push(item);
        } else {
          const index = this.selectData.findIndex(data => data.id === item.id);
          if (index >= 0) {
            this.selectData.splice(index, 1);
          }
        }
      }
    }
    // created functionality for the group
    else if (category === 'groupData') {
      if (type === 'all') {
        const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]');
        checkboxes.forEach((checkbox: HTMLInputElement) => {
          checkbox.checked = announcementCheckbox.checked;
        });

        if (announcementCheckbox.checked) {
          this.dataGroupRecord = [...this.dataGroupFile];
        } else {
          this.dataGroupRecord = [];
        }
      } else {
        if (announcementCheckbox.checked) {
          this.dataGroupRecord.push(item);
        } else {
          const index = this.dataGroupRecord.findIndex(data => data.messageGroupId === item.messageGroupId);
          if (index >= 0) {
            this.dataGroupRecord.splice(index, 1);
          }
        }
      }
    }
  }

  isUserSelected(user: User): boolean {
    return this.selectData.some(selectedUser => selectedUser.id === user.id);
  }

  isGroupSelected(group: NudgeGroup): boolean {
    return this.dataGroupRecord.some(selectedGroup => selectedGroup.messageGroupId === group.messageGroupId);
  }

  getSurveyName(id: string) {
    return this.surveyList.find(surveyList => surveyList.surveyId === id)?.surveyName || 'Unknown Survey';
  }

  onGroupChanged(selectedValue: string): void {
    this.pageableData.page = 0;
    this.datafilerecords = [];
    this.dataGroupFile = [];

    if (selectedValue === 'Users') {
      this.dataGroupRecord = [];
      this.selectData = [];
      this.searchAirman(true);
    } else {
      this.dataGroupRecord = [];
      this.selectData = [];
      this.searchGroupData(true);
    }
  }
}
