import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/user/model/user.model';
import { MessageDialogComponent } from './message-dialog/messageview-dialog.component';
import { messageDto } from '../model/messageDto.model';
import { AnnouncementService } from 'src/app/communication/service/announcement/announcement.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { CommunicationService } from 'src/app/communication/service/communication.service';
import { SchedulingService } from 'src/app/scheduling/service/scheduling.service';
import { RequirementModel } from 'src/app/communication/model/requirement.model';
import { AppointmentsComponent } from 'src/app/scheduling/components/appointments/appointments.component';
import { RequirementService } from 'src/app/requirements/service/requirement.service';
import { Requirement } from 'src/app/requirements/model/requirement.model';
import { ScheduleSlotDialogComponent } from './schedule-slot-dialog/schedule-slot-dialog.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-my-profile',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnInit {
  userId: string;
  user: User;
  canLoadMore: boolean;
  messageListForm: FormGroup;
  messageList: messageDto[] = [];
  requirementList: Requirement[] = [];
  expandAction: boolean;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private announcement: AnnouncementService,
    private toaster: ToastrService,
    private ScheduleService: SchedulingService,
    private requirementService: RequirementService,
    private router: Router,
    private userDataService: UserSharedDataService
  ) {
    this.messageListForm = this.fb.group({
      userName: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.getUserId();
    this.getMessageList(this.userId);
    this.getRequirementList();
  }
  getUserId() {
    this.userId = this.userDataService.getUserId();
  }
  // Load more users for pagination
  loadMore(): void {
    // this.pageableData.page += 1;
    // this.searchUserNudgeGroup(false); // Fixed: Do not reset data
  }

  onViewClick(data?: messageDto): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: data,
    });
  }

  selectSlotClick(data?: messageDto): void {
    const dialogRef1 = this.dialog.open(ScheduleSlotDialogComponent, {
      width: 'auto',
      data: {
        info: data,
        isEventReschedule: false,
        isAppointmetReschedule: true,
      },
    });
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        this.getUserId();
        this.getMessageList(this.userId);
      }
    });
  }

  getMessageList(userId: string) {
    this.announcement.messageList(userId).subscribe({
      next: responseData => {
        this.messageList = responseData;
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }

  // Requirement List
  getRequirementList() {
    this.requirementService.getAllRequirements().subscribe({
      next: responseData => {
        this.requirementList = responseData;
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }

  getRequirementName(id: string): string {
    const item = this.requirementList.filter(s => s.id === id);
    return item.length === 1 ? item[0].reqName : '';
  }
}
