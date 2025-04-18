import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartBoardComponent } from './smart-board/smart-board.component';

const routes: Routes = [
  {
    path: '',
    component: SmartBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartBoardRoutingModule {}
