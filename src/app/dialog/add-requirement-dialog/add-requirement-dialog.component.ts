import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequirementWeight } from '../../setting/models/requirementWeight.model';
import { ToastrService } from 'ngx-toastr';
import { RequirementWeightService } from 'src/app/setting/service/requirement-weight/requirement-weight.service';
import { RequirementService } from 'src/app/requirements/service/requirement.service';
import { Requirement } from 'src/app/requirements/model/requirement.model';

@Component({
  selector: 'app-add-requirement-dialog',
  templateUrl: './add-requirement-dialog.component.html',
  styleUrls: ['./add-requirement-dialog.component.css'],
})
export class AddRequirementDialogComponent implements OnInit {
  requirementWeightForm: FormGroup;
  requirementData: Requirement[] = [];
  requirementDataFiltered: Requirement[] = [];
  requirementSearchControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private requirementService: RequirementService,
    private dialogRef: MatDialogRef<AddRequirementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequirementWeight
  ) {
    this.requirementWeightForm = this.fb.group({
      weightId: [data?.weightId],
      requirementId: [data?.requirementId, [Validators.required]],
      weight: [data?.weight, [Validators.required, Validators.pattern(/^(100|[1-9]?[0-9])$/)]],
      createdAt: [data?.createdAt],
      updatedAt: [data?.updatedAt],
      createdBy: [data?.createdBy],
      updatedBy: [data?.updatedBy],
      isDelete: [data?.isDelete],
      reqName: [{ value: data?.reqName || '', disabled: this.data }],
    });
  }

  ngOnInit(): void {
    this.getRequirementIdByName();
    this.getAllRequirement();
    this.requirementSearchControl.valueChanges.subscribe(() => {
      this.requirementData = this.filteredRequirementList();
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.requirementWeightForm.invalid) {
      this.toastr.error('Please fill out all required fields', 'Error!');
      this.requirementWeightForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.requirementWeightForm.value);
  }

  getAllRequirement() {
    this.requirementService.getAllRequirements().subscribe({
      next: (data: Requirement[] | null) => {
        if (data && Array.isArray(data)) {
          this.requirementData = data;
          this.requirementDataFiltered = [...data];
        } else {
          this.requirementDataFiltered = [];
          this.requirementData = [];
          this.toastr.warning('No Data found.', 'Warning');
        }
      },
      error: err => {
        this.toastr.error('Failed to fetch Requirements.', 'Error');
        console.error('Error fetching users:', err);
      },
    });
  }
  filteredRequirementList() {
    const searchTerm = this.requirementSearchControl.value?.toLowerCase() || '';
    return this.requirementDataFiltered.filter(item => item.reqName.toLowerCase().includes(searchTerm));
  }

  getRequirementIdByName(): void {
    this.requirementWeightForm.get('reqName')?.valueChanges.subscribe(selectedReqName => {
      const selectedRequirement = this.requirementData.find(requirement => requirement.reqName === selectedReqName);

      if (selectedRequirement) {
        this.requirementWeightForm.patchValue({
          requirementId: selectedRequirement.id,
        });
      } else {
        this.requirementWeightForm.patchValue({
          requirementId: null,
        });
      }
    });
  }
}
