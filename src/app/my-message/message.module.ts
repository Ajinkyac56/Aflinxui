import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MessageComponent } from './components/message.component';
import { MessageRoutingModule } from './message-routing.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScheduleSlotDialogComponent } from './components/schedule-slot-dialog/schedule-slot-dialog.component';
import { MessageDialogComponent } from './components/message-dialog/messageview-dialog.component';

@NgModule({
  declarations: [MessageComponent, ScheduleSlotDialogComponent, MessageDialogComponent],
  imports: [CommonModule, MessageRoutingModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, NgxMatSelectSearchModule],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MessageModule {}
