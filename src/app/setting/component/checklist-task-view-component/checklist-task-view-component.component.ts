import { Component, OnInit } from '@angular/core';
import { ChecklistTaskService } from '../../service/checklist/checklistTask.service'; // Adjust path as needed
import { TaskPayload } from '../../models/checklistTask.model';
import { Location } from '@angular/common';
import { checklist } from '../../models/checklist.model';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ChecklistsTaskDialogComponent } from 'src/app/dialog/checklists-task-dialog/checklists-task-dialog.component';

@Component({
  selector: 'app-checklist-task-view-component',
  templateUrl: './checklist-task-view-component.component.html',
  styleUrl: './checklist-task-view-component.component.css',
})
export class ChecklistTaskViewComponent implements OnInit {
  tasks: TaskPayload[] = [];
  isView: boolean = false;
  checklist: checklist;
  expandAction: boolean = false;
  selectedTaskList: TaskPayload[] = [];
  taskList: any;

  constructor(
    private checklistTaskService: ChecklistTaskService,
    private location: Location,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.initView();
    this.loadTasks();
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.checklist = currentState.data;
  }

  loadTasks(): void {
    const checklistId = this.checklist.checklistId;
    this.checklistTaskService.getChecklistTasks(checklistId).subscribe({
      next: tasks => {
        this.tasks = tasks; // Assign fetched tasks to the component property
      },
      error: error => {
        console.error('Error fetching tasks:', error);
        // Handle error (e.g., show an error message)
      },
    });
  }

  updateChecklistTask(task: TaskPayload) {
    const taskId = task.taskId;

    this.checklistTaskService.updateChecklistTask(taskId, task).subscribe({
      next: () => {
        this.toaster.success('Checklist Task Updated Successfully', 'Sucess!');
        this.loadTasks();
      },
      error: error => {
        this.toaster.error('Failed to update Checklist Task', 'Error!');
      },
    });
  }

  onSave(task: any): void {
    this.checklistTaskService.addTask(task).subscribe({
      next: response => {
        this.toaster.success('Task Added Successfully', 'Success!');
      },
      error: error => {
        console.error('Error adding task:', error);
      },
    });
  }
  openChecklistTaskDialog(data?: TaskPayload): void {
    const dialogRef = this.dialog.open(ChecklistsTaskDialogComponent, {
      maxHeight: '100vh',
      maxWidth: '90vw',
      width: '600px',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (data) {
          this.updateChecklistTask(result);
        } else {
          this.onSave(result);
        }
      }
    });
  }

  deleteChecklistTask(taskId: string, isDelete: number) {
    this.checklistTaskService.deleteChecklist(taskId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Checklist Task Delete Successfully', 'Sucess!');
        this.loadTasks();
      },
      error: error => {
        this.toaster.error('Failed to Delete Checklist Task', 'Error!');
      },
    });
  }

  downloadTableData() {
    const csvData = this.tasks.map(tasklist => ({
      'Task Name': tasklist.taskName,
      Notes: tasklist.taskNote,
      'Yes/No': tasklist.showYes,
      Upload: tasklist.showUpload,
      QR: tasklist.showQr,
      'Created At': tasklist.createdAt,
      'Updated At': tasklist.updatedAt,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checklist-view.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }

  checkBoxValueClicked(event: any, type: string, item?: TaskPayload) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.Checklist-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedTaskList = [...this.taskList];
      } else {
        this.selectedTaskList = [];
      }
    } else if (item) {
      if (targetCheckbox.checked) {
        this.selectedTaskList.push(item);
      } else {
        const index = this.selectedTaskList.findIndex(data => data.taskId === item.taskId);
        if (index >= 0) {
          this.selectedTaskList.splice(index, 1);
        }
      }
    }
  }
}
