import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementService } from 'src/app/communication/service/announcement/announcement.service';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { ScheduleSlotDialogComponent } from 'src/app/my-message/components/schedule-slot-dialog/schedule-slot-dialog.component';
import { Slots } from 'src/app/scheduling/model/slots.model';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';

@Component({
  selector: 'app-event-view-dialog',
  templateUrl: './event-view-dialog.component.html',
  styleUrls: ['./event-view-dialog.component.css'],
})
export class EventViewDialogComponent implements OnInit {
  formattedStartDate: string;
  formattedEndDate: string;
  hasSlots: boolean;
  appointment_Type: boolean;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private userDataService: UserSharedDataService,
    private toastr: ToastrService,
    private announcement: AnnouncementService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private ScheduleService: SchedulingService,
    private communicationService: CommunicationService,
    public dialogRef: MatDialogRef<EventViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const startDate = new Date(this.data.event.start);
    const endDate = new Date(this.data.event.end);
    this.formattedStartDate = this.datePipe.transform(startDate, 'MM/dd/yyyy HH:mm');
    this.formattedEndDate = this.datePipe.transform(endDate, 'MM/dd/yyyy HH:mm');
    this.appointment_Type = this.data.event.extendedProps.appointmentType !== 'Event';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onClick(data: any) {
    const dialogRef1 = this.dialog.open(ScheduleSlotDialogComponent, {
      width: 'auto',
      data: {
        info: data,
        isEventReschedule: true,
        isAppointmetReschedule: false,
      },
    });
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close();
      }
    });
  }
}
