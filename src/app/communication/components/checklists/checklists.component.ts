import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ChecklistDetailSearchDto } from 'src/app/models/SearchCondition.model';
import { ChecklistMessageService } from '../../service/checklist/checklist.service';
import { ChecklistDetails } from '../../model/checklistDetails.model';
import { Router } from '@angular/router';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.css'],
})
export class ChecklistsComponent implements OnInit {
  expandAction: boolean = false;
  noMoreRecords: boolean = false;

  checkList: ChecklistDetails[] = [];
  selectedChecklists: ChecklistDetails[] = [];

  searchForm: FormGroup;

  hasAccessToAdd: boolean = false;
  hasAccessToView: boolean = false;
  hasAccessToDelete: boolean = false;
  hasAccessToEdit: boolean = false;

  pageableData: ChecklistDetailSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };

  constructor(
    private checklistService: ChecklistMessageService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private userSharedDataService: UserSharedDataService
  ) {
    this.searchForm = this.fb.group({
      messageTitle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.searchChecklists(true);
    this.hasAccess();
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'Add');
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'View');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'Delete');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Communication', 'Checklists', 'Edit');
  }

  searchChecklists(clearData: boolean) {
    this.pageableData.messageTitle = this.searchForm.get('messageTitle')?.value;

    if (clearData) {
      this.checkList = [];
      this.pageableData.page = 0;
    }

    this.checklistService.searchChecklist(this.pageableData).subscribe({
      next: (responseData: ChecklistDetails[]) => {
        if (clearData) {
          this.checkList = responseData;
        } else {
          this.checkList = [...this.checkList, ...responseData];
        }
        this.noMoreRecords = responseData.length < this.pageableData.size;
      },
      error: error => {
        this.toaster.error('Unable to Load Checklist Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchChecklists(false);
  }

  resetFilter() {
    this.searchForm.reset();
    this.searchChecklists(true);
  }

  checkBoxValueClicked(event: any, type: string, item?: ChecklistDetails) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.Checklist-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedChecklists = [...this.checkList];
      } else {
        this.selectedChecklists = [];
      }
    } else if (item) {
      if (targetCheckbox.checked) {
        this.selectedChecklists.push(item);
      } else {
        const index = this.selectedChecklists.findIndex(data => data.checklistDetailsId === item.checklistDetailsId);
        if (index >= 0) {
          this.selectedChecklists.splice(index, 1);
        }
      }
    }
  }

  onViewClick(data: ChecklistDetails) {
    this.router.navigate(['/dashboard/communication/view-checklist'], {
      state: {
        isView: true,
        checklistDetails: data,
      },
    });
  }

  onDetailsClick(item: any) {
    console.log('Details clicked for:', item.messageTitle);
  }

  downloadTableData() {
    console.log('Download table data');
  }
}
