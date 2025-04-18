import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementService } from 'src/app/communication/service/announcement/announcement.service';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { Slots } from 'src/app/scheduling/model/slots.model';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { MyMessageService } from '../service/my-message.service';
import { Announcement } from 'src/app/communication/model/announcement.model';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './messageview-dialog.component.html',
  styleUrls: ['./messageview-dialog.component.css'],
})
export class MessageDialogComponent implements OnInit {
  OpenResponse: FormGroup;
  slotList: Slots[] = [];
  pollOption: Announcement[];
  pollOptions: { pollOptionId: string; optionNumber: number; pollOptionName: string }[] = [];
  messageTitle: string = '';
  selectedPollOptionId: string | null = null;
  selectedMessageUserId: any;
  selectedOpenResponse: any;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private announcementService: AnnouncementService,
    private toaster: ToastrService,
    private ScheduleService: SchedulingService,
    private messageService: MyMessageService,
    private communicationService: CommunicationService,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.OpenResponse = this.fb.group({
      response: [''],
    });
  }

  ngOnInit(): void {
    this.getAllSlots();
    this.getMessage();
    this.updateViewStatus();
  }

  closeDialog(): void {
    this.dialogRef.close();
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
      },
    });
  }

  getMessage() {
    const { messageDetailId, messageType, userId } = this.data;
    this.messageService.getMessage(messageDetailId, messageType, userId).subscribe({
      next: (responseData: Announcement[]) => {
        const pollOptions = responseData[0]?.messagePollOptionsList || [];
        this.pollOptions = pollOptions;
        this.messageTitle = responseData[0]?.messageTitle || '';
      },
      error: errorResponse => {},
    });
  }

  updateViewStatus() {
    const { messageDetailId, userId, messageType, appMessageId } = this.data;

    if (messageType === 'Appointment') {
      this.ScheduleService.updateViewStatus(appMessageId, userId).subscribe();
    } else {
      this.announcementService.updateViewStatus(messageDetailId, userId).subscribe();
    }
  }

  getSlotDate(slotId: string): string {
    const item = this.slotList.filter(s => s.slots_id === slotId);
    return item.length === 1 ? item[0].start_date_time : '';
  }

  onPollOptionSelect(pollOptionId: string) {
    const selectedOption = this.pollOptions.find(option => option.pollOptionId === pollOptionId);
    if (selectedOption) {
      // Fetch and store each value separately
      this.selectedPollOptionId = selectedOption.pollOptionId;
      this.selectedOpenResponse = selectedOption.pollOptionName;
    }
  }

  submitResponse() {
    // Check the message type and set values accordingly
    let openResponseValue = '';
    let directValue = '';
    let pollIdValue = '';

    if (this.data.messageType === 'Poll') {
      openResponseValue = null;
      directValue = null;
    } else if (this.data.messageType === 'Direct') {
      directValue = 'GotIt';
    } else if (this.data.messageType === 'OpenResponse') {
      openResponseValue = this.OpenResponse.get('response')?.value;
    }

    const pollData = {
      messageUserId: this.data.messageUserId,
      pollOptionId: this.selectedPollOptionId,
      openResponse: openResponseValue,
      direct: directValue,
      pollId: pollIdValue,
    };

    this.messageService.submitPollFeedback(pollData).subscribe({
      next: response => {
        this.toaster.success(response.msg || 'Response Send', 'Success!');
        this.closeDialog();
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Failed to Send Response';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }

  // This method returns true if the submit button should be disabled, false otherwise
  isSubmitDisabled(): boolean {
    if (this.data.messageType === 'Direct') {
      return false;
    }

    if (this.data.messageType === 'Poll') {
      return this.selectedPollOptionId === null;
    }

    if (this.data.messageType === 'OpenResponse') {
      return this.OpenResponse.get('response')?.value.trim() === '';
    }
    return false;
  }
}
