import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '../layout/layout.module';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  declarations: [DashboardComponent, ReportsComponent],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
