import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login/login.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { commonRoutes, customerRoutes, travelGroupRoutes } from "./shared/appConfig";
import { AuthGuard } from './shared/guard/auth.guard';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { CustomerAddComponent } from './customer/customer-add/customer-add.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerUpdateComponent } from './customer/customer-update/customer-update.component';
import { GroupAddComponent } from './travel-group/group-add/group-add.component';

const routes: Routes = [
  { path: commonRoutes.Login, component: LoginComponent },
  {
    path: "",
    component:DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: "", component: ReportsComponent},
      {path: `${customerRoutes.Base}/${customerRoutes.List}`, component: CustomerListComponent},
      {path: `${customerRoutes.Base}/${customerRoutes.Add}`, component: CustomerAddComponent},
      {path: `${customerRoutes.Base}/${customerRoutes.Update}/:customerId`, component: CustomerUpdateComponent},
      {path: `${travelGroupRoutes.Base}/${travelGroupRoutes.Add}`, component: GroupAddComponent},
    ]
  },
  { path: "**", redirectTo: commonRoutes.Login, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
