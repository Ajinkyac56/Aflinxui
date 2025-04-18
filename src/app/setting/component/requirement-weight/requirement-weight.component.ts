import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRequirementDialogComponent } from 'src/app/dialog/add-requirement-dialog/add-requirement-dialog.component';
import { RequirementWeight } from '../../models/requirementWeight.model';
import { RequirementWeightService } from '../../service/requirement-weight/requirement-weight.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ReqWeightSearchDto } from 'src/app/models/SearchCondition.model';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-requirement-weight',
  templateUrl: './requirement-weight.component.html',
  styleUrls: ['./requirement-weight.component.css'],
})
export class RequirementWeightComponent implements OnInit {
  selectedRequirements: RequirementWeight[];
  requirementWeightData: RequirementWeight[];
  reqWeightSearchForm: FormGroup;
  noMoreRecords: boolean = false;
  hasAccessToAdd: boolean;
  hasAccessToEdit: boolean;
  hasAccessToDownload: boolean;
  hasAccessToActive: boolean;
  hasAccessToInactive: boolean;
  pageableData: ReqWeightSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  isEdit: any;
  expandAction: boolean;

  constructor(
    private dialog: MatDialog,
    private reqWeightService: RequirementWeightService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.reqWeightSearchForm = this.fb.group({
      reqWeightName: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchReqWeight(true);
    this.hasAccess();
  }

  openDialog(requirementWeight?: RequirementWeight): void {
    if (!this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Add')) {
      this.toastr.warning("You don't have access to Add Requirement", 'INVALID ACCESS !');
      return;
    }
    const dialogRef = this.dialog.open(AddRequirementDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: requirementWeight,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (requirementWeight) {
          this.updateRequirementWeight(result);
        } else {
          this.createRequirementWeight(result);
        }
      }
    });
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Settings', 'Requirement Weighting', 'Add');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Settings', 'Requirement Weighting', 'Edit');
    this.hasAccessToDownload = this.userSharedDataService.hasAccess('Manage Settings', 'Requirement Weighting', 'Download');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Settings', 'Requirement Weighting', 'Active');
    this.hasAccessToInactive = this.userSharedDataService.hasAccess('Manage Settings', 'Requirement Weighting', 'Inactive');
  }

  checkBoxValueClicked(event: any, type: any, item: RequirementWeight) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.requirement-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedRequirements = [...this.requirementWeightData];
      } else {
        this.selectedRequirements = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedRequirements.push(item);
      } else {
        const index = this.selectedRequirements.findIndex(data => data.reqName == item.reqName);
        if (index >= 0) {
          this.selectedRequirements.splice(index, 1);
        }
      }
    }
  }

  updateRequirementWeight(RequirementWeight: RequirementWeight): void {
    this.reqWeightService.updateReqWeight(RequirementWeight).subscribe({
      next: () => {
        this.toastr.success('Requirement Weight updated successfully', 'Success!');
        this.searchReqWeight(true);
      },
      error: () => {
        this.toastr.error('Failed to update Requirement Weight', 'Error!');
      },
    });
  }
  createRequirementWeight(requirementWeight: RequirementWeight): void {
    this.reqWeightService.saveReqWeight(requirementWeight).subscribe({
      next: () => {
        this.toastr.success('Requirement Weight created successfully', 'Success!');
        this.searchReqWeight(true);
      },
      error: () => {
        this.toastr.error('Failed to create Requirement Weight', 'Error!');
      },
    });
  }

  searchReqWeight(clearData: boolean) {
    this.pageableData.requirementName = this.reqWeightSearchForm.get('reqWeightName')?.value;

    if (clearData) {
      this.requirementWeightData = [];
      this.pageableData.page = 0;
    }

    this.reqWeightService.searchReqWeight(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.requirementWeightData = [...this.requirementWeightData, ...responseData];
      },
      error: error => {
        this.toastr.error('Unable to Load Requirement Weight Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchReqWeight(false);
  }

  resetFilter() {
    this.reqWeightSearchForm.reset();
    this.searchReqWeight(true);
  }

  downloadTableData(): void {
    const csvData = this.requirementWeightData.map(requirementWeight => ({
      'Requirement Name': requirementWeight.reqName,
      'Weight %': requirementWeight.weight + '%',
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirement_weight.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}
