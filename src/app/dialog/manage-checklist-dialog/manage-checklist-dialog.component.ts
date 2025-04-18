import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ChecklistService } from 'src/app/setting/service/checklist/checklist.service';
import { checklist } from 'src/app/setting/models/checklist.model';
import { ManageChecklistComponent } from 'src/app/setting/component/manage-checklist/manage-checklist.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-checklist-dialog',
  templateUrl: './manage-checklist-dialog.component.html',
  styleUrl: './manage-checklist-dialog.component.css',
})
export class ManageChecklistDialogComponent {
  checklistForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<ManageChecklistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: checklist | null // Inject data for edit mode
  ) {
    // Initialize the form with default or provided data
    this.checklistForm = this.fb.group({
      checklistId: [data?.checklistId || null],
      checklistName: [data?.checklistName || '', [Validators.required, Validators.minLength(2)]],
      checklistType: [data?.checklistType || 'Readiness'], // Default to 'Readiness' if no data
      createdAt: [data?.createdAt || null],
      updatedAt: [data?.updatedAt || null],
      createdBy: [data?.createdBy || null],
      updatedBy: [data?.updatedBy || null],
      isDelete: [data?.isDelete || 1], // Default to 1 (not deleted)
    });
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close dialog without saving
  }

  submitForm(): void {
    if (this.checklistForm.invalid) {
      this.toastr.error('Please fill out all required fields.');
      this.checklistForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.checklistForm.value); // Close dialog and return form data
  }
}
