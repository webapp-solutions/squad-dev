import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


//Interceptors 
import { ErrorInterceptor } from './shared/helpers/error.interceptor';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';

// Modules
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomerModule } from "./customer/customer.module";
import { TravelGroupModule } from "./travel-group/travel-group.module";
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';

// Services
import { AppConfigService } from './shared/services/app-config.service';
import { UserService } from './shared/services/user.service';
import { CustomerService } from './shared/services/customer.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({autoDismiss:true,closeButton:true,newestOnTop:true}),
    NgSelectModule,
    LoginModule,
    DataTablesModule,
    DashboardModule,
    CustomerModule,
    TravelGroupModule,
    AppRoutingModule,
    // Chart,
    
  ],
  providers: [
    UserService,
    CustomerService,
    AppConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
