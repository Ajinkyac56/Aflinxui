import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InteriorPageComponent } from './interior-page/interior-page.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { ResetDataDialogComponent } from './reset-data-dialog/reset-data-dialog.component';
import { CreateDataDialogComponent } from './create-data-dialog/create-data-dialog.component';

@NgModule({
  declarations: [InteriorPageComponent, FooterComponent, ResetDataDialogComponent, CreateDataDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [InteriorPageComponent, FooterComponent],
})
export class CoreModule {}
