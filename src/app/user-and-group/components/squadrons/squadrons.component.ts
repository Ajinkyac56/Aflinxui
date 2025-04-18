import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SquadronService } from '../service/squadron/squadron.service';
import { SquadronDialogComponent } from '../squadron-dialog/squadron-dialog.component';
import { Squadron } from '../../models/squadron.model';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { SquadronSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-squadron',
  templateUrl: './squadrons.component.html',
  styleUrls: ['./squadrons.component.css'],
})
export class SquadronComponent implements OnInit {
  squadronList: Squadron[] = [];
  selectedSquadron: Squadron[];
  hasAccessToView: boolean;
  hasAccessToEdit: boolean;
  hasAccessToDelete: boolean;
  hasAccessToAdd: boolean;
  noMoreRecords: boolean = false;
  squadronSearchForm: FormGroup;
  pageableData: SquadronSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  expandAction: boolean;

  constructor(
    private dialog: MatDialog,
    private squadronService: SquadronService,
    private toastr: ToastrService,
    private userSharedDataService: UserSharedDataService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.squadronSearchForm = this.fb.group({
      squadronName: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.hasAccess();
    this.searchSquadrons(true);
  }

  hasAccess() {
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage User and Groups', 'Squadrons', 'View');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage User and Groups', 'Squadrons', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage User and Groups', 'Squadrons', 'Delete');
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage User and Groups', 'Squadrons', 'Add');
  }

  searchSquadrons(clearData: boolean) {
    this.pageableData.squadronName = this.squadronSearchForm.get('squadronName')?.value;

    if (clearData) {
      this.squadronList = [];
      this.pageableData.page = 0;
    }

    this.squadronService.searchSqauadron(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.squadronList = [...this.squadronList, ...responseData];
        if (responseData.length < this.pageableData.size) {
          this.noMoreRecords = false;
        } else {
          this.noMoreRecords = true;
        }
      },
      error: error => {
        this.toastr.error('Unable to Load Squadron Data', 'Error!');
      },
    });
  }

  resetFilter() {
    this.squadronSearchForm.reset();
    this.searchSquadrons(true);
  }

  downloadTableData(): void {
    const csvData = this.squadronList.map(squadron => ({
      'Squadron Name': squadron.squadronName,
      Admin: squadron.adminUser,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'squadrons.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(value => `"${value}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchSquadrons(false);
  }

  openSquadronDialog(isView: boolean, member?: any): void {
    const dialogRef = this.dialog.open(SquadronDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: '600px',
      height: 'auto',
      data: { member, isView },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { squadron, logo } = result;
        if (member) {
          this.updateSquadron(logo, squadron);
        } else {
          this.saveSquadron(logo, squadron);
        }
      }
    });
  }

  onViewClick(data: Squadron) {
    this.router.navigate(['/dashboard/userAndgroup/squadrons-subAdmin-view'], {
      state: {
        isView: true,
        squadron: data,
      },
    });
  }

  onDeleteSquadron(memberId: string, isDelete: number): void {
    if (confirm('Are you sure you want to delete this member?')) {
      this.squadronService.deleteSquadron(memberId.toString(), 0).subscribe({
        next: () => {
          this.toastr.success('Member deleted successfully.', 'Success');
          this.searchSquadrons(true);
        },
        error: () => {
          this.toastr.success('Member deleted successfully.', 'Success');
          this.searchSquadrons(true);
        },
      });
    }
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.squadron-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSquadron = [...this.squadronList];
      } else {
        this.selectedSquadron = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedSquadron.push(item);
      } else {
        const index = this.selectedSquadron.findIndex(data => data.squadronName == item.squadronName);
        if (index >= 0) {
          this.selectedSquadron.splice(index, 1);
        }
      }
    }
  }

  saveSquadron(logo: File, squadron: Squadron) {
    this.squadronService.saveSquadron(logo, squadron).subscribe({
      next: response => {
        this.toastr.success('Squadron saved successfully!', 'Success');
        this.searchSquadrons(true);
      },
      error: err => {
        this.toastr.error('Failed to save squadron.', 'Error');
        console.error('Error saving squadron:', err);
      },
    });
  }

  updateSquadron(logo: File, squadron: Squadron) {
    this.squadronService.updateSquadron(logo, squadron).subscribe({
      next: () => {
        this.toastr.success('Squadron Updated Successfully', 'Success!');
        this.searchSquadrons(true);
      },
      error: error => {
        this.toastr.error('Failed to update Squadron', 'Error!');
      },
    });
  }
}
