import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ChecklistSearchDto } from 'src/app/models/SearchCondition.model';
import { checklist } from '../../models/checklist.model';
import { ChecklistService } from '../../service/checklist/checklist.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ManageChecklistDialogComponent } from 'src/app/dialog/manage-checklist-dialog/manage-checklist-dialog.component';
import { environment } from 'src/environments/environment';
import { ChecklistsTaskDialogComponent } from 'src/app/dialog/checklists-task-dialog/checklists-task-dialog.component';
import { Router } from '@angular/router';
import { ChecklistTaskService } from '../../service/checklist/checklistTask.service';

@Component({
  selector: 'app-manage-checklist',
  templateUrl: './manage-checklist.component.html',
  styleUrl: './manage-checklist.component.css',
})
export class ManageChecklistComponent {
  expandAction: boolean = false; // False shows individual buttons, true shows dropdown
  noMoreRecords: boolean = false;
  pageableData: ChecklistSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  searchForm: FormGroup;
  checkList: checklist[] = [];
  selectedChecklists: checklist[] = []; // For checkbox selection
  tasks: any;

  constructor(
    private checklistService: ChecklistService, // Corrected service name
    private toaster: ToastrService,
    private fb: FormBuilder, // Add FormBuilder
    private dialog: MatDialog,
    private router: Router,
    private checklistTaskService: ChecklistTaskService
  ) {
    // Initialize the search form
    this.searchForm = this.fb.group({
      checklistName: [''], // Form control for search input
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchChecklists(true); // Initial search with clear
  }

  searchChecklists(clearData: boolean = true) {
    this.pageableData.checklistName = this.searchForm.get('checklistName')?.value;

    if (clearData) {
      this.checkList = [];
      this.pageableData.page = 0;
    }

    this.checklistService.searchChecklist(this.pageableData).subscribe({
      next: (responseData: checklist[]) => {
        if (clearData) {
          this.checkList = responseData;
        } else {
          this.checkList = [...this.checkList, ...responseData]; // Append for "Load More"
        }
        this.noMoreRecords = responseData.length < this.pageableData.size; // Update noMoreRecords
      },
      error: error => {
        this.toaster.error('Unable to Load Checklist Data', 'Error!');
      },
    });
  }

  updateChecklist(checklist: checklist) {
    const checklistId = checklist.checklistId;

    this.checklistService.updateChecklist(checklistId, checklist).subscribe({
      next: () => {
        this.toaster.success('Checklist Updated Successfully', 'Sucess!');
        this.searchChecklists(true);
      },
      error: error => {
        this.toaster.error('Failed to update Checklist', 'Error!');
      },
    });
  }

  deleteChecklist(categoryId: string, isDelete: number) {
    this.checklistService.deleteChecklist(categoryId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Checklist Delete Successfully', 'Sucess!');
        this.searchChecklists(true);
      },
      error: error => {
        this.toaster.error('Failed to Delete Checklist', 'Error!');
      },
    });
  }

  openAddTaskDialog(data?: checklist): void {
    const dialogRef = this.dialog.open(ChecklistsTaskDialogComponent, {
      maxHeight: '100vh',
      maxWidth: '90vw',
      width: '600px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addChecklistTask(result);
      }
    });
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchChecklists(false); // Append data without clearing
  }

  resetFilter() {
    this.searchForm.reset();
    this.searchChecklists(true); // Reset and search
  }

  addChecklist(checklist: checklist) {
    this.checklistService.addChecklist(checklist).subscribe({
      next: () => {
        this.toaster.success('Category Saved Successfully', 'Sucess!');
        this.searchChecklists(true);
      },
      error: error => {
        this.toaster.error('Unable to Create Checklist', 'Error!');
      },
    });
  }

  openChecklistDialog(data?: checklist): void {
    const dialogRef = this.dialog.open(ManageChecklistDialogComponent, {
      width: '500px',
      height: '370px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateChecklist(result);
        } else {
          this.addChecklist(result);
        }
      }
    });
  }

  checkBoxValueClicked(event: any, type: string, item?: checklist) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.Checklist-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedChecklists = [...this.checkList];
      } else {
        this.selectedChecklists = [];
      }
    } else if (item) {
      if (targetCheckbox.checked) {
        this.selectedChecklists.push(item);
      } else {
        const index = this.selectedChecklists.findIndex(data => data.checklistId === item.checklistId);
        if (index >= 0) {
          this.selectedChecklists.splice(index, 1);
        }
      }
    }
  }

  downloadTableData() {
    const csvData = this.checkList.map(checklist => ({
      'Checklist Name': checklist.checklistName,
      Type: checklist.checklistType,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manage-checklists.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }

  onViewClick(data?: checklist) {
    this.router.navigate(['/dashboard/settings/checklist-view'], {
      state: {
        isView: true,
        data: data,
      },
    });
  }

  addChecklistTask(task: any): void {
    this.checklistTaskService.addTask(task).subscribe({
      next: response => {
        this.searchChecklists(true);
        this.toaster.success('Task Added Successfully', 'Success!');
      },
      error: error => {
        console.error('Error adding task:', error);
      },
    });
  }
}
