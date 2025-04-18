import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '../security/auth.guard';

const dashboardRoutes: Routes = [
  {
    path: 'permission',
    loadChildren: () => import('../manage-permission/manage-permission.module').then(m => m.ManagePermissionModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'userAndgroup',
    loadChildren: () => import('../user-and-group/user-and-group.module').then(m => m.UserAndGroupModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('../setting/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'requirement',
    loadChildren: () => import('../requirements/requirements.module').then(m => m.RequirementsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'communication',
    loadChildren: () => import('../communication/communication.module').then(m => m.CommunicationModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'data-loader',
    loadChildren: () => import('../data-loader/data-loader.module').then(m => m.DataLoaderModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'scheduling',
    loadChildren: () => import('../scheduling/scheduling.module').then(m => m.SchedulingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'chats',
    loadChildren: () => import('../chats/chats.module').then(m => m.ChatsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-profile',
    loadChildren: () => import('../my-profile/my-profile.module').then(m => m.MyProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-message',
    loadChildren: () => import('../my-message/message.module').then(m => m.MessageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'smart-board',
    loadChildren: () => import('../smart-board/smart-board.module').then(m => m.SmartBoardModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
