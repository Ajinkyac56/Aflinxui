import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CertificationService } from '../../service/certification/certification.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';

@Component({
  selector: 'app-certification-dialog',
  templateUrl: './certification-dialog.component.html',
  styleUrls: ['./certification-dialog.component.css'],
})
export class CertificationDialogComponent implements OnInit {
  certificationForm: FormGroup;
  selectedFile: File | null = null;
  fileSrc: any;
  userCertification: any;
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
    public dialogRef: MatDialogRef<CertificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.certificationForm = this.fb.group({
      certificateId: [data?.certificateId || null],
      userId: [data?.userId, [Validators.required]],
      categoryId: [data?.categoryId, [Validators.required]],
      subCategoryId: [data?.subCategoryId, [Validators.required]],
      titleOfLicense: [data?.titleOfLicense, [Validators.required]],
      grantedBy: [data?.grantedBy, [Validators.required]],
      certificateDate: [data?.certificateDate, [Validators.required]],
      expirationDate: [data?.expirationDate, [Validators.required]],
      isDelete: [data?.isDelete || 1, [Validators.required]],
      certificationDocumentName: [data?.certificationDocumentName, [Validators.required]],
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
    this.certificationForm.patchValue({ userId });
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFileClick(type: string) {
    document.getElementById(type)?.click();
  }

  fileUpload($event: any) {
    this.userCertification = $event.currentTarget.files[0];
    if (this.userCertification) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(this.userCertification.type)) {
        this.toastr.error('Only PDF, PNG, and JPEG files are allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onload = e => (this.fileSrc = reader.result);
      reader.readAsDataURL(this.userCertification);
      this.toastr.success('File uploaded successfully!');
    }
  }

  submitCertificationForm() {
    if (this.certificationForm.invalid) {
      this.toastr.error('Please fill out all required fields before submitting.');
      this.certificationForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      certificate: this.certificationForm.value,
      file: this.userCertification,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
