import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-speciality-dialog',
  templateUrl: './speciality-dialog.component.html',
  styleUrls: ['./speciality-dialog.component.css'],
})
export class SpecialityDialogComponent {
  specialityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SpecialityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.specialityForm = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      isDelete: [data?.isDelete || 1],
      createdBy: [data?.createdBy || null],
      updatedBy: [data?.updatedBy || null],
      createdAt: [data?.createdAt || null],
      updatedAt: [data?.updatedAt || null],
    });
  }

  onSave(): void {
    if (this.specialityForm.invalid) {
      this.toastr.error('Please fill out all required fields', 'Error!');
      this.specialityForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.specialityForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
