import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementService } from 'src/app/communication/service/announcement/announcement.service';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { ScheduleSlotDialogComponent } from 'src/app/my-message/components/schedule-slot-dialog/schedule-slot-dialog.component';
import { Slots } from 'src/app/scheduling/model/slots.model';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { AnnouncementResponse } from '../../model/announcement.model';

@Component({
  selector: 'app-view-response-dialog',
  templateUrl: './view-response-dialog.component.html',
  styleUrls: ['./view-response-dialog.component.css'],
})
export class ResponseViewDialogComponent implements OnInit {
  getPollResponse: AnnouncementResponse[] = [];
  userListResponse: any[] = [];
  pollResponsePercentage: any[] = []; // getting the poll Response in percentage
  selectedPollOptionName: string = '';
  messageType: string;
  form: FormGroup;
  // pollAnswerControl: FormControl;
  pollProgressPercentage: 50;
  messageDetailId: string;

  getPollResponseTrial = [
    { pollOptionId: 1, pollOptionName: 'Option 1', votes: 50 },
    { pollOptionId: 2, pollOptionName: 'Option 2', votes: 30 },
    { pollOptionId: 3, pollOptionName: 'Option 3', votes: 20 },
  ];

  totalVotes = 100; // Total votes

  constructor(
    private fb: FormBuilder,
    private announcement: AnnouncementService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<ResponseViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadPollResponse();
    this.getUserResponseList();
    // this.pollAnswerControl = new FormControl(this.userListResponse[0].pollAnswer);

    // Define the form group
    this.form = this.fb.group({
      response: [''], // for OpenResponse type
    });
    this.getPollOptionName();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  loadPollResponse() {
    this.announcement.getResponseList().subscribe({
      next: (responseData: any) => {
        this.getPollResponse = responseData;
      },
      error: () => {
        this.toaster.error('Unable to Load Response', 'Error!');
      },
    });
  }

  getUserResponseList() {
    const userid = this.data.id;
    const messageuserid = this.data.userId1;
    this.announcement.MessageUserList(messageuserid, userid).subscribe({
      next: (responseData: any) => {
        this.userListResponse = responseData;
        this.messageType = this.userListResponse[0].messageType;
      },
      error: () => {
        this.toaster.error('Unable to Load User Response List', 'Error!');
      },
    });
  }

  getPollOptionName() {
    const pollAnswerId = this.userListResponse[0].pollAnswer; // Get the selected poll option ID
    const matchingPollOption = this.getPollResponse.find(option => option.pollOptionId === pollAnswerId);
    return matchingPollOption ? matchingPollOption.pollOptionName : 'No Answer';
    // return matchingPollOption ? matchingPollOption.pollOptionId : null;
  }

  // Get response percentage of poll
  // getPollResponsePercentage() {
  //   this.messageDetailId = this.getPollResponse[0].messageDetailId;
  //   this.announcement.getResponsePercentange(this.messageDetailId).subscribe({
  //     next: (responseData: any) => {
  //       const roundedResponse: any = {};
  //       for (const key in responseData) {
  //         if (responseData.hasOwnProperty(key)) {
  //           roundedResponse[key] = Math.round(responseData[key]);
  //         }
  //       }
  //       this.pollResponsePercentage = roundedResponse;
  //     },
  //     error: () => {
  //       this.toaster.error('Poll not selected');
  //     }
  //   })
  // }
}
