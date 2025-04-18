import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EducationService } from '../../service/education/education.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';

@Component({
  selector: 'app-education-dialog',
  templateUrl: './education-dialog.component.html',
  styleUrls: ['./education-dialog.component.css'],
})
export class EducationDialogComponent implements OnInit {
  educationForm: FormGroup;
  userEducation: File | undefined;
  fileSrc: any;
  categoryList: Category[];
  categoryListFiltered: Category[];
  categorySearchControl = new FormControl();
  subCategoryList: SubCategory[];
  subCategoryListFiltered: SubCategory[];
  subCategorySearchControl = new FormControl();

  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userDataService: UserSharedDataService,
    public dialogRef: MatDialogRef<EducationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.educationForm = this.fb.group({
      educationid: [data?.educationid],
      userId: [data?.userId, [Validators.required]],
      categoryId: [data?.categoryId, [Validators.required]],
      nameOfTheAccreditedSchool: [data?.nameOfTheAccreditedSchool, [Validators.required]],
      fieldOfStudy: [data?.fieldOfStudy, [Validators.required]],
      graduationYear: [data?.graduationYear, [Validators.required]],
      certificateEarned: [data?.certificateEarned, [Validators.required]],
      educationDescription: [data?.educationDescription],
      fileName: [data?.fileName],
    });
  }

  ngOnInit(): void {
    this.getUserId();
    this.getAllCategories();
    this.getAllSubCategories();
    this.subCategorySearchControl.valueChanges.subscribe(() => {
      this.subCategoryList = this.filteredSubCategoryList();
    });
    this.categorySearchControl.valueChanges.subscribe(() => {
      this.categoryList = this.filteredCategoryList();
    });
  }

  getUserId() {
    const userId = this.userDataService.getUserId();
    this.educationForm.patchValue({ userId });
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

  getCategoryNameById(categoryId: string): string {
    const category = this.categoryList.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : 'Category Not Found';
  }

  getAllSubCategories(): void {
    this.subCategoryService.getAllSubCategory().subscribe({
      next: (responseData: SubCategory[] | null) => {
        if (responseData && Array.isArray(responseData)) {
          this.subCategoryList = responseData;
          this.subCategoryListFiltered = [...responseData];
        } else {
          this.subCategoryListFiltered = [];
          this.subCategoryList = [];
          this.toastr.warning('No Data found.', 'Warning');
        }
      },
      error: error => {
        this.toastr.error('Unable to Load Sub Category data', 'Error!');
      },
    });
  }
  filteredSubCategoryList() {
    const searchTerm = this.subCategorySearchControl.value?.toLowerCase() || '';
    return this.subCategoryListFiltered.filter(item => item.subCategoryName.toLowerCase().includes(searchTerm));
  }

  getSubCategoryNameById(subCategoryId: string): string {
    const subCategory = this.subCategoryList.find(cat => cat.subCategoryId === subCategoryId);
    return subCategory ? subCategory.subCategoryName : 'Sub Category Not Found';
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload(event: any): void {
    this.userEducation = event.target.files[0];
    if (this.userEducation) {
      const reader = new FileReader();
      reader.onload = e => (this.fileSrc = reader.result);
      reader.readAsDataURL(this.userEducation);
    }
  }

  submitEducationForm(): void {
    if (this.educationForm.invalid) {
      this.toastr.error('Please fill out all required fields before submitting.');
      this.educationForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      educationDto: this.educationForm.value,
      file: this.userEducation,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
