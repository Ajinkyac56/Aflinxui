import { Component, OnInit } from '@angular/core';
import { RequirementService } from '../../service/requirement.service';
import { ToastrService } from 'ngx-toastr';
import { Requirement, RequirementSearchDto } from '../../model/requirement.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Router } from '@angular/router';
import { SpecialityService } from 'src/app/setting/service/speciality/speciality.service';
import { Speciality } from 'src/app/setting/models/speciality.model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-manage-requirement',
  templateUrl: './manage-requirement.component.html',
  styleUrls: ['./manage-requirement.component.css'],
})
export class ManageRequirementComponent implements OnInit {
  requirementData: Requirement[];
  selectedSpecialties: Requirement[];
  specialityData: Speciality[];
  specialityDataFiltered: Speciality[];
  specialitySearchControl = new FormControl();
  noMoreRecords: boolean = false;
  searchForm: FormGroup;
  hasAccessToView: boolean;
  hasAccessToEdit: boolean;
  hasAccessToActive: boolean;
  pageableData: RequirementSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
  };
  expandAction: boolean;

  constructor(
    private requirementService: RequirementService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private userSharedDataService: UserSharedDataService,
    private specialityService: SpecialityService
  ) {
    this.searchForm = this.fb.group({
      requirementName: ['', Validators.required],
      speciality: ['', Validators.required],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.getAllSpeciality();
    this.searchRequirement(true);
    this.hasAccess();
    this.specialitySearchControl.valueChanges.subscribe(() => {
      this.specialityData = this.filteredSpecalityList();
    });
  }
  hasAccess() {
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'View');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'Edit');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'Active/ In Active');
  }

  getAllSpeciality() {
    this.specialityService.getAllSpeciality().subscribe({
      next: (data: Speciality[] | null) => {
        if (data && Array.isArray(data)) {
          this.specialityData = data;
          this.specialityDataFiltered = [...data];
        } else {
          this.specialityDataFiltered = [];
          this.specialityData = [];
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Requirement Data', 'Error!');
      },
    });
  }
  filteredSpecalityList() {
    const searchTerm = this.specialitySearchControl.value?.toLowerCase() || '';
    return this.specialityDataFiltered.filter(item => item.name.toLowerCase().includes(searchTerm));
  }
  resetForm() {
    this.searchForm.reset();
    this.searchRequirement(true);
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;

    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.requirement-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSpecialties = [...this.requirementData];
      } else {
        this.selectedSpecialties = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedSpecialties.push(item);
      } else {
        const index = this.selectedSpecialties.findIndex(data => data.reqName === item.name);
        if (index >= 0) {
          this.selectedSpecialties.splice(index, 1);
        }
      }
    }
  }

  searchRequirement(clearData: boolean) {
    this.pageableData.requirementName = this.searchForm.get('requirementName')?.value;
    this.pageableData.speciality = this.searchForm.get('speciality')?.value;

    if (clearData) {
      this.requirementData = [];
      this.pageableData.page = 0;
    }

    this.requirementService.searchRequirement(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.requirementData = [...this.requirementData, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Requirement Data', 'Error!');
      },
    });
  }

  onEditClick(data: Requirement) {
    if (!this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'Edit')) {
      this.toaster.warning("You don't have access to view Requirement.", 'INVALID ACCESS !');
      return;
    }
    this.router.navigate(['/dashboard/requirement/create-requirements'], {
      state: {
        isEdit: true,
        requirement: data,
      },
    });
  }

  onViewClick(data: Requirement) {
    if (!this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'View')) {
      this.toaster.warning("You don't have access to view Requirement.", 'INVALID ACCESS !');
      return;
    }
    this.router.navigate(['/dashboard/requirement/create-requirements'], {
      state: {
        isView: true,
        requirement: data,
      },
    });
  }
  onActiveClick() {
    if (!this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'Active/ In Active ')) {
      this.toaster.warning("You don't have access to Active Requirement.", 'INVALID ACCESS !');
      return;
    }
  }
  onInActiveClick() {
    if (!this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'Active/ In Active ')) {
      this.toaster.warning("You don't have access to Inactive Requirement.", 'INVALID ACCESS !');
      return;
    }
  }

  hasAccessToAdd() {
    if (!this.userSharedDataService.hasAccess('Manage Readiness', 'Manage Requirements', 'Add')) {
      this.toaster.warning("You don't have access to Inactive Requirement.", 'INVALID ACCESS !');
      return;
    }
    this.router.navigateByUrl('/dashboard/requirement/create-requirements');
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchRequirement(false);
  }

  downloadTableData(): void {
    const csvData = this.requirementData.map(requirement => ({
      'Requirement Name': requirement.reqName,
      Speciality: requirement.speciality,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirements.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}
