import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserImport } from '../../model/userImport.model';
import { DatePipe, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SearchRequirementImpoart } from 'src/app/models/SearchCondition.model';
import { DataFiles } from '../../model/dataFiles.model';
import { RequirementImport } from 'src/app/requirements/model/requirementImport.model';
import { RequirementImportService } from 'src/app/requirements/service/requirementImport.service';

@Component({
  selector: 'app-requirements-view',
  templateUrl: './requirements-view.component.html',
  styleUrls: ['./requirements-view.component.css'],
})
export class RequirementsViewComponent {
  requirementsViewForm: FormGroup;
  requirementImportData: RequirementImport[] = [];
  isView: boolean = false;
  dataFile: DataFiles;
  noMoreRecords: boolean = false;
  pageableData: SearchRequirementImpoart = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
  };
  constructor(
    private formBuilder: FormBuilder,
    private requirementImportService: RequirementImportService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private location: Location
  ) {
    this.requirementsViewForm = this.formBuilder.group({
      requirementName: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.initView();
    this.searchViewRequirement(true);
  }
  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.dataFile = currentState.user;
  }
  searchViewRequirement(clearData: boolean) {
    const searchData = this.requirementsViewForm.getRawValue();
    this.pageableData.name = this.requirementsViewForm.get('requirementName')?.value;
    this.pageableData.status = this.requirementsViewForm.get('status')?.value;
    this.pageableData.dataFileId = this.dataFile.id;
    if (clearData) {
      this.requirementImportData = [];
      this.pageableData.page = 0;
    }
    this.requirementImportService.searchViewImportRequirements(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.requirementImportData = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Airman data', 'Error!');
      },
    });
  }
  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchViewRequirement(false);
  }
  resetFilters(): void {
    this.requirementsViewForm.reset();
    this.searchViewRequirement(true);
  }
}
