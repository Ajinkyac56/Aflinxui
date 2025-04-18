import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/components/user/user.service';
import { SquadronService } from '../service/squadron/squadron.service';
import { User } from 'src/app/user/model/user.model';
import { Squadron } from '../../models/squadron.model';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { EmployeeSearchDto } from '../../models/employee-search.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { Router } from '@angular/router';
import { MyProfileDialogComponent } from 'src/app/dialog/my-profile-dialog/my-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-airman',
  templateUrl: './manage-airman.component.html',
  styleUrls: ['./manage-airman.component.css'],
})
export class ManageAirmanComponent implements OnInit {
  airmen: User[] = [];
  squadronList: Squadron[] = [];
  loadingAirmen: boolean = false;
  loadingSquadrons: boolean = false;
  errorAirmen: string | null = null;
  errorSquadrons: string | null = null;
  selectAll: boolean = false;
  hasAccessToView: boolean;
  hasAccessToEdit: boolean;
  hasAccessToActive: boolean;
  airmanSearchForm: FormGroup;
  noMoreRecords: boolean = false;
  loading: any;
  error: any;
  pageableData: EmployeeSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  toaster: any;
  expandAction: boolean;

  constructor(
    private userService: UserService,
    private squadronService: SquadronService,
    private userSharedDataService: UserSharedDataService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.airmanSearchForm = this.fb.group({
      airmanName: ['', [Validators.required]],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchAirman(true, null);
    this.fetchSquadrons();
    this.hasAccess();
  }

  onEditClick(user: User) {
    this.router.navigate(['/dashboard/userAndgroup/createAirman'], {
      state: {
        isEdit: true,
        data: user,
      },
    });
  }

  resetFilter() {
    this.airmanSearchForm.reset;
    this.searchAirman(true, null);
  }

  hasAccess() {
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage User and Groups', 'Manage Airman', 'view');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage User and Groups', 'Manage Airman', 'Edit');
    this.hasAccessToActive = this.userSharedDataService.hasAccess('Manage User and Groups', 'Manage Airman', 'Active/ In Active');
  }

  getProfilePicture(photo: string) {
    return photo && photo.indexOf('https') >= 0 ? photo : 'assets/images/profile/user-1.jpg';
  }

  fetchSquadrons(): void {
    this.loadingSquadrons = true;
    this.errorSquadrons = null;

    this.squadronService.getSquadrons().subscribe({
      next: data => {
        this.squadronList = data;
        this.loadingSquadrons = false;
      },
      error: () => {
        this.loadingSquadrons = false;
        this.errorSquadrons = 'Failed to load squadron data. Please try again later.';
      },
    });
  }

  downloadTableData(): void {
    const csvData = this.airmen.map(airman => ({
      'First Name': airman.firstName,
      'Last Name': airman.lastName,
      Email: airman.email,
      'Squadron/Group': this.getSquadronName(airman.squadronId),
      Role: airman.userType,
      Status: airman.isActive ? 'Active' : 'Inactive',
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airmen_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(value => `"${value}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  loadMoreRecord() {
    if (this.noMoreRecords) {
      return;
    }

    this.pageableData.page += 1;
    this.searchAirman(false, null);
  }

  openAirmanProfileDialog(airman: any): void {
    this.dialog.open(MyProfileDialogComponent, {
      width: '77%',
      maxWidth: '1000px',
      maxHeight: '90vh',
      data: airman,
    });
  }

  getSquadronName(squadronId: string): string {
    const squadron = this.squadronList.filter(s => s.id === squadronId);
    return squadron.length === 1 ? squadron[0].squadronName : '';
  }

  toggleAllRows(selectAll: boolean): void {
    this.selectAll = selectAll;
    this.airmen.forEach(airman => {
      airman.checked = this.selectAll;
    });
  }

  checkIfAllSelected(): void {
    const totalSelected = this.airmen.filter(airman => airman.checked).length;
    this.selectAll = totalSelected === this.airmen.length;
  }

  searchAirman(clearData: boolean, event?: Event) {
    if (event) {
      event.preventDefault();
    }

    this.pageableData.employeeName = this.airmanSearchForm.get('airmanName')?.value;
    this.pageableData.dodId = this.airmanSearchForm.get('dodId')?.value;

    if (clearData) {
      this.airmen = [];
      this.pageableData.page = 0;
      this.noMoreRecords = false;
    }

    this.userService.searchAirman(this.pageableData).subscribe({
      next: (responseData: any) => {
        if (responseData.length < this.pageableData.size) {
          this.noMoreRecords = true;
        }

        this.airmen = [...this.airmen, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Airman Data', 'Error!');
      },
    });
  }
}
