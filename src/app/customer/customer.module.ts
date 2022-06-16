import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DatePipe} from '@angular/common';
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



import { CustomerAddComponent } from './customer-add/customer-add.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';



@NgModule({
  declarations: [
    CustomerAddComponent,
    CustomerListComponent,
    CustomerUpdateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule,
    NgSelectModule,
    DataTablesModule,
    SweetAlert2Module,
  ],
  providers: [
    DatePipe
  ],
  exports: [
    CustomerListComponent,
    CustomerAddComponent,
    CustomerUpdateComponent
  ]
})
export class CustomerModule { }
