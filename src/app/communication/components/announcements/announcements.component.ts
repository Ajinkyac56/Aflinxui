import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { AnnouncementService } from '../../service/announcement/announcement.service';
import { announcementSearchDto } from 'src/app/models/SearchCondition.model';
import { AnnouncementList } from '../../model/announcement.model';
import { NgIfContext } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent implements OnInit {
  hasAccessToAdd: boolean = false;
  hasAccessToView: boolean = false;
  hasAccessToEdit: boolean = false;
  hasAccessToDelete: boolean = false;
  hasAccessToActive: boolean = false;
  selectedAnnouncement: AnnouncementList[] = [];
  announcementsList: AnnouncementList[] = [];
  searchForm: FormGroup;
  noMoreRecords: boolean = false;
  pageableData: announcementSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  isEdit: any;
  editCase: TemplateRef<NgIfContext<boolean>>;
  expandAction: boolean;

  constructor(
    public dialog: MatDialog,
    private userSharedDataService: UserSharedDataService,
    private announcmentService: AnnouncementService,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      messageTitle: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.hasAccess();
    this.searchAnnouncements(true);
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Communication', 'Announcements', 'Add');
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage Communication', 'Announcements', 'View');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Communication', 'Announcements', 'Edit');
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage Communication', 'Announcements', 'Delete');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage Communication', 'Announcements', 'Active/ In Active ');
  }

  searchAnnouncements(clearData: boolean) {
    this.pageableData.messageTitle = this.searchForm.get('messageTitle')?.value;

    if (clearData) {
      this.announcementsList = [];
      this.pageableData.page = 0;
    }

    this.announcmentService.searchAnnouncementList(this.pageableData).subscribe({
      next: (responseData: AnnouncementList[]) => {
        this.announcementsList = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Announcement Data', 'Error!');
      },
    });
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.announcement-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedAnnouncement = [...this.announcementsList];
      } else {
        this.selectedAnnouncement = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedAnnouncement.push(item);
      } else {
        const index = this.selectedAnnouncement.findIndex(data => data.id == item.id);
        if (index >= 0) {
          this.selectedAnnouncement.splice(index, 1);
        }
      }
    }
  }

  onViewClick(data: AnnouncementList) {
    this.router.navigate(['/dashboard/communication/view-announcement'], {
      state: {
        isView: true,
        data: data,
      },
    });
  }

  downloadTableData(): void {
    const csvData = this.announcementsList.map(announcement => ({
      'Announcement Name': announcement.messageTitle,
      Type: announcement.messageType,
      'Users Count': announcement.count,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'announcements.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchAnnouncements(false);
  }

  resetFilter() {
    this.searchForm.reset();
    this.searchAnnouncements(true);
  }

  onEditClick(data: AnnouncementList) {
    throw new Error('Method not implemented.');
  }
}
