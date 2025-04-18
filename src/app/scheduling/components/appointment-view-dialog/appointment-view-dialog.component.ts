import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentModule, AppointmentUser } from '../../model/appointment.model';
import { appointmentSearchDto, appointmentUserSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SchedulingService } from '../../service/scheduling.service';
import { ToastrService } from 'ngx-toastr';
import { DownloadService } from 'src/app/services/download/download.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Slots } from '../../model/slots.model';

@Component({
  selector: 'app-appointment-view-dialog',
  templateUrl: './appointment-view-dialog.component.html',
  styleUrl: './appointment-view-dialog.component.css',
})
export class AppointmentViewDialogComponent {
  SearchForm: FormGroup;
  announcementList: AppointmentModule;
  appointmentUserList: AppointmentUser[] = [];
  slotList: Slots[] = [];
  selectedAppointmentUserList: AppointmentUser[] = [];
  isView: boolean;
  imageSrc: any = 'assets/images/profile/user-1.jpg';
  hasAccessToDelete: boolean = false;
  noMoreRecords: boolean = false;
  pageableData: appointmentUserSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  constructor(
    private location: Location,
    private schedulingService: SchedulingService,
    private toaster: ToastrService,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.SearchForm = this.fb.group({
      appointmentId: ['', Validators.required],
      name: [''],
    });
  }

  ngOnInit(): void {
    this.initView();
    this.getAllSlots();
    this.searchAppointmentUser(true);
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.announcementList = currentState.data;
  }

  searchAppointmentUser(clearData: boolean) {
    this.pageableData.name = this.SearchForm.get('name')?.value;
    this.pageableData.appointmentId = this.announcementList.appointmentId;

    if (clearData) {
      this.appointmentUserList = [];
      this.pageableData.page = 0;
    }

    this.schedulingService.searchUserAppointmentList(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.appointmentUserList = [...this.appointmentUserList, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Airman List', 'Error!');
      },
    });
  }

  getAllSlots() {
    this.schedulingService.getSlotList().subscribe({
      next: (Finalslots: Slots[]) => {
        this.slotList = Finalslots.map(slot => {
          const startDateTime = new Date(slot.start_date_time);
          const formattedStartDateTime = startDateTime.toISOString().split('T')[0] + ' ' + startDateTime.toTimeString().split(' ')[0];
          return {
            ...slot,
            start_date_time: formattedStartDateTime,
          };
        });
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Slot Data';
        this.toaster.error(errorMessage, 'Error!');
        // this.toaster.error('Unable to Load Available Slots', 'Error!');
      },
    });
  }

  getSlotDate(slotId: string): string {
    const item = this.slotList.filter(s => s.slots_id === slotId);
    return item.length === 1 ? item[0].start_date_time : '';
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.announcement-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedAppointmentUserList = [...this.appointmentUserList];
      } else {
        this.selectedAppointmentUserList = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedAppointmentUserList.push(item);
      } else {
        const index = this.selectedAppointmentUserList.findIndex(data => data.appointmentId == item.appointmentId);
        if (index >= 0) {
          this.selectedAppointmentUserList.splice(index, 1);
        }
      }
    }
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchAppointmentUser(false);
  }

  resetFilter() {
    this.SearchForm.reset();
    this.searchAppointmentUser(true);
  }

  // deleteUserGroup(groupUserId: string) {
  //   const isDelete = 0;
  //   this.nudgeUserGroupsService.deleteUserGroupList(groupUserId, isDelete).subscribe({
  //     next: () => {
  //       this.toaster.success('Airman Deleted Successfully');
  //       this.searchAnnouncementUser(true);
  //     },
  //   });
  // }
}
