import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserImport } from '../../model/userImport.model';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { DataLoaderService } from '../../service/data-loader.service';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { searchViewAlphaRostar } from 'src/app/models/SearchCondition.model';
import { DataFiles } from '../../model/dataFiles.model';

@Component({
  selector: 'app-alpha-roaster-view',
  templateUrl: './alpha-roaster-view.component.html',
  styleUrls: ['./alpha-roaster-view.component.css'],
})
export class AlphaRoasterViewComponent {
  alphaRosterViewForm: FormGroup;
  userData: UserImport[] = [];
  isView: boolean = false;
  dataFile: DataFiles;
  noMoreRecords: boolean = false;
  pageableData: searchViewAlphaRostar = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
  };
  constructor(
    private formBuilder: FormBuilder,
    private dataLoaderService: DataLoaderService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private location: Location
  ) {
    this.alphaRosterViewForm = this.formBuilder.group({
      userName: [''],
      emailId: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.initView();
    this.searchViewAlphaRoster(true);
  }
  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.dataFile = currentState.user;
  }
  searchViewAlphaRoster(clearData: boolean) {
    const searchData = this.alphaRosterViewForm.getRawValue();
    this.pageableData.name = this.alphaRosterViewForm.get('userName')?.value;
    this.pageableData.email = this.alphaRosterViewForm.get('emailId')?.value;
    this.pageableData.status = this.alphaRosterViewForm.get('status')?.value;
    this.pageableData.dataFileId = this.dataFile.id;
    if (clearData) {
      this.userData = [];
      this.pageableData.page = 0;
    }
    this.dataLoaderService.searchViewImportUser(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.userData = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Airman data', 'Error!');
      },
    });
  }
  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchViewAlphaRoster(false);
  }
  resetFilters(): void {
    this.alphaRosterViewForm.reset();
    this.searchViewAlphaRoster(true);
  }
}
