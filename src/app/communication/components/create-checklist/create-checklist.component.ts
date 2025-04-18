import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChecklistService } from 'src/app/setting/service/checklist/checklist.service';
import { ChecklistSearchDto, nudgeGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { checklist } from 'src/app/setting/models/checklist.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { UserService } from 'src/app/services/components/user/user.service';
import { User } from 'src/app/user/model/user.model';
import { NudgeGroupsService } from '../../service/nudgeGroups/nudge-groups.service';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { ChecklistMessageService } from '../../service/checklist/checklist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.css'],
})
export class CreateChecklistComponent implements OnInit {
  currentTab: number = 1;
  createChecklist: FormGroup;
  canLoadMore: boolean = false;
  dataGroupRecord: any[] = [];

  checkList: checklist[] = [];
  filteredChecklists: checklist[] = [];

  datafilerecords: User[] = [];
  selectData: User[] = [];

  dataGroupFile: NudgeGroup[] = [];

  checklistSearchControl = new FormControl('');
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
    private checklistService: ChecklistService,
    private checklistMessageService: ChecklistMessageService,
    private toaster: ToastrService,
    private router: Router,
    private userService: UserService,
    private nudgeGroupsService: NudgeGroupsService
  ) {
    this.createChecklist = this.fb.group({
      userGroup: ['Group'],
      messageTitle: ['', Validators.required],
      checklistId: ['', Validators.required],
      scheduleMessage: [false],
      messageText: [''],
      sendDate: [''],
      userName: [''],
      status: [''],
      checklistDetailsId: [''],
    });
  }

  ngOnInit(): void {
    this.searchAirman(true);
    this.searchGroupData(true);
    this.getAllChecklist();
    this.createChecklist.get('userName')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.searchOnCondition();
      }
    });
  }

  getAllChecklist(): void {
    this.checklistService.getAllChecklist().subscribe({
      next: (responseData: checklist[]) => {
        this.checkList = responseData;
        this.filteredChecklists = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Checklist Data', 'Error!');
      },
    });
  }

  filterChecklists(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredChecklists = this.checkList;
    } else {
      this.filteredChecklists = this.checkList.filter(checklist => checklist.checklistName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }

  searchOnCondition() {
    if (this.createChecklist.get('userGroup').value === 'Users') {
      this.searchAirman(true);
    } else {
      this.searchGroupData(true);
    }
  }

  searchAirman(clearData: boolean): void {
    this.pageableData.employeeName = this.createChecklist.get('userName')?.value || '';

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
    this.pageableDataGroup.messageGroupName = this.createChecklist.get('userName')?.value;
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
    return (this.createChecklist.get('messageTitle')?.valid && this.createChecklist.get('checklistId')?.valid) || false;
  }

  previousTab(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }

  nextTab(): void {
    if (!this.isFormValid()) {
      this.createChecklist.markAllAsTouched();
      return;
    }
    this.currentTab++;
  }

  toggleSelection(user: User): void {
    const selectedUsers = this.createChecklist.get('selectedUsers') as FormArray;
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
    const selectedUsers = this.createChecklist.get('selectedUsers') as FormArray;
    return selectedUsers.controls.some(control => control.value === userId);
  }

  saveChecklistForm(): void {
    if (this.createChecklist.valid) {
      const userGroup = this.createChecklist.get('userGroup')?.value;
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

      const checklistMessage = {
        checklistMessageId: '',
        sendToGroup: [],
        sendToUser: [],
        messageText: this.createChecklist.get('messageText')?.value,
        scheduleMessage: this.createChecklist.get('scheduleMessage')?.value,
        sendDate: this.createChecklist.get('sendDate')?.value,
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        status: '',
        messageTitle: this.createChecklist.get('messageTitle')?.value,
        readCount: 0,
        checklistDetailsId: this.createChecklist.get('checklistDetailsId')?.value,
        checklistId: this.createChecklist.get('checklistId')?.value,
      };

      if (this.selectData.length > 0 && isUsersGroup) {
        checklistMessage.sendToUser = this.selectData.map(user => user.id);
      } else if (this.dataGroupRecord.length > 0 && isGroupGroup) {
        checklistMessage.sendToGroup = this.dataGroupRecord.map(group => group.messageGroupId);
      }

      this.checklistMessageService.addChecklist(checklistMessage).subscribe({
        next: response => {
          this.toaster.success('Checklist Message Created successfully', 'Success!');
          this.router.navigate(['/dashboard/communication']);
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to Create Checklist Message';
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

  getChecklistName(id: string) {
    return this.checkList.find(checklist => checklist.checklistId === id)?.checklistName || 'Unknown Checklist';
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
