import { Component, OnInit } from '@angular/core';
import { SquadronSubAdminSearchDto } from 'src/app/models/SearchCondition.model';
import { Squadron } from '../../models/squadron.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { SquadronService } from '../service/squadron/squadron.service';
import { UserListDialogComponent } from 'src/app/communication/components/userlist-dialoge/userlist-dialoge.component';
import { SquadronSubAdminService } from '../service/squadronSubAdmin/squadronSubAdmin.service';

@Component({
  selector: 'app-squadron-sub-admin-view',
  templateUrl: './squadron-sub-admin-view.component.html',
  styleUrls: ['./squadron-sub-admin-view.component.css'],
})
export class SquadronSubAdminViewComponent implements OnInit {
  subAdminSearchForm: FormGroup;
  squadronList: Squadron;
  squadronSubAdminList: any[] = [];
  isView: boolean;
  selectData: any[] = [];
  imageSrc: any = 'assets/images/profile/user-1.jpg';
  hasAccessToDelete: boolean = false;
  hasAccessToAdd: boolean = false;
  noMoreRecords: boolean = false;

  pageableData: SquadronSubAdminSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  constructor(
    private location: Location,
    private squadronSubAdminService: SquadronSubAdminService,
    private toaster: ToastrService,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService,
    private dialog: MatDialog
  ) {
    this.subAdminSearchForm = this.fb.group({
      squadronId: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initView();
    this.hasAccess();
    this.searchSubAdmin(true);
  }

  hasAccess() {
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage User and Groups', 'Squadrons', 'Delete');
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage User and Groups', 'Squadrons', 'Add');
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.squadronList = currentState.squadron;
  }

  searchSubAdmin(clearData: boolean) {
    this.pageableData.name = this.subAdminSearchForm.get('name')?.value;
    this.pageableData.squadronId = this.squadronList.id;

    if (clearData) {
      this.squadronSubAdminList = [];
      this.pageableData.page = 0;
    }

    this.squadronSubAdminService.searchSqauadronSubAdmin(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.squadronSubAdminList = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Sub Admin Data', 'Error!');
      },
    });
  }

  onViewClick(): void {
    const dialogRef = this.dialog.open(UserListDialogComponent, {
      width: '700px',
      data: {
        isSquadron: true,
        squadronData: this.squadronList,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.searchSubAdmin(true);
    });
  }

  deleteSubAdmin(subAdminId: string) {
    const isDelete = 0;
    const squadronId = this.squadronList.id;
    this.squadronSubAdminService.deleteSquadronSubAdmin(squadronId, subAdminId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Airman Deleted Successfully');
        this.searchSubAdmin(true);
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchSubAdmin(false);
  }

  resetFilter() {
    this.subAdminSearchForm.reset();
    this.searchSubAdmin(true);
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

  downloadTableData(): void {
    const csvData = this.squadronSubAdminList.map(nudgeGroup => ({
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

  // Handle checkbox selection for users
  checkBoxValueClicked(event: any, type: string, item: any): void {
    const checkbox = event.target as HTMLInputElement;

    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(chk => {
        chk.checked = checkbox.checked;
      });

      this.selectData = checkbox.checked ? [...this.squadronSubAdminList] : [];
    } else {
      if (checkbox.checked) {
        this.selectData.push(item);
      } else {
        this.selectData = this.selectData.filter(user => user.id !== item.id);
      }
    }
  }

  isUserSelected(user: any): boolean {
    return this.selectData.some(selectedUser => selectedUser.id === user.id);
  }
}
