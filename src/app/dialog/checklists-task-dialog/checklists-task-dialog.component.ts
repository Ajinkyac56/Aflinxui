import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-checklists-task-dialog',
  templateUrl: './checklists-task-dialog.component.html',
  styleUrl: './checklists-task-dialog.component.css',
})
export class ChecklistsTaskDialogComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ChecklistsTaskDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.taskForm = this.fb.group({
      taskId: [data?.taskId || ''],
      checklistId: [data?.checklistId || ''],
      taskName: [data?.taskName || '', [Validators.required, Validators.minLength(2)]],
      taskNote: [data?.taskNote || ''],
      showYes: [data?.showYes || false],
      showNotes: [data?.showNotes || false],
      showUpload: [data?.showUpload || false],
      showQr: [data?.showQr || false],
      createdAt: [data?.createdAt || ''],
      updatedAt: [data?.updatedAt || ''],
      createdBy: [data?.createdBy || ''],
      updatedBy: [data?.updatedBy || ''],
      isDelete: [data?.isDelete || 1],
    });
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.taskForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
