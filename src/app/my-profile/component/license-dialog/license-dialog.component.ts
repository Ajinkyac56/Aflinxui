import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';

@Component({
  selector: 'app-license-dialog',
  templateUrl: './license-dialog.component.html',
  styleUrls: ['./license-dialog.component.css'],
})
export class LicenseDialogComponent implements OnInit {
  licenseForm: FormGroup;
  selectedFile: File | null = null;
  userLicense: File | undefined;
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
    public dialogRef: MatDialogRef<LicenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.licenseForm = this.fb.group({
      licensesId: [data?.licensesId],
      userId: [data?.userId, [Validators.required]],
      categoryId: [data?.categoryId, [Validators.required]],
      subCategoryId: [data?.subCategoryId, [Validators.required]],
      licenseTitle: [data?.licenseTitle, [Validators.required]],
      grantedBy: [data?.grantedBy, [Validators.required]],
      licenseDate: [data?.licenseDate, [Validators.required]],
      licenseExpireDate: [data?.licenseExpireDate, [Validators.required]],
      isDelete: [data?.isDelete || 1, [Validators.required]],
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
    this.licenseForm.patchValue({ userId });
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

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload($event: any) {
    this.userLicense = $event.currentTarget.files[0];
    if (this.userLicense) {
      const reader = new FileReader();
      reader.onload = e => (this.fileSrc = reader.result);
      reader.readAsDataURL(this.userLicense);
    }
  }

  submitLicenseForm() {
    if (this.licenseForm.invalid) {
      this.toastr.error('Please fill out all required fields before submitting.');
      this.licenseForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      licenseDto: this.licenseForm.value,
      file: this.userLicense,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
