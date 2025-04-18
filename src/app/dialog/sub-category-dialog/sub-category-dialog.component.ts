import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/setting/models/category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { SubCategory } from 'src/app/setting/models/sub-category.model';

@Component({
  selector: 'app-sub-category-dialog',
  templateUrl: './sub-category-dialog.component.html',
  styleUrls: ['./sub-category-dialog.component.css'],
})
export class SubCategoryDialogComponent implements OnInit {
  subCategoryForm: FormGroup;
  categoryList: Category[] = [];
  categoryListFiltered: Category[] = [];
  categorySearchControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SubCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubCategory
  ) {
    this.subCategoryForm = this.fb.group({
      categoryId: [data?.categoryId, Validators.required],
      subCategoryName: [data?.subCategoryName, [Validators.required, Validators.minLength(2)]],
      subCategoryId: [data?.subCategoryId],
      isDelete: [data?.isDelete],
      createdBy: [data?.createdBy],
      updatedBy: [data?.updatedBy],
      createdAt: [data?.createdAt],
      updatedAt: [data?.updatedAt],
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.categorySearchControl.valueChanges.subscribe(() => {
      this.categoryList = this.filteredCategoryList();
    });
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[] | null) => {
        if (data && Array.isArray(data)) {
          this.categoryList = data;
          this.categoryListFiltered = [...data];
        } else {
          this.categoryListFiltered = [];
          this.categoryList = [];
          this.toastr.warning('No Data found.', 'Warning');
        }
      },
      error: error => {
        this.toastr.error('Unable to Load Speciality data', 'Error!');
      },
    });
  }
  filteredCategoryList() {
    const searchTerm = this.categorySearchControl.value?.toLowerCase() || '';
    return this.categoryListFiltered.filter(item => item.categoryName.toLowerCase().includes(searchTerm));
  }

  onSave(): void {
    if (this.subCategoryForm.invalid) {
      this.toastr.error('Please fill out all required fields.');
      this.subCategoryForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.subCategoryForm.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
