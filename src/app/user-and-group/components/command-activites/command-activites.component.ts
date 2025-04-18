import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../service/department/department.service';
import { Department } from '../../models/department.model';
import { CommandActivitesDialogComponent } from '../command-activites-dialog/command-activites-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommandActivitySearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-command-activites',
  templateUrl: './command-activites.component.html',
  styleUrls: ['./command-activites.component.css'],
})
export class CommandActivitesComponent implements OnInit {
  departments: Department[] = [];
  selectedDepartments: Department[] = [];
  hasAccessToEdit: boolean = true;
  hasAccessToDelete: boolean = true;
  isLoading: boolean = false;
  noMoreRecords: boolean = false;
  hasAccessToSubAdmin: boolean;
  hasAccessToView: boolean = false;
  hasAccessToAdd: boolean;
  commandSearchForm: FormGroup;
  pageableData: CommandActivitySearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  expandAction: boolean;

  constructor(
    private dialog: MatDialog,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private userSharedDataService: UserSharedDataService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.commandSearchForm = this.fb.group({
      deptName: ['', [Validators.required]],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchCommand(true);
    this.hasAccess();
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage User and Groups', 'Command Activities', 'Add');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage User and Groups', 'Command Activities', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage User and Groups', 'Command Activities', 'Delete');
    this.hasAccessToSubAdmin = this.userSharedDataService.hasAccess('Manage User and Groups', 'Command Activities', 'Add');
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage User and Groups', 'Command Activities', 'View');
  }

  searchCommand(clearData: boolean) {
    this.pageableData.deptName = this.commandSearchForm.get('deptName')?.value;

    if (clearData) {
      this.departments = [];
      this.pageableData.page = 0;
    }

    this.departmentService.searchCommand(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.departments = [...this.departments, ...responseData];

        if (responseData.length < this.pageableData.size) {
          this.noMoreRecords = false;
        } else {
          this.noMoreRecords = true;
        }
      },
      error: error => {
        this.toastr.error('Unable to Load Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page += 1;
    this.searchCommand(false);
  }

  openDialog(data?: Department): void {
    const dialogRef = this.dialog.open(CommandActivitesDialogComponent, {
      width: '50%',
      maxWidth: '600px',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateDepartment(result);
        } else {
          this.saveDepartment(result);
        }
      }
    });
  }

  saveDepartment(department: Department): void {
    this.departmentService.saveDepartment(department).subscribe(
      newDepartment => {
        this.toastr.success('Department added successfully!', 'Success');
        this.searchCommand(true);
      },
      error => {
        this.toastr.error(error);
      }
    );
  }

  updateDepartment(updatedData: Department): void {
    if (!updatedData.adminUserId || updatedData.adminUserId.trim() === '') {
      this.toastr.error('Admin cannot be empty.', 'Validation Error');
      return;
    }

    this.departmentService.updateDepartment(updatedData).subscribe(
      updatedDepartment => {
        this.toastr.success('Department updated successfully!', 'Success');
        this.searchCommand(true);
      },
      error => {
        this.toastr.error(error);
      }
    );
  }

  resetFilter() {
    this.commandSearchForm.reset();
    this.searchCommand(true);
  }

  deleteDepartment(id: string): void {
    const isDelete = 0;
    this.departmentService.deleteDepartment(id, isDelete).subscribe(
      () => {
        this.toastr.success('Department deleted successfully!', 'Success');
        this.searchCommand(true);
      },
      error => {
        this.toastr.error('Failed to delete department. Please try again.');
        this.toastr.error(error);
      }
    );
  }

  checkBoxValueClicked(event: any, type: string, item?: Department): void {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.departments-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      this.selectedDepartments = targetCheckbox.checked ? [...this.departments] : [];
    } else if (item) {
      if (targetCheckbox.checked) {
        this.selectedDepartments.push(item);
      } else {
        const index = this.selectedDepartments.findIndex(dept => dept.id === item.id);
        if (index >= 0) {
          this.selectedDepartments.splice(index, 1);
        }
      }
    }
  }

  downloadTableData(): void {
    const csvData = this.departments.map(department => ({
      'Department Name': department.departmentName,
      Admin: department.adminUser,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'departments.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(value => `"${value}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  onViewClick(data: Department) {
    this.router.navigate(['/dashboard/userAndgroup/command-activity-view'], {
      state: {
        isCommandActivity: true,
        isView: true,
        deptData: data,
      },
    });
  }
}
