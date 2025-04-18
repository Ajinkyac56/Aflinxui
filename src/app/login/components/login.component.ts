import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AuthModel } from '../models/AuthModel';
import { AuthGuardService } from 'src/app/security/auth-guard.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { PermissionService } from 'src/app/services/master/permission/permission.service';
import { environment } from 'src/environments/environment.prod';
import { UserService } from 'src/app/services/components/user/user.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  signForm: FormGroup;
  isMouVerified: false;
  showPassword = false;
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    if (environment.key_disable) {
      event.preventDefault();
    }
  }

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private authGuardService: AuthGuardService,
    private toaster: ToastrService,
    private router: Router,
    private userSharedDataService: UserSharedDataService,
    private permissionService: PermissionService,
    private userService: UserService
  ) {
    this.signForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngAfterViewInit(): void {
    var a = $('.bxslider').bxSlider({
      minSlides: 2,
      maxSlides: 3,
      mode: 'horizontal',
      adaptiveHeight: true,
      slideWidth: 150,
      moveSlides: 10,
      auto: true,
      pager: false,
      slideMargin: 5,
      controls: false,
    });
  }
  ngOnInit(): void {
    if (environment.key_disable) {
      document.addEventListener('keydown', event => {
        if (
          event.key === 'F12' || // F12 for Developer Tools
          (event.ctrlKey && event.shiftKey && event.key === 'I') ||
          (event.ctrlKey && event.shiftKey && event.key === 'C') ||
          (event.ctrlKey && event.key === 'U')
        ) {
          event.preventDefault();
        }
      });
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  signin() {
    if (!this.signForm.valid) {
      return;
    }
    const authModel: AuthModel = {
      userName: this.signForm.get('userName')?.value,
      password: this.signForm.get('password')?.value,
      clientType: 'web',
    };
    this.authService.authenticate(authModel).subscribe({
      next: responseData => {
        this.authGuardService.setAflinxToken(responseData.token);
        localStorage.setItem('userType', responseData.userDto.userType);
        this.userSharedDataService.setUserDetails(responseData.userDto);
        this.permissionService.getUserPermission(responseData.userDto.id).subscribe({
          next: permissionResponseData => {
            this.userSharedDataService.setUserPermission(permissionResponseData);

            this.showLoggedInAlert();
            this.router.navigateByUrl('/dashboard');
          },
          error: error => {},
        });
      },
      error: error => {
        if (error.status == 401) {
          this.toaster.error('Please enter valid credentials', 'Error!');
        } else {
          this.toaster.error('Unable to Login', 'Error!');
        }
      },
    });
  }
  becomePartner() {
    this.router.navigateByUrl('/becomePartner');
  }
  showLoggedInAlert() {
    this.toaster.success('User Logged in Successfully', 'Success!');
  }
  getProfilePhoto(email) {
    this.userService.getProfilePhoto(email).subscribe({
      next: res => {
        localStorage.setItem('profilePath', res.Path);
      },
      error: error => {},
    });
  }
}
