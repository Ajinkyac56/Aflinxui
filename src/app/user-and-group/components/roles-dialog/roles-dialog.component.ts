import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterSelectType, SELECT_TYPE } from 'src/app/models/master.select-type.model';
import { MasterSelectTypeService } from 'src/app/services/master/master-select-type.service';
import { Role } from 'src/app/manage-permission/model/role.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.css'],
})
export class RolesDialogComponent implements OnInit {
  roleForm: FormGroup;
  roleData: MasterSelectType[] = [];
  roleDataFiltered: MasterSelectType[] = [];
  roleTypeSearchControl = new FormControl();

  constructor(
    private masterSelectTypeService: MasterSelectTypeService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role | null
  ) {
    this.roleForm = this.fb.group({
      roleId: [data?.roleId],
      name: [data?.name, [Validators.required, Validators.minLength(2)]],
      isDefault: 1,

      description: [data?.description, [Validators.required, Validators.minLength(5)]],
      roleType: [data?.roleType, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getRoleTypeData();
    this.roleTypeSearchControl.valueChanges.subscribe(() => {
      this.roleData = this.filterRoles();
    });
  }

  getRoleTypeData(): void {
    this.masterSelectTypeService.getAllMasterSelectByType(SELECT_TYPE.ROLE_TYPE).subscribe({
      next: (data: MasterSelectType[] | null) => {
        if (data && Array.isArray(data)) {
          this.roleData = data;
          this.roleDataFiltered = [...data];
        } else {
          this.roleDataFiltered = [];
          this.roleData = [];
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Role Type Data', 'Error!');
      },
    });
  }

  filterRoles() {
    const searchTerm = this.roleTypeSearchControl.value?.toLowerCase() || '';
    return this.roleDataFiltered.filter(item => item.name.toLowerCase().includes(searchTerm));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.roleForm.valid) {
      this.dialogRef.close(this.roleForm.value);
    }
  }
}
