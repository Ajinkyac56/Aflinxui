import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-data-dialog',
  templateUrl: './create-data-dialog.component.html',
  styleUrl: './create-data-dialog.component.css',
})
export class CreateDataDialogComponent {
  createForm: FormGroup;
  randomString: string = '';

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreateDataDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.randomString = this.generateRandomString();
    this.createForm = this.fb.group({
      confirmationInput: ['', [Validators.required]],
    });
  }

  generateRandomString(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  preventPaste(event: ClipboardEvent): void {
    event.preventDefault(); // This stops the paste
    this.toastr.warning('Pasting code in this field is not allowed . Please type your input manually.', 'Info');
  }

  confirmCreate() {
    if (this.createForm.value.confirmationInput === this.randomString) {
      this.dialogRef.close(true);
    } else {
      this.toastr.error('Incorrect code! Please try again.', 'Error');
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
