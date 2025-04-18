import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SearchDataLoader } from 'src/app/models/SearchCondition.model';
import { DataFiles } from '../../model/dataFiles.model';
import { DataLoaderService } from '../../service/data-loader.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgIfContext } from '@angular/common';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { User } from 'src/app/user/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
})
export class RequirementsComponent {
  requirementsForm: FormGroup;
  noMoreRecords: boolean = false;
  datafilerecords: DataFiles[] = [];
  pageableData: SearchDataLoader = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
  };
  selectData: any;
  isEdit: any;
  editCase: TemplateRef<NgIfContext<boolean>>;

  constructor(
    private formBuilder: FormBuilder,
    private dataLoaderService: DataLoaderService,
    private userSharedDataService: UserSharedDataService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.requirementsForm = this.formBuilder.group({
      Requirement: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.searchAlphaRoster(true);
  }
  searchAlphaRoster(clearData: boolean) {
    const searchData = this.requirementsForm.getRawValue();
    this.pageableData.fileName = this.requirementsForm.get('fileName')?.value;
    searchData.startDate = this.datePipe.transform(this.requirementsForm.get('startDate')?.value, 'dd/MM/yyyy');
    searchData.endDate = this.datePipe.transform(this.requirementsForm.get('endDate')?.value, 'dd/MM/yyyy');
    this.pageableData.startDate = searchData.fromDate;
    this.pageableData.endDate = searchData.endDate;
    this.pageableData.module = 'Requirement';
    if (clearData) {
      this.datafilerecords = [];
      this.pageableData.page = 0;
    }
    this.dataLoaderService.searchDataFile(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.datafilerecords = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Alpha Roaster data', 'Error!');
      },
    });
  }
  checkBoxValueClicked(event: any, type: any, item: any) {
    const alphaRoasterCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = alphaRoasterCheckbox.checked;
      });

      if (alphaRoasterCheckbox.checked) {
        this.selectData = [...this.datafilerecords];
      } else {
        this.selectData = [];
      }
    } else {
      if (alphaRoasterCheckbox.checked) {
        this.selectData.push(item);
      } else {
        const index = this.selectData.findIndex(data => data.id === item.id);
        if (index >= 0) {
          this.selectData.splice(index, 1);
        }
      }
    }
  }
  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchAlphaRoster(true);
  }
  resetFilters(): void {
    this.requirementsForm.reset();
    this.searchAlphaRoster(true);
  }
  onViewClick(data: DataFiles) {
    if (!this.userSharedDataService.hasAccess('Manage Data Loader', 'Requirements', 'View')) {
      this.toaster.warning("You don't have access to view Requirements.", 'INVALID ACCESS !');
      return;
    }
    this.router.navigate(['/dashboard/data-loader/requirementsViewComponent'], {
      state: {
        isView: true,
        user: data,
      },
    });
  }
}
