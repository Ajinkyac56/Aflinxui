import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { bookSlot, Slots } from 'src/app/scheduling/model/slots.model';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';

@Component({
  selector: 'app-schedule-slot-dialog',
  templateUrl: './schedule-slot-dialog.component.html',
  styleUrls: ['./schedule-slot-dialog.component.css'],
})
export class ScheduleSlotDialogComponent implements OnInit {
  scheduleForm: FormGroup;
  selectedReqId: string;
  slotList: Slots[] = [];
  selectedSlotId: string;
  availableSlots: Slots[] = [];
  availableSlotsFiltered: Slots[] = [];
  availableSlotsSearchControl = new FormControl();
  constructor(
    private toaster: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private ScheduleService: SchedulingService,
    private communicationService: CommunicationService,
    public dialogRef1: MatDialogRef<ScheduleSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scheduleForm = this.fb.group({
      availableSlots: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.selectionOfReqId();
    this.availableSlotsSearchControl.valueChanges.subscribe(() => {
      this.availableSlots = this.filteredSlotsList();
    });
  }

  closeDialog(isTrue: boolean): void {
    this.dialogRef1.close(isTrue);
  }

  selectionOfReqId() {
    if (this.data.isAppointmetReschedule) {
      this.selectedReqId = this.data.info.reqId;
    } else {
      this.selectedReqId = this.data.info.extendedProps.reqId;
    }
    this.loadAvailableSlots();
  }

  loadAvailableSlots() {
    // Fetch the available slots based on requirement ID
    this.communicationService.getSlotById(this.selectedReqId).subscribe({
      next: (Finalslots: Slots[]) => {
        this.availableSlots = Finalslots.map(slot => {
          const startDateTime = new Date(slot.start_date_time);
          // const formattedStartDateTime = startDateTime.toISOString().split('T')[0] + ' ' + startDateTime.toTimeString().split(' ')[0];
          const formattedStartDateTime = this.formatDate(slot.start_date_time);
          return {
            ...slot,
            start_date_time: formattedStartDateTime, // Replace the original date with the formatted one
          };
        });
        this.availableSlotsFiltered = this.availableSlots.slice();
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Available Slots';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }
  filteredSlotsList() {
    const searchTerm = this.availableSlotsSearchControl.value?.toLowerCase() || '';
    return this.availableSlotsFiltered.filter(item => item.start_date_time.toLowerCase().includes(searchTerm));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Using Intl.DateTimeFormat to format the date
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);

    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hours, minutes, secondsAndAMPM] = timePart.split(':');

    // Return the formatted date in "YYYY-MM-DD hh:mm:ss" format
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  airmanBookSlot() {
    if (this.scheduleForm.valid) {
      const selectedAppMessageId = this.getValueOnCondition('appMessageId');
      const sendusers = this.getValueOnCondition('userId');

      const ScheduleSlot: bookSlot = {
        sendToGroup: [],
        sendToUser: [sendusers],
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        status: '',
        reqId: this.selectedReqId,
        slotId: this.selectedSlotId,
        readCount: 0,
        appMessageId: selectedAppMessageId,
        messageText: '',
        scheduleMessage: true,
      };
      this.ScheduleService.saveslotAppointment(ScheduleSlot).subscribe({
        next: response => {
          this.toaster.success(response.msg || 'Slot Assigned successfully', 'Success!');
          this.closeDialog(true);
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to Assigned Slot';
          this.toaster.error(errorMessage, 'Error!');
        },
      });
    }
  }

  //Get the Value based on the Conditions
  private getValueOnCondition(property: string) {
    return this.data.isAppointmetReschedule ? this.data.info[property] : this.data.info.extendedProps[property];
  }

  onSlotSelected(event: any) {
    this.selectedSlotId = event.value; // Store the selected slot ID
  }
}
