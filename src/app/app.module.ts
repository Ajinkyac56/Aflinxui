import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppointmentSlotDialogComponent } from './scheduling/components/appointment-slot-dialog/appointment-slot-dialog.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routes';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { CoreModule } from './core-component/core.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EllipsisPipe } from './ellipsis.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoaderInterceptor } from './shared/loader/loader.interceptor';
import { SharedModule } from './shared/loader/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AppComponent, ResetPasswordComponent, EllipsisPipe, ConfirmDialogComponent, ForgetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      closeButton: true,
    }),
    CoreModule,
    SharedModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    AuthService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
