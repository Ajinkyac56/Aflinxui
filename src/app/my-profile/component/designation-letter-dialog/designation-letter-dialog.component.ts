import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DesignationLetterService } from '../../service/designationLetter/designation-letter.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';

@Component({
  selector: 'app-designation-letter-dialog',
  templateUrl: './designation-letter-dialog.component.html',
  styleUrls: ['./designation-letter-dialog.component.css'],
})
export class DesignationLetterDialogComponent implements OnInit {
  designationForm: FormGroup;
  selectedFile: File | null = null;
  userDesignation: File | undefined;
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
    public dialogRef: MatDialogRef<DesignationLetterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.designationForm = this.fb.group({
      designationId: [data?.designationId],
      userId: [data?.userId, [Validators.required]],
      categoryId: [data?.categoryId, [Validators.required]],
      subCategoryId: [data?.subCategoryId, [Validators.required]],
      designationTitle: [data?.designationTitle, [Validators.required]],
      grantedBy: [data?.grantedBy, [Validators.required]],
      designationDate: [data?.designationDate, [Validators.required]],
      expirationDate: [data?.expirationDate, [Validators.required]],
      isDelete: [data?.isDelete || 1, [Validators.required]],
      designationDescription: [data?.designationDescription],
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
    this.designationForm.patchValue({ userId });
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[] | null) => {
        if (data && Array.isArray(data)) {
          this.categoryListFiltered = data;
          this.categoryList = [...data];
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload($event: any) {
    this.userDesignation = $event.currentTarget.files[0];
    if (this.userDesignation) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(this.userDesignation.type)) {
        this.toastr.error('Only PDF, PNG, and JPEG files are allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => (this.fileSrc = reader.result);
      reader.readAsDataURL(this.userDesignation);
      this.toastr.success('File uploaded successfully!');
    }
  }

  submitDesignationForm() {
    if (this.designationForm.invalid) {
      this.toastr.error('Please fill out all required fields before submitting.');
      this.designationForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      designationDto: this.designationForm.value,
      file: this.userDesignation,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
