import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SpecialityDialogComponent } from 'src/app/dialog/speciality-dialog/speciality-dialog.component';
import { SpecialityService } from '../../service/speciality/speciality.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { specialitySeachDto } from 'src/app/models/SearchCondition.model';
import { Speciality } from '../../models/speciality.model';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.css'],
})
export class SpecialityComponent implements OnInit {
  specialties: Speciality[];
  selectedSpecialties: Speciality[];
  specialitySearchform: FormGroup;
  noMoreRecords: boolean = false;
  hasAccessToEdit: boolean;
  hasAccessToDelete: boolean;
  hasAccessToAdd: boolean;
  hasAccessToDownload: boolean;
  hasAccessToActive: boolean;
  hasAccessToInactive: boolean;
  pageableData: specialitySeachDto = {
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
    private specialityService: SpecialityService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.specialitySearchform = this.fb.group({
      specialityName: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchSpeciality(true);
    this.hasAccess();
  }

  searchSpeciality(clearData: boolean) {
    this.pageableData.specialityName = this.specialitySearchform.get('specialityName')?.value;

    if (clearData) {
      this.specialties = [];
      this.pageableData.page = 0;
    }

    this.specialityService.searchSpeciality(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.specialties = [...this.specialties, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Speciality Data', 'Error!');
      },
    });
  }

  openSpecialityDialog(data?: Speciality): void {
    const dialogRef = this.dialog.open(SpecialityDialogComponent, {
      width: '400px',
      height: '250px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateSpeciality(result);
        } else {
          this.addSpeciality(result);
        }
      }
    });
  }

  addSpeciality(speciality: Speciality): void {
    this.specialityService.addSpeciality(speciality).subscribe({
      next: () => {
        this.toaster.success('Speciality saved successfully!', 'Success');
        this.searchSpeciality(true);
      },
      error: error => {
        this.toaster.error('Failed to save speciality. Please try again.', 'Error');
      },
    });
  }

  updateSpeciality(speciality: Speciality): void {
    this.specialityService.updateSpeciality(speciality).subscribe({
      next: () => {
        this.toaster.success('Speciality updated successfully!', 'Success');
        this.searchSpeciality(true);
      },
      error: error => {
        this.toaster.error('Failed to update speciality. Please try again.', 'Error');
      },
    });
  }

  deleteSpeciality(specialityId: string, isDelete: number): void {
    this.specialityService.deleteSpeciality(specialityId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Speciality deleted successfully!', 'Success');
        this.searchSpeciality(true);
      },
      error: error => {
        this.toaster.error('Failed to delete speciality. Please try again.', 'Error');
      },
    });
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Settings', 'Specialty', 'Add');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Settings', 'Specialty', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Settings', 'Specialty', 'Delete');
    this.hasAccessToDownload = this.userSharedDataService.hasAccess('Manage Settings', 'Specialty', 'Download');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Settings', 'Specialty', 'Active');
    this.hasAccessToInactive = this.userSharedDataService.hasAccess('Manage Settings', 'Specialty', 'Inactive');
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchSpeciality(false);
  }

  resetFilter() {
    this.specialitySearchform.reset();
    this.searchSpeciality(true);
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.specialties-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSpecialties = [...this.specialties];
      } else {
        this.selectedSpecialties = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedSpecialties.push(item);
      } else {
        const index = this.selectedSpecialties.findIndex(data => data.name == item.name);
        if (index >= 0) {
          this.selectedSpecialties.splice(index, 1);
        }
      }
    }
  }

  downloadTableData(): void {
    const csvData = this.specialties.map((speciality: any) => ({
      'Speciality Name': speciality.name,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'specialties.csv';
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
