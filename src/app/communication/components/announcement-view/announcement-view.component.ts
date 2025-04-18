import { Component, OnInit } from '@angular/core';
import { AnnouncementList, AnnouncementResponse, User } from '../../model/announcement.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { Location } from '@angular/common';
import { announcementUserSearchDto } from 'src/app/models/SearchCondition.model';
import { AnnouncementService } from '../../service/announcement/announcement.service';
import { ResponseViewDialogComponent } from '../view-response-dialog/view-response-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GraphSummaryViewComponent } from '../graph-summary-view/graph-summary-view.component';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.css'],
})
export class AnnouncementViewComponent implements OnInit {
  userSearchForm: FormGroup;
  announcementList: AnnouncementList;
  announcementUserList: User[] = [];
  selectedAnnouncementUserList: User[] = [];
  isView: boolean;
  imageSrc: any = 'assets/images/profile/user-1.jpg';
  hasAccessToDelete: boolean = false;
  noMoreRecords: boolean = false;

  // Getting poll Response
  getPollResponse: AnnouncementResponse[] = [];
  pollResponsePercentage: any[] = [];
  messageDetailId: string;

  pageableData: announcementUserSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  constructor(
    private location: Location,
    private announcementService: AnnouncementService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.userSearchForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initView();
    this.searchAnnouncementUser(true);
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.announcementList = currentState.data;
  }

  searchAnnouncementUser(clearData: boolean) {
    this.pageableData.name = this.userSearchForm.get('name')?.value;
    this.pageableData.id = this.announcementList.id;

    if (clearData) {
      this.announcementUserList = [];
      this.pageableData.page = 0;
    }

    this.announcementService.searchUserGroupList(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.announcementUserList = [...this.announcementUserList, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Airman List', 'Error!');
      },
    });
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.announcement-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedAnnouncementUserList = [...this.announcementUserList];
      } else {
        this.selectedAnnouncementUserList = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedAnnouncementUserList.push(item);
      } else {
        const index = this.selectedAnnouncementUserList.findIndex(data => data.id == item.id);
        if (index >= 0) {
          this.selectedAnnouncementUserList.splice(index, 1);
        }
      }
    }
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchAnnouncementUser(false);
  }

  resetFilter() {
    this.userSearchForm.reset();
    this.searchAnnouncementUser(true);
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

  downloadTableData(): void {
    const csvData = this.announcementUserList.map(nudgeGroup => ({
      'First Name': nudgeGroup.firstName,
      'Last Name': nudgeGroup.lastName,
      Email: nudgeGroup.email,
      Role: nudgeGroup.role,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'announcement_user_list.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(objArray: any[]): string {
    const header = Object.keys(objArray[0]).join(',');
    const rows = objArray.map(obj => Object.values(obj).join(','));
    return [header, ...rows].join('\n');
  }

  onViewClick(announcement: any) {
    const dialogRef = this.dialog.open(ResponseViewDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: announcement,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  onSummaryShow() {
    const dialogRef1 = this.dialog.open(GraphSummaryViewComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        msgId: this.announcementList.id,
      },
    });
  }
}
