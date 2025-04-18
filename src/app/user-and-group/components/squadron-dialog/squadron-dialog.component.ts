import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SquadronService } from '../service/squadron/squadron.service';
import { UserService } from 'src/app/services/components/user/user.service';
import { DepartmentService } from '../service/department/department.service';
import { SquadronSubAdminService } from '../service/squadronSubAdmin/squadronSubAdmin.service';
import { Squadron } from '../../models/squadron.model';
import { User } from 'src/app/user/model/user.model';
import { Department } from '../../models/department.model';
import { SquadronSubAdmin } from '../../models/squadronSubAdmin.model';

@Component({
  selector: 'app-squadron-dialog',
  templateUrl: './squadron-dialog.component.html',
  styleUrls: ['./squadron-dialog.component.css'],
})
export class SquadronDialogComponent implements OnInit {
  squadronForm: FormGroup;
  adminList: User[] = [];
  adminListFiltered: User[] = [];
  adminSearchControl = new FormControl();
  subAdminList: User[] = [];
  subAdminListFiltered: User[] = [];
  subAdminSearchControl = new FormControl();
  departmentList: Department[] = [];
  departmentListFiltered: Department[] = [];
  departmentSearchControl = new FormControl();
  logo: File | undefined;
  fileSrc: any;
  isView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<SquadronDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.squadronForm = this.fb.group({
      id: [{ value: data.member?.id, disabled: this.data.isView }],
      squadronName: [{ value: data.member?.squadronName, disabled: this.data.isView }, Validators.required],
      department: [{ value: data.member?.department, disabled: this.data.isView }, Validators.required],
      status: [{ value: data.member?.status || 'Active', disabled: this.data.isView }, Validators.required],
      adminUserId: [{ value: data.member?.adminUserId, disabled: this.data.isView }, Validators.required],
      subAdminId: [{ value: data.member?.subAdminId, disabled: this.data.isView }, Validators.required],
      squadronLogo: [data?.squadronLogo],
      isDelete: [data.member?.isDelete],
      adminUser: [data.member?.adminUser],
      createdAt: [data.member?.createdAt],
      updatedAt: [data.member?.updatedAt],
      createdBy: [data.member?.createdBy],
      updatedBy: [data.member?.updatedBy],
    });
  }

  ngOnInit(): void {
    this.getAllAdmin();
    this.getAllSubAdmin();
    this.getAllDepartments();

    this.departmentSearchControl.valueChanges.subscribe(() => {
      this.departmentList = this.filteredDepartmentList();
    });

    this.adminSearchControl.valueChanges.subscribe(() => {
      this.adminList = this.filteredAdminList();
    });
    this.subAdminSearchControl.valueChanges.subscribe(() => {
      this.subAdminList = this.filteredSubAdminList();
    });
  }

  /** Fetch all Admin Users */
  getAllAdmin(): void {
    this.userService.getAllUser().subscribe({
      next: (users: User[] | null) => {
        this.adminList = users || [];
        this.adminListFiltered = [...this.adminList];
      },
      error: () => this.toaster.error('Failed to fetch users.', 'Error'),
    });
  }
  getAllSubAdmin(): void {
    this.userService.getAllUser().subscribe({
      next: (users: User[] | null) => {
        this.subAdminList = users || [];
        this.subAdminListFiltered = [...this.subAdminList];
      },
      error: () => this.toaster.error('Failed to fetch users.', 'Error'),
    });
  }

  /** Fetch all Departments */
  getAllDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments: Department[] | null) => {
        this.departmentList = departments || [];
        this.departmentListFiltered = [...this.departmentList];
      },
      error: () => this.toaster.error('Failed to fetch departments.', 'Error'),
    });
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload($event: any) {
    this.logo = $event.currentTarget.files[0];
    if (this.logo) {
      const reader = new FileReader();
      reader.onload = e => (this.fileSrc = reader.result);
      reader.readAsDataURL(this.logo);
    }
  }

  /** Handle Search Filtering */
  filteredDepartmentList(): Department[] {
    const searchTerm = this.departmentSearchControl.value?.toLowerCase() || '';
    return this.departmentListFiltered.filter(department => department.departmentName.toLowerCase().includes(searchTerm));
  }

  filteredAdminList(): User[] {
    const searchTerm = this.adminSearchControl.value?.toLowerCase() || '';
    return this.adminListFiltered.filter(admin => admin.fullName.toLowerCase().includes(searchTerm));
  }

  filteredSubAdminList(): User[] {
    const searchTerm = this.subAdminSearchControl.value?.toLowerCase() || '';
    return this.subAdminListFiltered.filter(subAdmin => subAdmin.fullName.toLowerCase().includes(searchTerm));
  }
  /** Handle Save */
  onSave(): void {
    if (this.squadronForm.invalid) {
      this.toaster.error('Please fill out all required fields.');
      this.squadronForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      squadron: this.squadronForm.getRawValue(), // Include disabled fields
      logo: this.logo,
    });
  }

  /** Close the Dialog */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
