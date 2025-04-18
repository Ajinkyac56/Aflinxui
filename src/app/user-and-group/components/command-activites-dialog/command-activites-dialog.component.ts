import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from 'src/app/user/model/user.model';
import { UserService } from 'src/app/services/components/user/user.service';

@Component({
  selector: 'app-command-activities-dialog',
  templateUrl: './command-activites-dialog.component.html',
  styleUrls: ['./command-activites-dialog.component.css'],
})
export class CommandActivitesDialogComponent {
  activityForm: FormGroup;
  adminList: User[] = [];
  adminListFiltered: User[] = [];
  adminSearchControl = new FormControl();
  toaster: any;

  constructor(
    public dialogRef: MatDialogRef<CommandActivitesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {},
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.activityForm = this.fb.group(
      {
        id: [data?.id],
        departmentName: [data?.departmentName, Validators.required],
        status: [data?.status || 'Active'],
        adminUserId: [data?.adminUserId],
        subAdminId: [data?.subAdminId],
        isDelete: [data?.isDelete || 1],
        adminUser: [data?.adminUser],
        createdAt: [data?.createdAt],
        updatedAt: [data?.updatedAt],
        createdBy: [data?.createdBy],
        updatedBy: [data?.updatedBy],
      },
      { validators: this.adminOrSubAdminValidator }
    );
  }

  ngOnInit(): void {
    this.getAllAdmins();
    this.adminSearchControl.valueChanges.subscribe(() => {
      this.adminList = this.filteredAdminList();
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getAllAdmins(): void {
    this.userService.getAllUser().subscribe({
      next: (users: User[] | null) => {
        if (users && Array.isArray(users)) {
          this.adminList = users;
          this.adminListFiltered = [...users];
        } else {
          this.adminListFiltered = [];
          this.adminList = [];
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: err => {
        this.toaster.error('Failed to fetch users.', 'Error');
        console.error('Error fetching users:', err);
      },
    });
  }

  filteredAdminList() {
    const searchTerm = this.adminSearchControl.value?.toLowerCase() || '';
    return this.adminListFiltered.filter(item => item.fullName.toLowerCase().includes(searchTerm));
  }

  submitForm(): void {
    if (this.activityForm.valid) {
      this.dialogRef.close(this.activityForm.value);
    } else {
      this.activityForm.markAllAsTouched();
    }
  }

  private adminOrSubAdminValidator(form: AbstractControl) {
    const adminUserId = form.get('adminUserId')?.value;
    const subAdminId = form.get('subAdminId')?.value;

    if (!adminUserId && !subAdminId) {
      return { adminOrSubAdminRequired: true };
    }
    return null;
  }
}
