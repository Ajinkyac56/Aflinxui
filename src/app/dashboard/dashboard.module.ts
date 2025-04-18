import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from '../core-component/footer/footer.component';
import { CoreModule } from '../core-component/core.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/loader/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, DashboardRoutingModule, CoreModule, AngularMaterialModule, SharedModule],
})
export class DashboardModule {}
