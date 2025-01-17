import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestPriceComponent } from './request-price.component';
import { LayoutComponent } from '@app/request-price/layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: RequestPriceComponent },
/*
      { path: 'project/detail/:id', component: DetailComponent},
*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestPriceRoutingModule { }
