import { Component, OnInit } from '@angular/core';
import { ChecklistMessageService } from '../../service/checklist/checklist.service';
import { ChecklistUserSearchDto } from 'src/app/models/SearchCondition.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { environment } from 'src/environments/environment';
import { NudgeUserGroup } from '../../model/nudgeUserGroup.model';
import { Location } from '@angular/common';
import { ChecklistDetails } from '../../model/checklistDetails.model';

@Component({
  selector: 'app-checklist-view',
  templateUrl: './checklist-view.component.html',
  styleUrl: './checklist-view.component.css',
})
export class ChecklistViewComponent implements OnInit {
  nudgeSearchForm: FormGroup;
  checklistDetails: ChecklistDetails;
  Checklist: any[] = [];
  isView: boolean;
  selectData: any[] = [];
  imageSrc: any = 'assets/images/profile/user-1.jpg';
  hasAccessToDelete: boolean = false;
  noMoreRecords: boolean = false;

  pageableData: ChecklistUserSearchDto = {
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
    private chechklistMessageService: ChecklistMessageService,
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
    this.searchChecklist(true);
    this.hasAccess();
  }

  hasAccess() {
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'Delete');
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.checklistDetails = currentState.checklistDetails;
  }

  searchChecklist(clearData: boolean) {
    this.pageableData.name = this.nudgeSearchForm.get('name')?.value;
    this.pageableData.checklistDetailsId = this.checklistDetails.checklistDetailsId;

    if (clearData) {
      this.Checklist = [];
      this.pageableData.page = 0;
    }

    this.chechklistMessageService.searchChecklistUsers(this.pageableData).subscribe({
      next: (responseData: any) => {
        if (responseData && responseData.length < GlobalConstants.DEFAULT_PAGE_SIZE) {
          this.noMoreRecords = true;
        }
        this.Checklist = [...this.Checklist, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Airman Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page += 1;
    this.searchChecklist(false);
  }

  resetFilter() {
    this.nudgeSearchForm.reset();
    this.searchChecklist(true);
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
    const csvData = this.Checklist.map(nudgeGroup => ({
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
    a.download = 'checklist_user.csv';
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
      const checkboxes = document.querySelectorAll('.checklist-view-table input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(chk => {
        chk.checked = checkbox.checked;
      });

      this.selectData = checkbox.checked ? [...this.Checklist] : [];
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
