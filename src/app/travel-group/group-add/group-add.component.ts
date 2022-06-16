import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { TravelGroupService } from 'src/app/shared/services/travelgroup.service';
import { Customer } from 'src/app/shared/models/Customer';
import { TravelGroup } from 'src/app/shared/models/TravelGroup';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css'],
})
export class GroupAddComponent implements OnInit,AfterViewInit, OnDestroy {
  groupForm: FormGroup;
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  nextGroupCode: string = 'ST';
  initialValues;
  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective)dtElement1: DataTableDirective;
  compactCustomers: Customer[];
  groupMembers=[];


  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private travelGroupService: TravelGroupService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      groupCode: [''],
      groupMembers: [],
    });

    this.getCounter();
    this.getCustomers();
    this.initialValues = this.groupForm.getRawValue();
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.groupForm.controls;
  }

  getCounter() {
    this.travelGroupService.getCounterValue().subscribe({
      next: (out) => {
        console.log('Service Response for TG', out);
        if (out.status == 200 && out.counter != undefined) {
          var seq = `${out.counter}`;

          this.nextGroupCode = this.nextGroupCode + seq.padStart(3, '0');
          console.log("nex groupCode", this.nextGroupCode);
          
          this.groupForm.controls['groupCode'].setValue(this.nextGroupCode);
          this.groupForm.controls['groupCode'].disable();
        }
      },
      error: (err) => {},
    });
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
            
            this.compactCustomers = res.customers.map((c) => {
                if (c.aadharCard == null || c.aadharCard == '' ) {
                  c.aadharCard = {"aadharNumber":""};
                }
                if (c.passport == null || c.passport == '') {
                  
                  c.passport = {"passportNumber" : ""}
                }
                
                return c;
            })
            
            // Refresh the datatable.
            // this.dtTrigger1.next(null);
            this.rerender();
          } else {
            // Toaster Error: Failed to fetch customer.
            this.rerender();
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

addMember(customer) {
  this.groupMembers.push(customer);
}

removeMember(customer) {
  var index = this.groupMembers.indexOf(customer);
  this.groupMembers.splice(index,1);
}

  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.groupForm.getRawValue();
    // Check if form values are valid.
    if (this.groupForm.invalid) {
      console.log('Failed' + JSON.stringify(formValues));
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    console.log('Formvalues',formValues);

    var memberIds = this.groupMembers.map((g) => {
      return  g._id;
    });
    console.log(memberIds);
    
    var group  = {
      groupCode : formValues.groupCode,
      groupMembers : this.groupMembers.map((g) => {
        return  g._id;
      })
    }

    this.travelGroupService.addTravelGroup(group).subscribe({
      next: (out) => {
        // console.log("Success" + JSON.stringify(this.newCustomer));
        console.log('output' + JSON.stringify(out));
        if (out.status == 200 ) {
          this.toastr.success(out.message, "Success");
          this.onReset();
        } else {
          //Toaster Error message.
          this.isSubmitted = false;
          this.disableSubmit = false;
          this.toastr.error(out, "Failure");
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

  onReset() {
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.groupForm.reset(this.initialValues);
    this.groupMembers = [];
    this.nextGroupCode = "ST";
    this.getCounter();
    this.getCustomers();

  }

   // Method: Refreshes the datatable.
   rerender() {
    this.dtElement1.dtInstance.then((dtInstance : DataTables.Api) => 
    {
        // Destroy the table first in the current context
        dtInstance.destroy();

        // Call the dtTrigger to rerender again
       this.dtTrigger1.next(null);

    });
}

ngOnDestroy(): void {    
  this.dtTrigger1.unsubscribe();    
} 

ngAfterViewInit(): void {
  this.dtTrigger1.next(null);
}
}
