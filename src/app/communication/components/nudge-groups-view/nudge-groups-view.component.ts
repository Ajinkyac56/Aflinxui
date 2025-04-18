import { Component, OnInit } from '@angular/core';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { Location } from '@angular/common';
import { nudgeUserGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { NudgeUserGroup } from '../../model/nudgeUserGroup.model';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloadService } from 'src/app/services/download/download.service';
import { NudgeUserGroupsService } from '../../service/nudgeUserGroups/nudge-user-groups.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { UserListDialogComponent } from '../userlist-dialoge/userlist-dialoge.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-nudge-groups-view',
  templateUrl: './nudge-groups-view.component.html',
  styleUrls: ['./nudge-groups-view.component.css'],
})
export class NudgeGroupsViewComponent implements OnInit {
  nudgeSearchForm: FormGroup;
  nudgeGroupsList: NudgeGroup;
  nudgeUserGroupsList: NudgeUserGroup[] = [];
  isView: boolean;
  selectData: NudgeUserGroup[] = [];
  imageSrc: any = 'assets/images/profile/user-1.jpg';
  hasAccessToDelete: boolean = false;
  noMoreRecords: boolean = false;

  pageableData: nudgeUserGroupSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  expandAction: boolean;
  hasAccessToAdd: boolean;

  constructor(
    private location: Location,
    private nudgeUserGroupsService: NudgeUserGroupsService,
    private toaster: ToastrService,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService,
    private dialog: MatDialog
  ) {
    this.nudgeSearchForm = this.fb.group({
      messageGroupId: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.initView();
    this.searchNudgeUserGroups(true);
    this.hasAccess();
  }

  hasAccess() {
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Communication', 'Nudge Groups', 'Delete');
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Communication', 'Nudge Groups', 'Add');
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.nudgeGroupsList = currentState.nudgeGroups;
  }

  searchNudgeUserGroups(clearData: boolean) {
    this.pageableData.name = this.nudgeSearchForm.get('name')?.value;
    this.pageableData.messageGroupId = this.nudgeGroupsList.messageGroupId;

    if (clearData) {
      this.nudgeUserGroupsList = [];
      this.pageableData.page = 0;
    }

    this.nudgeUserGroupsService.searchUserGroupList(this.pageableData).subscribe({
      next: (responseData: any) => {
        if (responseData && responseData.length < GlobalConstants.DEFAULT_PAGE_SIZE) {
          this.noMoreRecords = true; // No more records to load
        }
        this.nudgeUserGroupsList = [...this.nudgeUserGroupsList, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Category Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page += 1; // Increase page number for next request
    this.searchNudgeUserGroups(false); // Load next set of records
  }

  resetFilter() {
    this.nudgeSearchForm.reset();
    this.searchNudgeUserGroups(true);
  }

  getProfilePhoto(filePath: string) {
    if (!filePath) {
      this.imageSrc = 'assets/images/profile/user-1.jpg';
      return;
    }

    this.downloadService.downloadFileService(filePath).subscribe({
      next: responseData => {
        const reader = new FileReader();
        reader.onload = e => {
          this.imageSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(reader.result.toString());
          return this.imageSrc;
        };
        reader.readAsDataURL(responseData);
      },
      error: error => {
        console.error('Error downloading file:', error);
      },
    });
  }

  deleteUserGroup(groupUserId: string) {
    const isDelete = 0;
    this.nudgeUserGroupsService.deleteUserGroupList(groupUserId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Airman Deleted Successfully');
        this.searchNudgeUserGroups(true);
      },
    });
  }

  downloadTableData(): void {
    const csvData = this.nudgeUserGroupsList.map(nudgeGroup => ({
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
    a.download = 'nudge_user_groups.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(objArray: any[]): string {
    const header = Object.keys(objArray[0]).join(',');
    const rows = objArray.map(obj => Object.values(obj).join(','));
    return [header, ...rows].join('\n');
  }

  onViewClick(): void {
    const dialogRef = this.dialog.open(UserListDialogComponent, {
      width: '700px',
      data: {
        isNudgeGroup: true,
        isCommandActivity: false,
        nudgeData: this.nudgeGroupsList,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.searchNudgeUserGroups(true);
    });
  }

  // Handle checkbox selection for users
  checkBoxValueClicked(event: any, type: string, item: NudgeUserGroup): void {
    const checkbox = event.target as HTMLInputElement;

    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(chk => {
        chk.checked = checkbox.checked;
      });

      this.selectData = checkbox.checked ? [...this.nudgeUserGroupsList] : [];
    } else {
      if (checkbox.checked) {
        this.selectData.push(item);
      } else {
        this.selectData = this.selectData.filter(user => user.id !== item.id);
      }
    }
  }

  isUserSelected(user: NudgeUserGroup): boolean {
    return this.selectData.some(selectedUser => selectedUser.id === user.id);
  }
}
