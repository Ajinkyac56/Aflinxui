import { Component } from '@angular/core';
import { AppointmentModule } from '../../model/appointment.model';
import { SchedulingService } from '../../service/scheduling.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Slots } from '../../model/slots.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { appointmentSearchDto } from 'src/app/models/SearchCondition.model';
import { RequirementService } from 'src/app/requirements/service/requirement.service';
import { Requirement } from 'src/app/requirements/model/requirement.model';
import { environment } from 'src/environments/environment';
import { AppointmentDetailsDialogComponent } from '../appointment-details-dialog/appointment-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent {
  selectedAppointment: AppointmentModule[] = [];
  appointmentList: AppointmentModule[] = [];
  requirementList: Requirement[] = [];
  slotList: Slots[] = [];
  noMoreRecords: boolean = false;

  pageableData: appointmentSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  appointmentForm: FormGroup;
  canLoadMore: boolean;
  expandAction: boolean;

  constructor(
    private toaster: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private requirementService: RequirementService,
    private ScheduleService: SchedulingService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      appointmentSearch: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.getAllRequirement();
    this.searchAppointment(true);
    this.getAllSlots();
    this.appointmentForm.get('appointmentSearch')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.searchAppointment(true);
      }
    });
  }

  // Requirement List
  getAllRequirement() {
    this.requirementService.getAllRequirements().subscribe({
      next: responseData => {
        this.requirementList = responseData;
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
        // this.toaster.error('Unable to Load Data', 'Error!');
      },
    });
  }

  getRequirementName(id: string): string {
    const item = this.requirementList.filter(s => s.id === id);
    return item.length === 1 ? item[0].reqName : '';
  }

  getAllSlots() {
    this.ScheduleService.getSlotList().subscribe({
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

  searchAppointment(clearData: boolean) {
    this.pageableData.messageTitle = this.appointmentForm.get('appointmentSearch')?.value;
    if (clearData) {
      this.appointmentList = [];
      this.pageableData.page = 0;
    }
    this.ScheduleService.searchAppointment(this.pageableData).subscribe({
      next: responseData => {
        this.appointmentList = responseData;
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }

  resetFilter(): void {
    this.appointmentForm.reset();
    this.searchAppointment(true);
  }

  getAppointmentName(appointmentId: string): string {
    const appointment = this.appointmentList.filter(s => s.appMessageId === appointmentId);
    return appointment.length === 1 ? appointment[0].messageTitle : '';
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.appointment-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedAppointment = [...this.appointmentList];
      } else {
        this.selectedAppointment = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedAppointment.push(item);
      } else {
        const index = this.selectedAppointment.findIndex(data => data.messageTitle == item.messageTitle);
        if (index >= 0) {
          this.selectedAppointment.splice(index, 1);
        }
      }
    }
  }

  onViewClick(data: AppointmentModule) {
    this.router.navigate(['/dashboard/scheduling/view-appointments'], {
      state: {
        isView: true,
        data: data,
      },
    });
  }

  appointmentDetails(data?: AppointmentModule): void {
    const dialogRef = this.dialog.open(AppointmentDetailsDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: data,
    });
  }

  downloadTableData(): void {
    const csvData = this.appointmentList.map(appointment => ({
      Title: appointment.messageTitle,
      // 'Requirement': this.getRequirementName(appointment.reqId),
      Requirement: appointment.requirementName,
      Slot: this.getSlotDate(appointment.slotId),
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(value => `"${value}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchAppointment(false);
  }

  onEditClick() {}

  onActiveClick() {}
  onInActiveClick() {}
}
