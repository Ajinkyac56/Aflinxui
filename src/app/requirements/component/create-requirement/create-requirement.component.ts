import { Component, OnInit } from '@angular/core';
import { Speciality } from 'src/app/setting/models/speciality.model';
import { SpecialityService } from 'src/app/setting/service/speciality/speciality.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequirementService } from '../../service/requirement.service';
import { Location } from '@angular/common';
import { Requirement } from '../../model/requirement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-requirement',
  templateUrl: './create-requirement.component.html',
  styleUrls: ['./create-requirement.component.css'],
})
export class CreateRequirementComponent implements OnInit {
  createRequirementForm: FormGroup;
  userPhoto: File | null;
  imageSrc: any;
  specialityData: Speciality[];
  specialityDataFiltered: Speciality[];
  specialitySearchControl = new FormControl();
  isView: boolean = false;
  isEdit: boolean = false;
  requirement: Requirement;

  constructor(
    private specialityService: SpecialityService,
    private requirementService: RequirementService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private location: Location,
    private router: Router
  ) {
    this.createRequirementForm = this.fb.group({
      id: [''],
      reqName: ['', [Validators.required]],
      speciality: ['', [Validators.required]],
      status: ['', [Validators.required]],
      notes: [''],
      requirementLogo: [''],
      recordStatus: [''],
      createdAt: [''],
      updatedAt: [''],
      createdBy: [''],
      updatedBy: [''],
      isDelete: [''],
    });
  }

  ngOnInit(): void {
    this.getAllSpeciality();
    this.initEditRequirement();
    this.getRequirementById();
    this.specialitySearchControl.valueChanges.subscribe(() => {
      this.specialityData = this.filteredSpecalityList();
    });
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload(event: any): void {
    this.userPhoto = event.target.files[0];
    if (this.userPhoto) {
      const reader = new FileReader();
      reader.onload = e => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.userPhoto);
    }
  }

  getRequirementById() {
    if (!this.requirement?.id) return;
    this.requirementService.getRequirementById(this.requirement.id).subscribe({
      next: responseData => {
        this.requirement = responseData;
        this.createRequirementForm.patchValue(this.requirement);
      },
      error: error => {
        this.toaster.error('Unable to Load Requirement Data', 'Error!');
      },
    });
  }

  getAllSpeciality() {
    this.specialityService.getAllSpeciality().subscribe({
      next: (data: Speciality[] | null) => {
        if (data && Array.isArray(data)) {
          this.specialityData = data;
          this.specialityDataFiltered = [...data];
        } else {
          this.specialityDataFiltered = [];
          this.specialityData = [];
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Requirement Data', 'Error!');
      },
    });
  }
  filteredSpecalityList() {
    const searchTerm = this.specialitySearchControl.value?.toLowerCase() || '';
    return this.specialityDataFiltered.filter(item => item.name.toLowerCase().includes(searchTerm));
  }
  onSubmit() {
    if (this.createRequirementForm.invalid) {
      this.createRequirementForm.markAllAsTouched();
      this.toaster.error('Please Fill all the fields', 'Error!');
      return;
    }

    this.requirementService.saveRequirement(this.userPhoto, this.createRequirementForm.value).subscribe({
      next: response => {
        this.toaster.success('Requirement saved successfully!', 'Success!');
        this.createRequirementForm.reset();
        this.imageSrc = null;
        this.router.navigateByUrl('/dashboard/requirement/manage-requirements');
      },
      error: error => {
        this.toaster.error('Failed to save the requirement', 'Error!');
        console.error('Error:', error);
      },
    });
  }

  initEditRequirement() {
    let getCurrentState: any = this.location.getState();
    this.isView = getCurrentState.isView;
    this.isEdit = getCurrentState.isEdit;
    this.requirement = getCurrentState.requirement;
    if (this.isView) {
      this.createRequirementForm.disable();
    }
  }

  updateRequriement() {
    if (this.createRequirementForm.invalid) {
      this.toaster.error('Please Fill all the fields', 'Error!');
      // this.createRequirementForm.markAllAsTouched();
      return;
    }

    this.requirementService.updateRequirement(this.userPhoto, this.createRequirementForm.value).subscribe({
      next: response => {
        this.toaster.success('Requirement Update successfully!', 'Success!');
        this.createRequirementForm.reset();
        this.imageSrc = null;
        this.router.navigateByUrl('/dashboard/requirement/manage-requirements');
      },
      error: error => {
        this.toaster.error('Failed to update the requirement', 'Error!');
        console.error('Error:', error);
      },
    });
  }
}
