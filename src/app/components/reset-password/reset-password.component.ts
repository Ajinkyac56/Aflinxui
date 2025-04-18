import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  resetPasswordForm: FormGroup;
  query: string;
  showPassword: boolean = false;
  showPasswordNew: boolean = false;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
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
    this.activateRoute.queryParams.subscribe(params => {
      this.query = params['q'];
    });
  }
  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      return;
    }
    var p1 = this.resetPasswordForm.getRawValue().password;
    var p2 = this.resetPasswordForm.getRawValue().confirmPassword;
    this.authService.resetPassword(encodeURIComponent(this.query), p1, p2).subscribe({
      next: responseData => {
        this.toaster.success('Reset password successfully', 'Success!');
        this.router.navigateByUrl('/login');
      },
      error: response => {
        if (response.error.code == 410) {
          this.router.navigateByUrl('/login');
          this.toaster.error(response.error.msg, 'Error!');
        } else if (response.error.code == 400) {
          this.toaster.error(response.error.msg, 'Error!');
        } else {
          this.toaster.error('Unable to reset password', 'Error!');
        }
      },
    });
  }
  login() {
    this.router.navigateByUrl('/login');
  }
  onShowPasswordClick() {
    this.showPassword = !this.showPassword;
  }
  onShowPasswordNewClick() {
    this.showPasswordNew = !this.showPasswordNew;
  }
}
