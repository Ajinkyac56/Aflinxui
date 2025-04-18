import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/setting/models/category.model';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css'],
})
export class CategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.categoryForm = this.fb.group({
      createdBy: [data?.createdBy || null],
      updatedBy: [data?.updatedBy || null],
      createdAt: [data?.createdAt || null],
      updatedAt: [data?.updatedAt || null],
      categoryId: [data?.categoryId || null],
      categoryName: [data?.categoryName || '', [Validators.required, Validators.minLength(2)]],
      isDelete: [data?.isDelete || 1],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.categoryForm.invalid) {
      this.toastr.error('Please fill out all required fields.');
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.categoryForm.value);
  }
}
