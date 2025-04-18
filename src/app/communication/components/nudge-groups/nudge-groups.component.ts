import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../service/communication.service';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { nudgeGroupSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NudgeGroupsService } from '../../service/nudgeGroups/nudge-groups.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { NudgeGroupUpdateComponent } from '../nudge-group-update/nudge-group-update.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-nudge-groups',
  templateUrl: './nudge-groups.component.html',
  styleUrls: ['./nudge-groups.component.css'],
})
export class NudgeGroupsComponent implements OnInit {
  hasAccessToView: boolean = false;
  hasAccessToAdd: boolean = false;
  hasAccessToEdit: boolean = false;
  hasAccessToDelete: boolean = false;
  hasAccessToActive: boolean = false;
  nudgeGroupsList: NudgeGroup[] = [];
  selectedNudgeGroups: NudgeGroup[] = [];
  noMoreRecords: boolean = false;
  totalRecords: number = 0;
  nudgeGroupsSearchForm: FormGroup;
  pageableData: nudgeGroupSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  isEdit: any;
  expandAction: boolean;

  constructor(
    private nudgeGroupsService: NudgeGroupsService,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService,
    private dialog: MatDialog
  ) {
    this.nudgeGroupsSearchForm = this.fb.group({
      messageGroupName: ['', [Validators.required]],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.hasAccess();
    this.searchNudgeGroups(true);
  }

  searchNudgeGroups(clearData: boolean) {
    this.pageableData.messageGroupName = this.nudgeGroupsSearchForm.get('messageGroupName')?.value;
    this.pageableData.isDelete = 1;

    if (clearData) {
      this.nudgeGroupsList = [];
      this.pageableData.page = 0;
    }

    this.nudgeGroupsService.searchGroupList(this.pageableData).subscribe({
      next: (responseData: NudgeGroup[]) => {
        this.nudgeGroupsList = responseData;

        this.totalRecords = responseData.length;

        if (this.totalRecords < this.pageableData.size) {
          this.noMoreRecords = true;
        } else {
          this.noMoreRecords = false;
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Nudge Group Data', 'Error!');
      },
    });
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.nudgeGroups-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedNudgeGroups = [...this.nudgeGroupsList];
      } else {
        this.selectedNudgeGroups = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedNudgeGroups.push(item);
      } else {
        const index = this.selectedNudgeGroups.findIndex(data => data.messageGroupId == item.messageGroupId);
        if (index >= 0) {
          this.selectedNudgeGroups.splice(index, 1);
        }
      }
    }
  }

  loadMoreRecord() {
    if (this.noMoreRecords) {
      return;
    }
    this.pageableData.page += 1;
    this.searchNudgeGroups(false);
  }

  hasAccess() {
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage Communication', 'Nudge Groups', 'View');
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Communication', 'Nudge Groups', 'Add');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Communication', 'Nudge Groups', 'Delete');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Communication', 'Nudge Groups', 'Active/ In Active ');
  }

  resetFilter() {
    this.nudgeGroupsSearchForm.reset();
    this.searchNudgeGroups(true);
  }

  onViewClick(data: NudgeGroup) {
    this.router.navigate(['/dashboard/communication/view-nudge-group'], {
      state: {
        isView: true,
        nudgeGroups: data,
      },
    });
  }

  downloadTableData(): void {
    const csvData = this.nudgeGroupsList.map(nudgeGroup => ({
      'Group Name': nudgeGroup.messageGroupName,
      'User Count': nudgeGroup.userCount,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nudge_groups.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(objArray: any[]): string {
    const header = Object.keys(objArray[0]).join(',');
    const rows = objArray.map(obj => Object.values(obj).join(','));
    return [header, ...rows].join('\n');
  }

  deleteNudgeGroup(messageGroupId: string) {
    const isDelete = 0;
    this.nudgeGroupsService.deleteUserGroupList(messageGroupId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Nudge Group Deleted Successfully');
        this.searchNudgeGroups(true);
      },
      error: error => {
        this.toaster.error('Failed to delete Nudge Group. Please try again.', 'Error!');
      },
    });
  }

  editNudgeGroup(messageGroupId: string) {
    const dialogRef = this.dialog.open(NudgeGroupUpdateComponent, {
      width: '500px',
      data: { messageGroupId },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchNudgeGroups(true);
      }
    });
  }
}
