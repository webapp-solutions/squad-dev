import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { Customer } from 'src/app/shared/models/Customer';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements AfterViewInit, OnInit {
  /* #region  Global variables */
  aadharcustomers: Customer[];
  passportCustomers: Customer[];
  compactCustomers: Customer[];
  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtElement1: DataTableDirective;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  dtElement2: DataTableDirective;
  dtOptions3: DataTables.Settings = {};
  dtTrigger3: Subject<any> = new Subject<any>();
  dtElement3: DataTableDirective;
  reportType: FormGroup;
  showAadharReport: Boolean = true;
  showPassportReport: Boolean = false;
  showCompactReport: Boolean = false;
  modalTitle: string;
  imageUrls = [];
  /* #endregion */

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Call getCustomer service to fetch all active customers and populate to Table.
    this.getCustomers();
    
    this.reportType = this.formBuilder.group({
      type: [],
    });
  }

  changeReport(e) {
    console.log(e.target.value);
    this.showAadharReport = e.target.value == 'AadharCard' ? true : false
    this.showPassportReport = e.target.value == 'Passport' ? true : false
    this.showCompactReport = e.target.value == 'Compact' ? true : false
  }
  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }

  // Method: Call Customer service to fetch customers through REST API.
  getCustomers(): void {
    console.log('Get Customers called....');
    //Set Datatable options.
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      processing: true,
    };
    //Set Datatable options.
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      processing: true,
    };

    this.dtOptions3 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      processing: true,
    };
    // Use customerService.getCustomer Method to fetch all customers.
    this.customerService.getCustomers().subscribe(
      {
        next: (res) => {
          // On successfull response.
            if (res != null && res.status == 200 && res.customers != null) {
              console.log(
                'Fetched Customers',
                // `${res.status} :${JSON.stringify(res.customers)}`
              );
              // Assign fetched response to customer global variable.
              this.aadharcustomers = res.customers.filter((c)=> {
                return c.aadharCard != null && c.aadharCard != '';
              });
              this.passportCustomers = res.customers.filter((c)=> {
                return c.passport != null && c.passport != '';
              });
              this.compactCustomers = res.customers.map((c) => {
                  if (c.aadharCard == null || c.aadharCard == '' ) {
                    c.aadharCard = {"aadharNumber":""};
                  }
                  if (c.passport == null || c.passport == '') {
                    
                    c.passport = {"passportNumber" : ""}
                  }
                  
                  return c;
              })
              // console.log("aadharcustomers",this.aadharcustomers);
              // console.log("passportCustomer",this.passportCustomers);
              // console.log("compactCustomers",this.compactCustomers);
              
              // Refresh the datatable.
              this.dtTrigger1.next(null);
              this.dtTrigger2.next(null);
              this.dtTrigger3.next(null);
            } else {
              // Toaster Error: Failed to fetch customer.
              this.dtTrigger1.next(null);
              this.dtTrigger2.next(null);
              this.dtTrigger3.next(null);
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
      }
     
    );
  }


  updateCustomer(customerId: string) {
    this.router.navigate(["customer/update", customerId]);
  }
   // Method : Call Consumer Service to delete customer. 
  // Parameter: customerId
  deleteCustomer(customer: Customer) {
    console.log("Consumer ID:", customer._id);
    Swal.fire({
      title: `Delete ${customer.firstName} ${customer.lastName} ?`,
      text: "You will not be able to recover this customer!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "Red",
      cancelButtonText: "No, keep it",
    })
    .then(result => {
      if (result.value) {
        
        this.customerService.deleteCustomer(customer._id).subscribe(
          {
            next: (res) => {
              console.log(" Output : " + JSON.stringify(res));
                if (res.status == 200 && res) {
                   // Remove row from table.
              this.aadharcustomers = this.aadharcustomers.filter(({_id}) => _id !== customer._id);
              this.passportCustomers = this.passportCustomers.filter(({_id}) => _id !== customer._id);
              this.compactCustomers = this.compactCustomers.filter(({_id}) => _id !== customer._id);
              console.log("Removed consumer from table.");
              
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `${customer.firstName} ${customer.lastName} has been deleted.`,
                "success"
              );
                }
                else {
                  // Toaster Erorr message.
                  this.toastr.error(`${res}`, "Error");
                }
            },
            error: (error) => {
              //On Error.
              console.error('Service Failure', error);
              //Toaster Error
              this.toastr.error(error, 'Service Failure');
            }

          }
         
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Customer is not deleted.", "error");
      }
    });
  }

  open(customer) {
    this.imageUrls = [];
    if (this.showAadharReport) {
      this.modalTitle = 'Aadhar Card';
      if (customer.aadharCard.frontImage != "") {
        
        this.imageUrls.push(customer.aadharCard.frontImage)
      }
      if (customer.aadharCard.backImage != "") {
        
        this.imageUrls.push(customer.aadharCard.backImage)
      }
    }
    if (this.showPassportReport) {
      this.modalTitle = 'Passport';
      if (customer.passport.frontImage != "") {
        
        this.imageUrls.push(customer.passport.frontImage)
      }
      if (customer.passport.backImage != "") {
        
        this.imageUrls.push(customer.passport.backImage)
      }
    }
    if (this.showCompactReport) {
      this.modalTitle = 'Compact';
      if (customer.passport.frontImage != "") {
        
        this.imageUrls.push(customer.passport.frontImage)
      }
      if (customer.passport.backImage != "") {
        
        this.imageUrls.push(customer.passport.backImage)
      }
      if (customer.aadharCard.frontImage != "") {
        
        this.imageUrls.push(customer.aadharCard.frontImage)
      }
      if (customer.aadharCard.backImage != "") {
        
        this.imageUrls.push(customer.aadharCard.backImage)
      }
    }

  }
}
