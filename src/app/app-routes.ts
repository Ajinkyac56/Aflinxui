import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { AuthGuard } from './security/auth.guard';
import { InteriorPageComponent } from './core-component/interior-page/interior-page.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  { path: 'forgot-password', component: ForgetPasswordComponent }, // added route
  {
    path: '',
    component: InteriorPageComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];
