import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserService } from 'src/app/services/components/user/user.service';
import { User } from 'src/app/user/model/user.model';
import { RolesService } from '../service/roles/roles.service';
import { Role } from 'src/app/manage-permission/model/role.model';
import { SquadronService } from '../service/squadron/squadron.service';
import { Squadron } from '../../models/squadron.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-airman',
  templateUrl: './create-airman.component.html',
  styleUrls: ['./create-airman.component.css'],
})
export class CreateAirmanComponent implements OnInit {
  createAirmanForm: FormGroup;
  userPhoto: File | undefined;
  imageSrc: any;
  isEdit: boolean = false;
  roleListFiltered: Role[] = [];
  roleListFilteredArray: Role[] = [];
  squadronListFiltered: Squadron[] = [];
  squadronListFilteredArray: Squadron[] = [];
  squadronSearchControl = new FormControl();
  roleSearchControl = new FormControl();
  airman: User;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router,
    private rolesService: RolesService,
    private squadronService: SquadronService,
    private location: Location
  ) {
    this.createAirmanForm = this.formBuilder.group({
      id: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern(GlobalConstants.EMAIL_PATTERN)]],
      mobile: ['', [Validators.required, Validators.pattern(GlobalConstants.MOBILE_PATTERN_WITHOUT_CODE)]],
      firstName: ['', [Validators.required, Validators.pattern(GlobalConstants.NAME_PATTERN)]],
      lastName: ['', Validators.pattern(GlobalConstants.NAME_PATTERN)],
      userType: ['', Validators.required],
      dodId: ['', Validators.required],
      squadronId: ['', Validators.required],
      photo: [''],
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.getSquadrons();
    this.initEdit();
    this.squadronSearchControl.valueChanges.subscribe(() => {
      this.squadronListFiltered = this.filteredSquadronList();
    });
    this.roleSearchControl.valueChanges.subscribe(() => {
      this.roleListFiltered = this.filteredRoleList();
    });
  }

  initEdit() {
    let current: any = this.location.getState();
    this.isEdit = current.isEdit;
    this.airman = current.data;

    this.createAirmanForm.patchValue(this.airman);
    if (this.isEdit) {
      this.createAirmanForm.get('dodId')?.disable();
      this.createAirmanForm.get('email')?.disable();
    }
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload($event: any) {
    this.userPhoto = $event.target.files[0];
    if (this.userPhoto) {
      const reader = new FileReader();
      reader.onload = e => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.userPhoto);
    }
  }

  saveAirman() {
    if (this.createAirmanForm.invalid) {
      this.toaster.error('Please fill in all required fields correctly.', 'Form Error');
      this.createAirmanForm.markAllAsTouched();
      return;
    }

    let user: User = this.createAirmanForm.getRawValue();
    user.userName = user.email;

    const submitMethod = this.isEdit ? 'updateAirman' : 'createAirman';
    this.userService[submitMethod](user, this.userPhoto).subscribe({
      next: () => {
        if (this.isEdit) {
          this.toaster.success('Airman Updated successfully!', 'Success');
        } else {
          this.toaster.success('Airman created successfully!', 'Success');
        }
        this.router.navigate(['/dashboard/userAndgroup']);
      },
      error: error => {
        const errorMessage = error.error?.message || 'An error occurred while creating the airman.';
        this.toaster.error(errorMessage, 'Error');
        console.error(error);
      },
    });
  }

  getRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data: Role[] | null) => {
        if (data && Array.isArray(data)) {
          this.roleListFiltered = data;
          this.roleListFilteredArray = [...data];
        } else {
          this.roleListFiltered = [];
          this.roleListFilteredArray = [];
          this.toaster.warning('No squadrons found.', 'Warning');
        }
      },
      error: error => {
        this.toaster.error('Failed to fetch roles.', 'Error');
      },
    });
  }

  getSquadrons(): void {
    this.squadronService.getSquadrons().subscribe({
      next: (data: Squadron[] | null) => {
        if (data && Array.isArray(data)) {
          this.squadronListFiltered = data; // Original list
          this.squadronListFilteredArray = [...data]; // Initial filtered list
        } else {
          this.squadronListFilteredArray = [];
          this.squadronListFiltered = [];
          this.toaster.warning('No squadrons found.', 'Warning');
        }
      },
      error: error => {
        this.toaster.error('Failed to fetch squadrons.', 'Error');
      },
    });
  }

  filteredSquadronList() {
    const searchTerm = this.squadronSearchControl.value?.toLowerCase() || '';
    return this.squadronListFilteredArray.filter(item => item.squadronName.toLowerCase().includes(searchTerm));
  }
  filteredRoleList() {
    const searchTerm = this.roleSearchControl.value?.toLowerCase() || '';
    return this.roleListFilteredArray.filter(item => item.name.toLowerCase().includes(searchTerm));
  }
}
