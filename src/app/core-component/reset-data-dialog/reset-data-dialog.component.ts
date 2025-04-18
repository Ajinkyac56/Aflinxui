import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-data-dialog',
  templateUrl: './reset-data-dialog.component.html',
  styleUrl: './reset-data-dialog.component.css',
})
export class ResetDataDialogComponent {
  resetForm: FormGroup;
  randomString: string = '';

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ResetDataDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.randomString = this.generateRandomString();
    this.resetForm = this.fb.group({
      confirmationInput: ['', [Validators.required]],
    });
  }

  generateRandomString(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  confirmReset() {
    if (this.resetForm.value.confirmationInput === this.randomString) {
      this.dialogRef.close(true);
    } else {
      this.toastr.error('Incorrect code! Please try again.', 'Error');
    }
  }

  preventPaste(event: ClipboardEvent): void {
    event.preventDefault(); // This stops the paste
    this.toastr.warning('Pasting is not allowed in this field. Please type your input manually.', 'Info');
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
