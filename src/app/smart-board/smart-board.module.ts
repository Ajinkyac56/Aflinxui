import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartBoardRoutingModule } from './smart-board-routing.module';
import { SmartBoardComponent } from './smart-board/smart-board.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SchedulingRoutingModule } from '../scheduling/scheduling-routing.module';

@NgModule({
  declarations: [SmartBoardComponent],
  imports: [
    CommonModule,
    SmartBoardRoutingModule,
    SchedulingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    FontAwesomeModule,
    NgxMatSelectSearchModule,
  ],
})
export class SmartBoardModule {}
