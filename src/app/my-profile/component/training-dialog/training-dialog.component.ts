import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from '../../service/training/training.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-training-dialog',
  templateUrl: './training-dialog.component.html',
  styleUrls: ['./training-dialog.component.css'],
})
export class TrainingDialogComponent implements OnInit {
  trainingForm: FormGroup;
  selectedFile = null;
  usertraining: File | undefined;
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
    private datePipe: DatePipe,
    private userDataService: UserSharedDataService,
    public dialogRef: MatDialogRef<TrainingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.trainingForm = this.fb.group({
      trainingId: [data?.trainingId],
      userId: [data?.userId, [Validators.required]],
      categoryId: [data?.categoryId, [Validators.required]],
      subCategoryId: [data?.subCategoryId, [Validators.required]],
      trainingTitle: [data?.trainingTitle, [Validators.required]],
      grantedBy: [data?.grantedBy, [Validators.required]],
      endDate: [data?.endDate, [Validators.required]],
      startDate: [data?.startDate, [Validators.required]],
      expirationDate: [data?.expirationDate, [Validators.required]],
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
    this.trainingForm.patchValue({ userId });
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
    this.usertraining = $event.currentTarget.files[0];
    if (this.usertraining) {
      const reader = new FileReader();
      reader.onload = e => (this.fileSrc = reader.result);
      reader.readAsDataURL(this.usertraining);
    }
  }

  submitTrainingForm() {
    if (this.trainingForm.invalid) {
      this.toastr.error('Please fill out all required fields before submitting.');
      this.trainingForm.markAllAsTouched();
      return;
    }

    const formattedStartDate = this.datePipe.transform(this.trainingForm.value.startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(this.trainingForm.value.endDate, 'yyyy-MM-dd');

    const trainingData = {
      ...this.trainingForm.value,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    this.dialogRef.close({
      trainingDto: trainingData,
      file: this.usertraining,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
