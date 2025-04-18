import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Requirement } from 'src/app/requirements/model/requirement.model';
import { RequirementService } from 'src/app/requirements/service/requirement.service';

@Component({
  selector: 'app-appointment-slot-dialog',
  templateUrl: './appointment-slot-dialog.component.html',
  styleUrls: ['./appointment-slot-dialog.component.css'],
})
export class AppointmentSlotDialogComponent implements OnInit {
  requirementData: Requirement[] = [];
  requirementDataFiltered: Requirement[] = [];
  requirementSearchControl = new FormControl();
  slotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private dialogRef: MatDialogRef<AppointmentSlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requirementService: RequirementService
  ) {
    this.slotForm = this.fb.group({
      slots_id: [{ value: data.slot?.slots_id || '', disabled: this.data.isView }],
      requirement_id: [{ value: data.slot?.requirement_id || '', disabled: this.data.isView || this.data.slot }, Validators.required],
      appointment_type: [{ value: data.slot?.appointment_type || '', disabled: this.data.isView }, Validators.required],
      start_date_time: [{ value: data.slot?.start_date_time || '', disabled: this.data.isView || this.data.slot }, Validators.required],
      end_date_time: [{ value: data.slot?.end_date_time || '', disabled: this.data.isView || this.data.slot }, Validators.required],
      time: [{ value: data.slot?.time || '', disabled: this.data.isView || this.data.slot }, [Validators.required]],
      time_unit: [{ value: data.slot?.time_unit || '', disabled: this.data.isView || this.data.slot }, [Validators.required]],
      availablecapacity: [{ value: data.slot?.availablecapacity || '', disabled: this.data.isView }, Validators.required],
      appointment_note: [{ value: data.slot?.appointment_note || '', disabled: this.data.isView || this.data.slot }],
    });
  }

  ngOnInit(): void {
    this.getAllRequirement();
    this.requirementSearchControl.valueChanges.subscribe(() => {
      this.requirementData = this.filteredRequirementList();
    });
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
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: err => {
        this.toaster.error('Failed to fetch Requirements.', 'Error');
        console.error('Error fetching users:', err);
      },
    });
  }
  filteredRequirementList() {
    const searchTerm = this.requirementSearchControl.value?.toLowerCase() || '';
    return this.requirementDataFiltered.filter(item => item.reqName.toLowerCase().includes(searchTerm));
  }
  get appMesssageIdsArray(): FormArray {
    return this.slotForm.get('capacity_appointment_ids.appMesssageIds') as FormArray;
  }

  addMessageId(value: string): void {
    if (value) {
      this.appMesssageIdsArray.push(new FormControl(value));
    }
  }

  removeMessageId(index: number): void {
    this.appMesssageIdsArray.removeAt(index);
  }

  onSave() {
    if (this.slotForm.invalid) {
      this.toaster.error('Please fill out all required fields', 'Error!');
      this.slotForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.slotForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
