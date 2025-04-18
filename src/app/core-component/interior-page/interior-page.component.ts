import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MasterSelectType, SELECT_TYPE } from 'src/app/models/master.select-type.model';
import { AuthGuardService } from 'src/app/security/auth-guard.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { UserService } from 'src/app/services/components/user/user.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { MasterSelectTypeService } from 'src/app/services/master/master-select-type.service';
import { User } from 'src/app/user/model/user.model';
import { MENU_CONFIG, MenuItem } from 'src/app/utils/menu-config';
import { loadHeadScript } from 'src/app/utils/script.utils';
import { WebSocketService } from 'src/app/websocket/services/web-socket.service';
import { environment } from 'src/environments/environment';
import { ResetDataDialogComponent } from '../reset-data-dialog/reset-data-dialog.component';
import { CreateDataDialogComponent } from '../create-data-dialog/create-data-dialog.component';

@Component({
  selector: 'app-interior-page',
  templateUrl: './interior-page.component.html',
  styleUrls: ['./interior-page.component.css'],
})
export class InteriorPageComponent implements OnInit {
  menuConfig: MenuItem[] = [];
  loggedInUser: User | undefined;
  partnerItem: User;
  designationData: MasterSelectType[] = [];
  balanceWalletAmount: number = 0;
  userPhoto: File | undefined;
  imageSrc: any;
  public userType: any;
  notificationCount: any;
  notifications: any;

  constructor(
    private authGuardService: AuthGuardService,
    private masterSelectTypeService: MasterSelectTypeService,
    private router: Router,
    private userSharedDataService: UserSharedDataService,
    private cd: ChangeDetectorRef,
    private toaster: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog,
    private userService: UserService,
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private webSocketService: WebSocketService
  ) {
    this.initMenuItem();
    this.loggedInUser = this.userSharedDataService.getUserDetails();
  }

  ngOnInit(): void {
    // this.getProfilePhoto();
    // this.getUpdatednotification();
    loadHeadScript('assets/js/app.min.js', 'app.min.js');
    loadHeadScript('assets/js/app.init.js', 'app.init.js');
    loadHeadScript('assets/js/sidebarmenu.js', 'sidebarmenu.js');
    loadHeadScript('assets/js/custom.js', 'custom.js');
    loadHeadScript('assets/libs/prismjs/prism.js', 'prism.js');
    this.router.navigate([this.menuConfig[0].routeLink]);
    this.cd.detectChanges();
    this.userType = localStorage.getItem('userType');
  }
  initMenuItem() {
    let menu_Details: MenuItem[] = MENU_CONFIG;
    menu_Details.forEach((element: any) => {
      if (element.featureGroup && element.feature && element.action) {
        if (element.childItem.length == 0) {
          if (this.userSharedDataService.hasAccess(element.featureGroup, element.feature, element.action)) this.menuConfig.push(element);
        } else {
          var childItems1: MenuItem[] = [];
          element.childItem.forEach((child1: any) => {
            if (child1.childItem.length == 0) {
              if (this.userSharedDataService.hasAccess(child1.featureGroup, child1.feature, child1.action)) childItems1.push(child1);
            } else {
              var childItems2: MenuItem[] = [];
              child1.childItem.forEach((child2: any) => {
                if (this.userSharedDataService.hasAccess(child1.featureGroup, child2.feature, child2.action)) childItems2.push(child1);
              });
              child1.childItem = childItems2;
            }
          });
          element.childItem = childItems1;
          if (element.childItem.length > 0) {
            this.menuConfig.push(element);
          }
        }
      } else {
        this.menuConfig.push(element);
      }
    });
  }
  logout() {
    this.authGuardService.logout();
    this.userSharedDataService.logout();
    this.router.navigateByUrl('/login');
    window.location.reload();
  }
  isProdEnvironment(): boolean {
    return environment.production;
  }
  onResetPasswordClick() {
    if (this.loggedInUser) {
      var partnerIds: string[] = [];
      var userIds: string[] = [];
      userIds.push(this.loggedInUser.id);
      this.authService.resetPasswordRequest(userIds, partnerIds).subscribe({
        next: responseData => {
          this.toaster.success('Reset password link sent on registered email', 'Success!');
        },
        error: error => {
          this.toaster.error('Unable to sent reset password link', 'Error!');
        },
      });
    }
  }

  onSelectFile(event) {
    this.userPhoto = event.currentTarget.files[0];
    if (this.userPhoto) {
      const reader = new FileReader();
      reader.onload = e => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.userPhoto);
    }
    this.userService.profileUpload(JSON.parse(localStorage.getItem('aflinxLoggedInUser')).email, this.userPhoto).subscribe({
      next: res => {
        localStorage.setItem('profilePath', res.Path);
      },
      error: error => {
        this.toaster.error(error.error);
      },
    });
  }

  getProfilePhoto() {
    const filePath = this.loggedInUser.photo;
    this.downloadService.downloadFileService(filePath).subscribe({
      next: responseData => {
        const reader = new FileReader();
        reader.onload = e => {
          this.imageSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(reader.result.toString());
        };
        reader.readAsDataURL(responseData);
      },
      error: error => {
        console.error('Error downloading file:', error);
      },
    });
  }

  getUpdatednotification() {
    this.webSocketService.notification.subscribe(data => {
      var notification = [...new Set(data)];
      this.notificationCount = notification.length;
      this.getNotifications();
    });
  }
  notificationDate: any;
  getNotifications() {
    this.webSocketService.getNotifications(this.loggedInUser.id).subscribe({
      next: responseData => {
        if (responseData.notifications == 'no message') {
          this.notifications = undefined;
        } else {
          this.notifications = responseData.notifications;
        }
      },
    });
  }

  notificationClick() {
    this.notificationCount = 0;
    localStorage.removeItem('bellCount');
  }

  openResetDialog() {
    const dialogRef = this.dialog.open(ResetDataDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetData();
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateDataDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createData();
      }
    });
  }

  createData() {
    this.authService.createData().subscribe({
      next: () => {
        this.toaster.success('Data created successfully', 'Success');
      },
      error: err => {
        this.toaster.error('Failed to create data. Please try again.', 'Error');
      },
    });
  }

  resetData() {
    this.authService.resetData().subscribe({
      next: () => {
        this.toaster.success('Data reset successfully', 'Success');
      },
      error: err => {
        this.toaster.error('Failed to reset data. Please try again.', 'Error');
      },
    });
  }
}
