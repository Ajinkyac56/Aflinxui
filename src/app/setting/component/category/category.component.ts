import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../service/category/category.service';
import { CategoryDialogComponent } from 'src/app/dialog/category-dialog/category-dialog.component';
import { Category } from '../../models/category.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategorySeachDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  isLoading: boolean = false;
  categorySearchForm: FormGroup;
  noMoreRecords: boolean = false;
  hasAccessToAdd: boolean;
  hasAccessToEdit: boolean;
  hasAccessToDelete: boolean;
  hasAccessToDownload: boolean;
  hasAccessToActive: boolean;
  hasAccessToInactive: boolean;
  pageableData: CategorySeachDto = {
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
    private categoryService: CategoryService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private userSharedDataService: UserSharedDataService
  ) {
    this.categorySearchForm = this.fb.group({
      categoryName: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchCategory(true);
    this.hasAccess();
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.catagories-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedCategories = [...this.categories];
      } else {
        this.selectedCategories = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedCategories.push(item);
      } else {
        const index = this.selectedCategories.findIndex(data => data.categoryName == item.categoryName);
        if (index >= 0) {
          this.selectedCategories.splice(index, 1);
        }
      }
    }
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Add');
    this.hasAccessToDownload = this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Download');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Delete');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Active');
    this.hasAccessToInactive = this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Inactive');
  }

  openCategoryDialog(data?: Category): void {
    if (!this.userSharedDataService.hasAccess('Manage Settings', 'Category', 'Add')) {
      this.toaster.warning("You don't have access to Add Requirement", 'INVALID ACCESS !');
      return;
    }

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      height: '250px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateCategory(result);
        } else {
          this.addCategory(result);
        }
      }
    });
  }

  getCategoryById(categoryId: string) {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: responseData => {
        return responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Category', 'Error!');
      },
    });
  }

  addCategory(categoryData: Category) {
    this.categoryService.addCategory(categoryData).subscribe({
      next: () => {
        this.toaster.success('Category Saved Successfully', 'Sucess!');
        this.searchCategory(true);
      },
      error: error => {
        this.toaster.error('Unable to Create Category', 'Error!');
      },
    });
  }

  updateCategory(categoryData: Category) {
    const categoryId = categoryData.categoryId;

    this.categoryService.updateCategory(categoryId, categoryData).subscribe({
      next: () => {
        this.toaster.success('Category Updated Successfully', 'Sucess!');
        this.searchCategory(true);
      },
      error: error => {
        this.toaster.error('Failed to update Category', 'Error!');
      },
    });
  }

  deleteCategory(categoryId: string, isDelete: number) {
    this.categoryService.deleteCategory(categoryId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Category Delete Successfully', 'Sucess!');
        this.searchCategory(true);
      },
      error: error => {
        this.toaster.error('Failed to Delete Category', 'Error!');
      },
    });
  }

  searchCategory(clearData: boolean) {
    this.pageableData.categoryName = this.categorySearchForm.get('categoryName')?.value;

    if (clearData) {
      this.categories = [];
      this.pageableData.page = 0;
    }

    this.categoryService.searchCategory(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.categories = [...this.categories, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Category Data', 'Error!');
      },
    });
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchCategory(false);
  }

  resetFilter() {
    this.categorySearchForm.reset();
    this.searchCategory(true);
  }

  downloadTableData(): void {
    const csvData = this.categories.map((category: any) => ({
      'Category Name': category.categoryName,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories.csv';
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
