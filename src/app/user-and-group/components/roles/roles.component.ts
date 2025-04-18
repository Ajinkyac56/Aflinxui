import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolesDialogComponent } from '../roles-dialog/roles-dialog.component';
import { RolesService } from '../service/roles/roles.service';
import { Role } from 'src/app/manage-permission/model/role.model';
import { ToastrService } from 'ngx-toastr';
import { MasterSelectTypeService } from 'src/app/services/master/master-select-type.service';
import { MasterSelectType, SELECT_TYPE } from 'src/app/models/master.select-type.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { rolesSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  roleData: MasterSelectType[] = [];
  selectedRoles: Role[] = [];
  roleSearchForm: FormGroup;
  hasAccessToEdit: boolean;
  hasAccessToDelete: boolean;
  hasAccessToAdd: boolean;
  noMoreRecords: boolean = false;
  pageableData: rolesSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  expandAction: boolean;
  role: Role;

  constructor(
    private dialog: MatDialog,
    private rolesService: RolesService,
    private toaster: ToastrService,
    private masterSelectTypeService: MasterSelectTypeService,
    private userSharedDataService: UserSharedDataService,
    private fb: FormBuilder
  ) {
    this.roleSearchForm = this.fb.group({
      name: ['', [Validators.required]],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.getRoleTypeData();
    this.searchRoles(true);
    this.hasAccess();
  }
  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage User and Groups', 'Roles', 'Add');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage User and Groups', 'Roles', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage User and Groups', 'Roles', 'Delete');
  }

  getRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: roles => {
        this.roles = roles;
      },
      error: error => {
        console.error('Error fetching roles:', error);
      },
    });
  }

  downloadTableData(): void {
    const csvData = this.convertToCSV(this.roles);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'roles.csv');
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

  openDialog(role?: Role): void {
    const dialogRef = this.dialog.open(RolesDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: role,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (role) {
          this.updateRole(result);
        } else {
          this.addRole(result);
        }
      }
    });
  }

  searchRoles(clearData: boolean) {
    this.pageableData.name = this.roleSearchForm.get('name')?.value;

    if (clearData) {
      this.roles = []; // Clear the existing roles if it's a new search
      this.pageableData.page = 0; // Reset the page number
      this.noMoreRecords = false; // Reset the noMoreRecords flag
    }

    this.rolesService.searchRole(this.pageableData).subscribe({
      next: (responseData: any) => {
        if (responseData.length > 0) {
          if (clearData) {
            this.roles = responseData; // Replace the roles if it's a new search
          } else {
            this.roles = this.roles.concat(responseData); // Append new roles to the existing list
          }
        } else {
          this.noMoreRecords = true; // Set the flag to true if no more records are returned
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Role Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    if (this.noMoreRecords) {
      return; // Don't make an API request if no more records are available
    }
    this.pageableData.page += 1; // Increment the page number
    this.searchRoles(false); // Fetch the next page of records without clearing the existing data
  }

  resetFilter() {
    this.roleSearchForm.reset();
    this.searchRoles(true);
  }

  addRole(roleData: Role) {
    this.rolesService.addRole(roleData).subscribe({
      next: () => {
        this.toaster.success('Role Saved Successfully', 'Success!');
        this.getRoles();
      },
      error: error => {
        console.error('Error adding role:', error);
        this.toaster.error('Unable to Create Role', 'Error!');
      },
    });
  }

  updateRole(roleData: Role) {
    const roleId = roleData.roleId;

    this.rolesService.updateRole(roleId, roleData).subscribe({
      next: () => {
        this.toaster.success('Role Updated Successfully', 'Success!');
        this.getRoles();
      },
      error: error => {
        this.toaster.error('Failed to update Role', 'Error!');
      },
    });
  }

  deleteRole(roleId: string, isDelete: number) {
    this.rolesService.deleteRole(roleId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Role Deleted Successfully', 'Success!');

        this.getRoles();
      },
      error: error => {
        this.toaster.success('Role Deleted Successfully', 'Success!');
        this.getRoles();
      },
    });
  }

  checkBoxValueClicked(event: any, type: string, item?: Role): void {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.roles-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      this.selectedRoles = targetCheckbox.checked ? [...this.roles] : [];
    } else if (item) {
      if (targetCheckbox.checked) {
        this.selectedRoles.push(item);
      } else {
        const index = this.selectedRoles.findIndex(role => item.roleId === item.roleId);
        if (index >= 0) {
          this.selectedRoles.splice(index, 1);
        }
      }
    }
  }

  getRoleName(id: string) {
    const list = this.roleData.filter(item => {
      return item.id == id;
    });
    if (list.length == 1) {
      return list[0].name;
    } else {
      return 'NA';
    }
  }

  getRoleTypeData(): void {
    this.masterSelectTypeService.getAllMasterSelectByType(SELECT_TYPE.ROLE_TYPE).subscribe({
      next: responseData => {
        this.roleData = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Role Type Data', 'Error!');
      },
    });
  }
}
