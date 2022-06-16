import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { commonRoutes } from '../shared/appConfig';

const routes: Routes = [
//   {
//     path: commonRoutes.Home,
//     component: DashboardComponent,
//     children: [
//       {
//         path: 'consumer',
//         // component: DashboardComponent,
//         loadChildren: "./consumer/consumer.module#ConsumerModule"
//       },
  
//     ]
// },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
