import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { bookSlot, Slots } from 'src/app/scheduling/model/slots.model';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';

@Component({
  selector: 'app-appointment-conflict-dialog',
  templateUrl: './appointment-conflict-dialog.component.html',
  styleUrls: ['./appointment-conflict-dialog.component.css'],
})
export class AppointmentConfilctDialogComponent implements OnInit {
  appointmentConfictForm: FormGroup;
  slotList: Slots[] = [];
  selectedRequirementId: string;
  selectedSlotId: string;
  availableTime: string[] = [];
  availableTimeFiltered: string[] = [];
  selectSuggestedTime: string | '';
  selectSuggestedTimeSearchControl = new FormControl();
  constructor(
    private toaster: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private ScheduleService: SchedulingService,
    private communicationService: CommunicationService,
    public dialogRef1: MatDialogRef<AppointmentConfilctDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointmentConfictForm = this.fb.group({
      suggestedDate: ['', Validators.required],
      selectSuggestedTime: [''],
    });
  }
  ngOnInit(): void {
    this.loadAvailableTime();
    this.selectSuggestedTimeSearchControl.valueChanges.subscribe(() => {
      this.availableTime = this.filteredRequirementList();
    });
  }

  closeDialog(isTrue: boolean): void {
    this.dialogRef1.close({
      isConfirmed: isTrue,
      selectedTime: this.selectSuggestedTime,
    });
  }

  loadAvailableTime() {
    this.ScheduleService.conflictAvailableTime(this.data.appointmentData).subscribe({
      next: response => {
        this.availableTime = response;
        this.availableTimeFiltered = this.availableTime.slice();
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Slot Is Not Available';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }
  filteredRequirementList() {
    const searchTerm = this.selectSuggestedTimeSearchControl.value?.toLowerCase() || '';
    return this.availableTimeFiltered.filter(item => item.toLowerCase().includes(searchTerm));
  }
  onTimeSelect(event: any): void {
    this.selectSuggestedTime = event.value;
  }

  onSchedule() {
    this.saveAnnouncement(this.data.announcementData, 'Announcement Created successfully');
  }

  onReschedule() {
    if (!this.selectSuggestedTime || !this.isValidTimeRange(this.selectSuggestedTime)) {
      this.toaster.error('Please select a valid time range (HH:mm - HH:mm).', 'Error!');
      return;
    }

    const [startTime, endTime] = this.selectSuggestedTime.split(' - ');

    // Ensure startDate and endDate exist
    if (!this.data.announcementData.startDate || !this.data.announcementData.endDate) {
      this.toaster.error('Invalid start or end date.', 'Error!');
      return;
    }

    const startDate = this.updateTimeInDate(this.data.announcementData.startDate, startTime);
    const endDate = this.updateTimeInDate(this.data.announcementData.endDate, endTime);

    if (!startDate || !endDate) {
      this.toaster.error('Invalid date or time values.', 'Error!');
      return;
    }

    // Update announcementData with new times
    this.data.announcementData.startDate = startDate;
    this.data.announcementData.endDate = endDate;

    this.saveAnnouncement(this.data.announcementData, 'Announcement Rescheduled successfully');
  }

  // update the time in the date
  private updateTimeInDate(dateString: string, time: string): string | null {
    // Extract the date part (YYYY-MM-DD)
    const datePart = dateString.split('T')[0];

    if (!datePart) {
      console.error('Invalid date format:', dateString);
      return null;
    }

    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error('Invalid time format:', time);
      return null;
    }

    // Return new date-time string in the same format "YYYY-MM-DDTHH:mm"
    return `${datePart}T${time}`;
  }

  private isValidTimeRange(timeRange: string): boolean {
    return /^\d{2}:\d{2} - \d{2}:\d{2}$/.test(timeRange);
  }

  // Function For save Announcement
  saveAnnouncement(announcementData: any, successMessage: string): void {
    this.communicationService.saveAnnouncement(announcementData).subscribe({
      next: response => {
        this.toaster.success(response.msg || successMessage, 'Success!');
        this.closeDialog(true);
        this.router.navigate(['/dashboard/communication/announcements']);
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Failed to Create Announcement';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }
}
