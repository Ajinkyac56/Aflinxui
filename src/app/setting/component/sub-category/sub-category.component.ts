import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubCategoryDialogComponent } from 'src/app/dialog/sub-category-dialog/sub-category-dialog.component';
import { SubCategory } from '../../models/sub-category.model';
import { SubCategoryService } from '../../service/sub-category/sub-category.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../service/category/category.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SubCategorySearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css'],
})
export class SubCategoryComponent implements OnInit {
  selectedSubCategories: SubCategory[];
  subCategories: SubCategory[];
  categoryList: Category[];
  categoryListFiltered: Category[];
  categorySearchControl = new FormControl();
  subCategorySearchForm: FormGroup;
  noMoreRecords: boolean = false;
  hasAccessToEdit: boolean;
  hasAccessToAdd: boolean;
  hasAccessToDelete: boolean;
  hasAccessToActive: boolean;
  hasAccessToInactive: boolean;
  hasAccessToDownload: boolean;
  pageableData: SubCategorySearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  isEdit: any;
  expandAction: boolean;

  constructor(
    private dialog: MatDialog,
    private subCategoryService: SubCategoryService,
    private toaster: ToastrService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.subCategorySearchForm = this.fb.group({
      categoryId: [''],
      subCategoryName: [''],
    });
  }

  ngOnInit(): void {
    this.searchSubCategory(true);
    this.getAllCategories();
    this.hasAccess();
    this.categorySearchControl.valueChanges.subscribe(() => {
      this.categoryList = this.filteredCategoryList();
    });
    this.expandAction = environment.expand_action;
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
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: error => {
        this.toaster.error('Unable to Load Speciality data', 'Error!');
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

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Settings', 'Sub Category', 'Add');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Settings', 'Sub Category', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Settings', 'Sub Category', 'Delete');
    this.hasAccessToDownload = this.userSharedDataService.hasAccess('Manage Settings', 'Sub Category', 'Download');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Settings', 'Sub Category', 'Active');
    this.hasAccessToInactive = this.userSharedDataService.hasAccess('Manage Settings', 'Sub Category', 'Inactive');
  }

  openSubCategoryDialog(data?: SubCategory): void {
    const dialogRef = this.dialog.open(SubCategoryDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateSubCategory(result);
        } else {
          this.createSubCategory(result);
        }
      }
    });
  }

  updateSubCategory(subCategory: SubCategory): void {
    const subCategoryId = subCategory.subCategoryId;
    this.subCategoryService.updateSubCategory(subCategoryId, subCategory).subscribe({
      next: () => {
        this.toaster.success('Subcategory updated successfully', 'Success!');
        this.searchSubCategory(true);
      },
      error: () => {
        this.toaster.error('Failed to update subcategory', 'Error!');
      },
    });
  }

  createSubCategory(subCategory: SubCategory): void {
    this.subCategoryService.saveSubCategory(subCategory).subscribe({
      next: () => {
        this.toaster.success('Subcategory created successfully', 'Success!');
        this.searchSubCategory(true);
      },
      error: () => {
        this.toaster.error('Failed to create subcategory', 'Error!');
      },
    });
  }

  deleteSubCategory(subCategoryId: string, isDelete: number): void {
    this.subCategoryService.deleteSubCategory(subCategoryId, isDelete).subscribe({
      next: () => {
        this.toaster.success('SubCategory deleted successfully!', 'Success');
        this.searchSubCategory(true);
      },
      error: error => {
        this.toaster.error('Failed to delete subcategory. Please try again.', 'Error');
      },
    });
  }

  checkBoxValueClicked(event: any, type: any, item: any): void {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.subCatagories-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSubCategories = [...this.subCategories];
      } else {
        this.selectedSubCategories = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedSubCategories.push(item);
      } else {
        const index = this.selectedSubCategories.findIndex(data => data.subCategoryName === item.subCategoryName);
        if (index >= 0) {
          this.selectedSubCategories.splice(index, 1);
        }
      }
    }
  }

  searchSubCategory(clearData: boolean) {
    this.pageableData.categoryId = this.subCategorySearchForm.get('categoryId')?.value;
    this.pageableData.subCategoryName = this.subCategorySearchForm.get('subCategoryName')?.value;

    if (clearData) {
      this.subCategories = [];
      this.pageableData.page = 0;
    }

    this.subCategoryService.searchSubCategory(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.subCategories = [...this.subCategories, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load SubCategory Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchSubCategory(false);
  }

  resetFilter() {
    this.subCategorySearchForm.reset();
    this.searchSubCategory(true);
  }

  downloadTableData(): void {
    const csvData = this.subCategories.map(subCategory => ({
      'Category Name': this.getCategoryNameById(subCategory.categoryId),
      'Sub-Category Name': subCategory.subCategoryName,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sub_categories.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}
