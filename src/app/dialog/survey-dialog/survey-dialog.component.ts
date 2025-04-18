import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-survey-dialog',
  templateUrl: './survey-dialog.component.html',
  styleUrls: ['./survey-dialog.component.css'],
})
export class SurveyDialogComponent {
  surveyForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<SurveyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.surveyForm = this.fb.group({
      surveyId: [data?.surveyId || ''],
      surveyName: [data?.surveyName || '', [Validators.required, Validators.minLength(2)]],
      surveyDescription: [data?.surveyDescription || ''],
      surveyType: [data?.surveyType || ''],
      createdBy: [data?.createdBy || ''],
      updatedBy: [data?.updatedBy || ''],
      createdAt: [data?.createdAt || ''],
      updatedAt: [data?.updatedAt || ''],
      isDelete: [data?.isDelete || 0],
    });
  }

  onSave(): void {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.surveyForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
