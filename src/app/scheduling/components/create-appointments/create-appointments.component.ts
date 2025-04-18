import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { AppointmentModule } from '../../model/appointment.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/components/user/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { User } from 'src/app/user/model/user.model';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { nudgeGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { Requirement } from 'src/app/requirements/model/requirement.model';
import { NudgeGroup } from 'src/app/communication/model/nudgeGroup.model';
import { NudgeGroupsService } from 'src/app/communication/service/nudgeGroups/nudge-groups.service';
import { SchedulingService } from '../../service/scheduling.service';
import { Slots } from '../../model/slots.model';
import { RequirementService } from 'src/app/requirements/service/requirement.service';

@Component({
  selector: 'app-create-appointments',
  templateUrl: './create-appointments.component.html',
  styleUrls: ['./create-appointments.component.css'],
})
export class createAppointmentsComponent {
  createAppointmentForm: FormGroup;
  currentTab: number = 1;
  maxLength: number = 250;
  requirementDataFiltered: Requirement[] = [];
  requirementSearchControl = new FormControl();
  announcementImg: File | undefined;

  datafilerecords: User[] = [];
  dataGroupFile: NudgeGroup[] = [];
  dataGroupRecord: any[] = [];
  selectData: any[] = [];

  requirementData: Requirement[] = [];
  availableSlots: Slots[] = [];
  availableSlotsFiltered: Slots[] = [];
  availableSlotsSearchControl = new FormControl();
  slotCapacity: number;
  selectedCount: number = 0;
  groupUserCount: number = 0;

  pageableData: EmployeeSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
  };
  pageableDataGroup: nudgeGroupSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
  };
  canLoadMore: boolean = false;

  selectedSlotId: string;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private userservice: UserService,
    private router: Router,
    private communicationService: CommunicationService,
    private nudgeGroupsService: NudgeGroupsService,
    private requirementService: RequirementService,
    private ScheduleService: SchedulingService
  ) {
    this.createAppointmentForm = this.fb.group({
      title: ['', Validators.required],
      userGroup: ['Group'],
      nudgeMessage: ['', [Validators.maxLength(this.maxLength)]],
      requirementId: ['', Validators.required],
      // availableSlots: ['', Validators.required],
      isScheduledNudge: [false],
      dateTime: [''],
      userName: [''],
    });
  }

  ngOnInit(): void {
    this.searchGroupData(true);
    this.searchUserAnnouncement(true);
    this.getAllRequirement();
    this.requirementSearchControl.valueChanges.subscribe(() => {
      this.requirementData = this.filteredRequirementList();
    });

    this.createAppointmentForm.get('userName')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.searchOnCondition();
      }
    });
  }

  // Load users incrementally
  loadMore(): void {
    if (this.createAppointmentForm.get('userGroup').value === 'Users') {
      this.pageableData.page = this.pageableData.page + 1;
      this.searchUserAnnouncement(false);
    } else {
      this.pageableDataGroup.page = this.pageableDataGroup.page + 1;
      this.searchGroupData(false);
    }
  }

  get remainingChars(): number {
    const nudgeMessage = this.createAppointmentForm.get('nudgeMessage')?.value || '';
    return this.maxLength - nudgeMessage.length;
  }

  resetForm(): void {
    this.createAppointmentForm.reset();
    this.currentTab = 1;
  }

  trackByIndex(index: number): number {
    return index;
  }

  isFormValid(): boolean {
    return this.createAppointmentForm.valid;
  }

  nextTab(): void {
    if (!this.isFormValid()) {
      this.createAppointmentForm.markAllAsTouched();
      return;
    }
    this.currentTab++;
  }

  PreviousTab(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }

  onScheduleChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (!checkbox.checked) {
      this.createAppointmentForm.get('dateTime')?.setValue(null);
    }
  }

  resetAppointmentMessage(): void {
    this.createAppointmentForm.get('requirement')?.reset();
  }

  // Save the appointment
  saveAppointmentForm(): void {
    if (this.createAppointmentForm.valid) {
      const userGroup = this.createAppointmentForm.get('userGroup')?.value;
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
      const appointment: AppointmentModule = {
        email: '',
        appointmentId: '',
        name: '',
        sendToGroup: [],
        sendToUser: [],
        sendTo: this.createAppointmentForm.get('userGroup')?.value,
        messageText: this.createAppointmentForm.get('nudgeMessage')?.value,
        scheduleMessage: this.createAppointmentForm.get('isScheduledNudge')?.value,
        sendDate: this.createAppointmentForm.get('dateTime')?.value,
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        status: '',
        messageTitle: this.createAppointmentForm.get('title')?.value,
        reqId: this.createAppointmentForm.get('requirementId')?.value,
        readCount: 0,
        appMessageId: '',
      };

      if (this.selectData.length > 0 && this.createAppointmentForm.get('userGroup')?.value == 'Users') {
        appointment.sendToUser = this.selectData.map(userid => userid.id);
      } else if (this.dataGroupRecord.length > 0 && this.createAppointmentForm.get('userGroup')?.value == 'Group') {
        appointment.sendToGroup = this.dataGroupRecord.map(userGroupid => userGroupid.messageGroupId);
      } else {
        appointment.sendToUser = [];
        appointment.sendToGroup = [];
      }
      this.ScheduleService.saveAppointment(appointment).subscribe({
        next: response => {
          this.toaster.success(response.msg || 'Appointment Created successfully', 'Success!');
          this.router.navigate(['/dashboard/scheduling/appointments']);
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to Create Appointment';
          this.toaster.error(errorMessage, 'Error!');
        },
      });
    }
  }

  searchOnCondition() {
    if (this.createAppointmentForm.get('userGroup').value === 'Users') {
      this.searchUserAnnouncement(true);
    } else {
      this.searchGroupData(true);
    }
  }

  searchUserAnnouncement(clearData: boolean) {
    this.pageableData.employeeName = this.createAppointmentForm.get('userName')?.value;
    if (clearData) {
      this.datafilerecords = [];
      this.pageableData.page = 0;
    }
    this.userservice.searchAirman(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.datafilerecords = [...this.datafilerecords, ...responseData]; // Append new records
        if (responseData.length < this.pageableData.size) {
          this.canLoadMore = false; // Disable the "Load More" button if less than 30
        } else {
          this.canLoadMore = true; // Enable the "Load More" button if exactly 30
        }
      },
      error: error => {
        this.toaster.error('Unable to Load data', 'Error!');
      },
    });
  }

  searchGroupData(clearData: boolean) {
    this.pageableDataGroup.messageGroupName = this.createAppointmentForm.get('userName')?.value;
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

  // Requirement List
  getAllRequirement() {
    this.requirementService.getAllRequirements().subscribe({
      next: (data: Requirement[] | null) => {
        if (data && Array.isArray(data)) {
          this.requirementData = data;
          this.requirementDataFiltered = [...data];
        } else {
          this.requirementDataFiltered = [];
          this.requirementData = [];
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: err => {
        this.toaster.error('Failed to fetch Requirements.', 'Error');
        console.error('Error fetching users:', err);
      },
    });
  }
  filteredRequirementList() {
    const searchTerm = this.requirementSearchControl.value?.toLowerCase() || '';
    return this.requirementDataFiltered.filter(item => item.reqName.toLowerCase().includes(searchTerm));
  }

  // This function checks if we are within capacity
  canSelectUser(): boolean {
    return this.selectedCount < this.slotCapacity;
  }

  canGroupSelect(usercount: number): boolean {
    return usercount <= this.slotCapacity || usercount === this.slotCapacity;
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

  // Reset the list when user select another option for Group and User
  onGroupChanged(selectedValue: string): void {
    this.pageableData.page = 0;
    this.datafilerecords = [];
    this.dataGroupFile = [];

    if (selectedValue === 'Users') {
      this.dataGroupRecord = [];
      this.selectData = [];
      this.selectedCount = 0;
      this.searchUserAnnouncement(true);
    } else {
      this.dataGroupRecord = [];
      this.selectData = [];
      this.groupUserCount = 0;
      this.searchGroupData(true);
    }
  }

  getReqName() {
    const selectedReqId = this.createAppointmentForm.get('requirementId')?.value;
    const reqName = this.requirementData.find(item => item.id === selectedReqId);
    return reqName.reqName;
  }
}
