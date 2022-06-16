import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from "angular-datatables";
import {DatePipe} from '@angular/common';



import { GroupAddComponent } from './group-add/group-add.component';



@NgModule({
  declarations: [
    GroupAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule,
    DataTablesModule,
    
  ],
  providers: [
    DatePipe
  ],
})
export class TravelGroupModule { }
