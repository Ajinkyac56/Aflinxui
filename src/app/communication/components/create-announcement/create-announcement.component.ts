import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Announcement } from '../../model/announcement.model';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { User } from 'src/app/user/model/user.model';
import { UserService } from 'src/app/services/components/user/user.service';
import { CommunicationService } from '../../service/communication.service';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { nudgeGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { Requirement } from 'src/app/requirements/model/requirement.model';
import { Router } from '@angular/router';
import { NudgeGroupsService } from '../../service/nudgeGroups/nudge-groups.service';
import { Slots } from 'src/app/scheduling/model/slots.model';
import { AppointmentConfilctDialogComponent } from '../appointment-conflict-dialog/appointment-conflict-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';
import { AppointmentModule } from 'src/app/scheduling/model/appointment.model';
import { AppointmentConflictDto } from '../../model/appointmentConflict';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css'],
})
export class CreateAnnouncementComponent implements OnInit {
  [x: string]: any;
  createAnnouncement: FormGroup;
  currentTab: number = 1;
  maxLength: number = 250;
  anouncementData: Announcement;
  fileSrc: any;
  announcementImg: File | undefined;
  requirementDataFiltered: Requirement[] = [];
  datafilerecords: User[] = [];
  dataGroupRecord: any[] = [];
  dataGroupFile: NudgeGroup[] = [];
  selectData: any[] = [];
  isView: boolean = false;
  isEdit: boolean = false;

  requirementList: Requirement[] = [];
  slotCapacity: number;
  selectedCount: number = 0;
  groupUserCount: number = 0;

  // Conflict Summary
  conflictSummary: AppointmentConflictDto;
  appointmentData: AppointmentModule;

  totalUser: number = 0;
  conflictUser: number = 0;
  conflictPercentage: number = 0;

  // Select Option type from Smart Dashboard
  optionType: string = '';

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

  selectedRequirementId: string;
  selectedSlotId: string;
  filename: any;

  minDate: string;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private userservice: UserService,
    private communicationService: CommunicationService,
    private nudgeGroupsService: NudgeGroupsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ScheduleService: SchedulingService
  ) {
    this.createAnnouncement = this.fb.group({
      title: ['', Validators.required],
      userGroup: ['Group'],
      nudgeMessage: ['', [Validators.maxLength(this.maxLength)]],
      startDate: [''],
      pollTextboxes: this.fb.array([]),
      documentLink: [''],
      attachDocument: [''],
      endDate: [''],
      isScheduledNudge: [false],
      link: [''],
      attachmentDocument: [''],
      dateTime: [''],
      userName: [''],
    });
  }

  ngOnInit(): void {
    // this.subscribeToOptionType();
    this.SearchGroupData(true);
    this.searchUserAnnouncement(true);
    this.createAnnouncement.get('userName')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.searchOnCondition();
      }
    });

    // validation for date selection
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16); // yyyy-MM-ddThh:mm

    // Configuring the auto enable of event
    this.route.queryParams.subscribe(params => {
      if (params['event'] === 'true') {
        this.optionType = 'Event';
      } else if (params['direct'] === 'true') {
        this.optionType = 'Direct';
      } else {
        this.optionType = ''; // Clear form control if no query param
      }
    });

    this.setValidatorsBasedOnOptionType();
  }

  setValidatorsBasedOnOptionType() {
    const startDateControl = this.createAnnouncement.get('startDate');
    const endDateControl = this.createAnnouncement.get('endDate');

    if (this.optionType === 'Event') {
      startDateControl?.setValidators([Validators.required]);
      endDateControl?.setValidators([Validators.required]);
    } else {
      startDateControl?.clearValidators();
      endDateControl?.clearValidators();
    }

    // Revalidate after setting/removing validators
    startDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }

  // Load users incrementally
  loadMore(): void {
    if (this.createAnnouncement.get('userGroup').value === 'Users') {
      this.pageableData.page = this.pageableData.page + 1;
      this.searchUserAnnouncement(false);
    } else {
      this.pageableDataGroup.page = this.pageableDataGroup.page + 1;
      this.SearchGroupData(false);
    }
  }

  get pollTextboxes(): FormArray {
    return this.createAnnouncement.get('pollTextboxes') as FormArray;
  }

  get remainingChars(): number {
    const nudgeMessage = this.createAnnouncement.get('nudgeMessage')?.value || '';
    return this.maxLength - nudgeMessage.length;
  }

  addTextbox(): void {
    this.pollTextboxes.push(this.fb.control('', Validators.required));
  }

  removeTextbox(index: number): void {
    this.pollTextboxes.removeAt(index);
  }

  addPollValidators(): void {
    this.pollTextboxes.controls.forEach(control => {
      control.setValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  resetPollOptions(): void {
    this.pollTextboxes.clear();
  }

  resetForm(): void {
    this.createAnnouncement.reset();
    this.pollTextboxes.clear();
    this.currentTab = 1;
  }

  trackByIndex(index: number): number {
    return index;
  }

  isFormValid(): boolean {
    return this.createAnnouncement.valid;
  }

  nextTab(): void {
    if (!this.isFormValid()) {
      this.createAnnouncement.markAllAsTouched();
      return;
    }
    this.currentTab++;
    this.checkConflict();
  }

  PreviousTab(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }

  onScheduleChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (!checkbox.checked) {
      this.createAnnouncement.get('dateTime')?.setValue(null);
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
      if (this.optionType === 'Event') {
        this.checkConflict();
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
      if (this.optionType === 'Event') {
        this.checkConflict();
      }
    }
  }

  onRadioButtonChange(): void {
    // Reset both Attachment and Link when the radio button changes
    const documentLink = this.createAnnouncement.get('documentLink')?.value;
    if (documentLink === 'AttachDocument') {
      // Reset the Link input when AttachDocument is selected
      this.createAnnouncement.get('link')?.reset();
    } else if (documentLink === 'InsertLink') {
      // Reset the Attachment input when InsertLink is selected
      this.createAnnouncement.get('attachmentDocument')?.reset();
    }
  }

  restEventMessage(): void {
    this.createAnnouncement.get('startDate')?.reset();
    this.createAnnouncement.get('endDate')?.reset();
  }

  // Save the Announcement
  saveAnnouncementForm(): void {
    if (this.createAnnouncement.valid) {
      const userGroup = this.createAnnouncement.get('userGroup')?.value;
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
      const startDate = this.createAnnouncement.get('startDate')?.value || ''; // Extracted start date
      const endDate = this.createAnnouncement.get('endDate')?.value || ''; // Extracted end date

      // Extract time from the start and end dates
      const startTime = startDate ? this.extractTime(startDate) : '';
      const endTime = endDate ? this.extractTime(endDate) : '';
      const combinedTime = `${startTime} - ${endTime}`;

      const announce: Announcement = {
        id: '',
        sendToGroup: [],
        sendToUser: [],
        sendTo: this.createAnnouncement.get('userGroup')?.value,
        messageType: this.optionType,
        messageText: this.createAnnouncement.get('nudgeMessage')?.value,
        scheduleMessage: this.createAnnouncement.get('isScheduledNudge')?.value,
        sendDate: this.createAnnouncement.get('dateTime')?.value || '',
        isUrgent: true,
        isAttachments: this.createAnnouncement.get('attachDocument')?.value,
        attachments: this.createAnnouncement.get('attachmentDocument')?.value || '',
        link: this.createAnnouncement.get('link')?.value || '',
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        isDelete: true,
        status: '',
        messageTitle: this.createAnnouncement.get('title')?.value,
        startDate: startDate,
        endDate: endDate,
        messagePollOptionsList: this.createAnnouncement.get('pollTextboxes')?.value.map((pollOptionName, index) => ({
          pollOptionId: null,
          optionNumber: index + 1,
          messageDetailId: null,
          pollOptionName: pollOptionName,
        })),
      };
      if (this.selectData.length > 0 && this.createAnnouncement.get('userGroup')?.value == 'Users') {
        announce.sendToUser = this.selectData.map(userid => userid.id);
      } else if (this.dataGroupRecord.length > 0 && this.createAnnouncement.get('userGroup')?.value == 'Group') {
        announce.sendToGroup = this.dataGroupRecord.map(userGroupid => userGroupid.messageGroupId);
      } else {
        announce.sendToUser = [];
        announce.sendToGroup = [];
      }
      if (this.optionType === 'Event') {
        if (this.conflictSummary.conflictPercentage > 50) {
          this.confilctDialog(combinedTime, this.appointmentData, announce);
          return;
        }
      }
      this.communicationService.saveAnnouncement(announce).subscribe({
        next: response => {
          this.toaster.success(response.msg || 'Announcement Created successfully', 'Success!');
          this.router.navigate(['/dashboard/communication/announcements']);
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to Create Announcement';
          this.toaster.error(errorMessage, 'Error!');
        },
      });
    }
  }
  // Extracting the time
  extractTime(date: string): string {
    const dateObject = new Date(date);
    const dateConfig: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return dateObject.toLocaleTimeString('en-US', dateConfig);
  }

  generatePollOptionId(index: number): string {
    return 'poll-option-' + (index + 1);
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload($event: any) {
    const file = $event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        this.toaster.error('Only PDF, PNG, and JPEG files are allowed.');
        return;
      }
      this.createAnnouncement.patchValue({ file });
      const reader = new FileReader();
      reader.onload = () => (this.fileSrc = reader.result);
      reader.readAsDataURL(file);
      this.filename = file.name;
      this.toaster.success('File uploaded successfully!');
    }
  }

  searchOnCondition() {
    if (this.createAnnouncement.get('userGroup').value === 'Users') {
      this.searchUserAnnouncement(true);
    } else {
      this.SearchGroupData(true);
    }
  }

  searchUserAnnouncement(clearData: boolean) {
    this.pageableData.employeeName = this.createAnnouncement.get('userName')?.value;
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
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }

  SearchGroupData(clearData: boolean) {
    this.pageableDataGroup.messageGroupName = this.createAnnouncement.get('userName')?.value;
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
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
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
      this.SearchGroupData(true);
    }
  }

  // open Conflict dialog box
  confilctDialog(combinedTime, appointmentData: AppointmentModule, announcementData: Announcement): void {
    const dialogRef = this.dialog.open(AppointmentConfilctDialogComponent, {
      width: '750px',
      data: { timeRange: combinedTime, appointmentData: appointmentData, announcementData: announcementData },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isConfirmed && result.selectedTime) {
        const selectedtime = result.selectedTime;
      }
    });
  }

  // reset
  resetFilter(): void {}

  checkConflict() {
    var appointment: AppointmentModule = {
      email: '',
      appointmentId: '',
      name: '',
      sendToGroup: [],
      sendToUser: [],
      messageText: '',
      scheduleMessage: null,
      startDate: this.createAnnouncement.get('startDate')?.value,
      endDate: this.createAnnouncement.get('endDate')?.value,
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      updatedBy: '',
      status: '',
      messageTitle: '',
      readCount: 0,
      appMessageId: '',
      reqId: '',
      sendDate: '',
    };

    if (this.selectData.length > 0 && this.createAnnouncement.get('userGroup')?.value == 'Users') {
      appointment.sendToUser = this.selectData.map(userid => userid.id);
    } else if (this.dataGroupRecord.length > 0 && this.createAnnouncement.get('userGroup')?.value == 'Group') {
      appointment.sendToGroup = this.dataGroupRecord.map(userGroupid => userGroupid.messageGroupId);
    } else {
      appointment.sendToUser = [];
      appointment.sendToGroup = [];
    }
    this.appointmentData = appointment;
    this.ScheduleService.checkAppointmentConflict(appointment).subscribe({
      next: response => {
        this.conflictSummary = response;
      },
    });
  }
}
