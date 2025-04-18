import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DeptSubAdminSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloadService } from 'src/app/services/download/download.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeptSubAdminDto } from '../../models/employee-search.model';
import { Department } from '../../models/department.model';
import { DepartmentService } from '../service/department/department.service';
import { UserListDialogComponent } from 'src/app/communication/components/userlist-dialoge/userlist-dialoge.component';

@Component({
  selector: 'app-command-activity-view',
  templateUrl: './command-activity-view.component.html',
  styleUrls: ['./command-activity-view.component.css'],
})
export class CommandActivityViewComponent implements OnInit {
  commandActivityForm: FormGroup;

  deptList: Department;
  deptSubAdminList: DeptSubAdminDto[] = [];
  isView: boolean;
  selectData: DeptSubAdminDto[] = [];
  isCommandActivity: boolean;
  // imageSrc: any = 'assets/images/profile/user-1.jpg';
  hasAccessToDelete: boolean = false;
  pageableData: DeptSubAdminSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  constructor(
    private location: Location,
    private toaster: ToastrService,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private deptService: DepartmentService,
    private userSharedDataService: UserSharedDataService,
    private dialog: MatDialog
  ) {
    this.commandActivityForm = this.fb.group({
      messageGroupId: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initView();
    this.searchDeptSubAdmin(true);
    this.hasAccess();
  }

  hasAccess() {
    this.hasAccessToDelete = this.userSharedDataService.hasAccess('Manage User and Groups', 'Command Activities', 'Delete');
  }

  initView() {
    let currentState: any = this.location.getState();
    this.isView = currentState.isView;
    this.deptList = currentState.deptData;
  }

  searchDeptSubAdmin(clearData: boolean) {
    this.pageableData.name = this.commandActivityForm.get('name')?.value;
    this.pageableData.departmentId = this.deptList.id;

    if (clearData) {
      this.deptSubAdminList = [];
      this.pageableData.page = 0;
    }

    this.deptService.searchSubAdminList(this.pageableData).subscribe({
      next: (responseData: any) => {
        this.deptSubAdminList = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Category Data', 'Error!');
      },
    });
  }

  resetFilter() {
    this.commandActivityForm.reset();
    this.searchDeptSubAdmin(true);
  }

  deleteUserGroup(subAdminUserId: string, deptId: string) {
    const isDelete = 0;
    this.deptService.deleteSubAdminList(subAdminUserId, deptId, isDelete).subscribe({
      next: () => {
        this.toaster.success('Airman Deleted Successfully');
        this.searchDeptSubAdmin(true);
      },
    });
  }

  onViewClick(): void {
    const dialogRef = this.dialog.open(UserListDialogComponent, {
      width: '700px',
      data: {
        isNudgeGroup: false,
        isCommandActivity: true,
        ActivityData: this.deptList,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.searchDeptSubAdmin(true);
    });
  }

  // Handle checkbox selection for users
  checkBoxValueClicked(event: any, type: string, item: DeptSubAdminDto): void {
    const checkbox = event.target as HTMLInputElement;

    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(chk => {
        chk.checked = checkbox.checked;
      });

      this.selectData = checkbox.checked ? [...this.deptSubAdminList] : [];
    } else {
      if (checkbox.checked) {
        this.selectData.push(item);
      } else {
        this.selectData = this.selectData.filter(user => user.subAdminId !== item.subAdminId);
      }
    }
  }

  isUserSelected(user: DeptSubAdminDto): boolean {
    return this.selectData.some(selectedUser => selectedUser.id === user.id);
  }
}
