import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    if (environment.key_disable) {
      event.preventDefault();
    }
  }
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toaster: ToastrService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: [],
    });
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

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      const userName = this.forgotPasswordForm.value.userName;
      this.authService.sendForgetPassword(email).subscribe(
        data => {
          this.toaster.success('Password reset link sent successfully');
          this.router.navigateByUrl('/login'); // added login navigation
          this.isSubmitting = true;
        },
        error => {
          this.toaster.error('Please enter a Valid User', 'Error!');
          this.router.navigateByUrl('/login');
          this.isSubmitting = false;
        }
      );
    }
  }
  cancel() {
    this.router.navigateByUrl('/dashboard');
  }
}
