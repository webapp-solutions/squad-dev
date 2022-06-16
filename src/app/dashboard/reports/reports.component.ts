import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { CustomerService } from 'src/app/shared/services/customer.service';
import { TravelGroupService } from 'src/app/shared/services/travelgroup.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  aadharcustomers: any;
  passportCustomers: any;
  compactCustomers: any;
  totalCustomers = 0;
  totalGroups = 0;
  totalPassports = 0;
  totalAadharCards = 0;
  birthdays = [];
  anniversaries = [];

  constructor(
    private customerService: CustomerService,
    private travelGroupService: TravelGroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getCustomers();
    this.getTravelGroups();
  }

  // Method: Call Customer service to fetch customers through REST API.
  getCustomers(): void {
    console.log('Get Customers called....');

    // Use customerService.getCustomer Method to fetch all customers.
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        // On successfull response.
        if (res != null && res.status == 200 && res.customers != null) {
          console.log(
            'Fetched Customers'
            // `${res.status} :${JSON.stringify(res.customers)}`
          );
          this.totalCustomers = res.customers.length;
          // Assign fetched response to customer global variable.
          this.aadharcustomers = res.customers.filter((c) => {
            return c.aadharCard != null && c.aadharCard != '';
          });
          this.passportCustomers = res.customers.filter((c) => {
            return c.passport != null && c.passport != '';
          });
          this.compactCustomers = res.customers.map((c) => {
            if (c.aadharCard == null || c.aadharCard == '') {
              c.aadharCard = { aadharNumber: '' };
            }
            if (c.passport == null || c.passport == '') {
              c.passport = { passportNumber: '' };
            }

            return c;
          });

          this.totalPassports = this.passportCustomers.length;
          this.totalAadharCards = this.aadharcustomers.length;
          this.getEvents();
        } else {
          // Toaster Error: Failed to fetch customer.

          if (res != null) {
            this.toastr.error(res.message, 'Error');
            console.log('Error : \n', `${res.status} : ${res.message}`);
          } else {
            this.toastr.error('Failed to Fetch Customers.', 'Error');
          }
        }
      },
      error: (error) => {
        //On Error.
        console.error('Service Failure', error);
        //Toaster Error
        this.toastr.error(error, 'Service Failure');
      },
    });
  }

  getTravelGroups() {
    this.travelGroupService.getCounterValue().subscribe({
      next: (out) => {
        console.log('Service Response for TG', out);
        if (out.status == 200 && out.counter != undefined) {
          this.totalGroups = out.counter - 1;
        }
      },
      error: (error) => {
        //On Error.
        console.error('Service Failure', error);
        //Toaster Error
        this.toastr.error(error, 'Service Failure');
      },
    });
  }

  getEvents() {
    //T0 Get the Current Year, Month And Day
    var dateYear = new Date().getFullYear();
    var dateMonth = new Date().getMonth() + 1; // start counting from 0
    var dateDay = new Date().getDate(); // start counting from 1
    
    
    this.compactCustomers.forEach((c) => {
      console.log("Inside getEvents", c);
      if (c.dateOfBirth != null) {
        console.log("Inside if",c.dateOfBirth);
        var cusbdate = new Date(c.dateOfBirth);
        var birthDate = cusbdate.getDate();
        var birthMonth = cusbdate.getMonth() + 1;
        if (birthDate == dateDay && birthMonth == dateMonth) {
          console.log('Happy Birthday ', c.firstName);
          this.birthdays.push(c);
        }
      }
      if (c.dateOfAnniversary != null) {
        var cusadate = new Date(c.dateOfAnniversary);
        var anniversaryDate = cusadate.getDate();
        var anniversaryMonth = cusadate.getMonth() + 1;
        var anniversaryYear = cusadate.getFullYear();
        if (anniversaryDate == dateDay && anniversaryMonth == dateMonth) {
          console.log('Happy Anniversary ', c.firstName);
          this.anniversaries.push(c);
        }
      }

    });
  }
}
