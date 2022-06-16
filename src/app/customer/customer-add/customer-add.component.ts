import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { Customer } from 'src/app/shared/models/Customer';
import { DatePipe, formatDate } from '@angular/common';
import { AadharCard } from 'src/app/shared/models/AadharCard';
import { Passport } from 'src/app/shared/models/Passport';
import { GST } from 'src/app/shared/models/GST';
import { TravelGroupService } from 'src/app/shared/services/travelgroup.service';
import { FileService } from 'src/app/shared/services/file.service';
import { apiBaseUrl } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css'],
})
export class CustomerAddComponent implements OnInit {

  /* #region  Global variables */
  customerForm: FormGroup;
  isSubmitted: boolean = false;
  isProfileImageUploaded: boolean = false;
  isAadharFrontImageUploaded: boolean = false;
  isAadharBackImageUploaded: boolean = false;
  isPassportFrontImageUploaded: boolean = false;
  isPassportBackImageUploaded: boolean = false;
  disableSubmit: boolean = false;
  newCustomer: Customer;
  newAadharCard: AadharCard;
  newPassport: Passport;
  newGST: GST;
  groupList = [];
  genders = [];
  profileImageUrl?:string = '';
  passportFrontImageUrl?:string = '';
  passportBackImageUrl?:string = '';
  aadharFrontImageUrl?:string = '';
  aadharBackImageUrl?:string = '';
  selectedProfileImage?: FileList;
  selectedPassportFront?: FileList;
  selectedPassportBack?: FileList;
  selectedAadharFront?: FileList;
  selectedAadharBack?: FileList;
  initialValues?

  /* #endregion */
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private travelGroupService: TravelGroupService,
    private fileService: FileService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      // ************ Basic Details ******************
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: [''],
      mobileNumber: ['', [Validators.pattern('^[0-9]{10,10}$')]],
      gender: [],
      groupCode: [],
      profileImage: [''],
      dateOfBirth: [''],
      dateOfAnniversary: [''],
      copyToAadhar:[false],
      //   // ************ Aadhar Card Details ******************
      aadharNumber: [''],
      aadharName: [''],
      // adhardateOfBirth:  [formatDate(new Date(Date.now()), 'dd-MM-yyyy', 'en')],
      address: [''],
      aadharFrontImage: [''],
      aadharBackImage: [''],
      // ************ Passport Details ******************
      passportNumber: [''],
      givenName: [''],
      surname: [''],
      dateOfIssue: [''],
      dateOfExpiry: [''],
      passportFrontImage: [''],
      passportBackImage: [''],
      // ************ GST Details ******************
      registrationNumber: [''],
      companyName: [''],
      companyAddress: [''],
      gstEmailId: [''],
      phoneNumber: ['', [Validators.pattern('^[0-9]$')]],
    });
    this.initialValues = this.customerForm.getRawValue();
    this.getGroupCodes();
    this.genders = [
      { id: 'Male', text: 'Male' },
      { id: 'Female', text: 'Female' },
    ];
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.customerForm.controls;
  }
  // Copy Name from Basic details to aadhar name.
  copyDetails(event) {
    if (event.target.checked) {
      var name =
        this.customerForm.value.firstName +
        ' ' +
        this.customerForm.value.lastName;
      console.log(name);
      this.customerForm.controls['aadharName'].setValue(name);
      this.customerForm.controls['aadharName'].disable();
      this.customerForm.controls['aadharNumber'].setValidators(Validators.required);
      // this.customerForm.controls['aadharName'];
    } else {
      this.customerForm.controls['aadharName'].enable();
      this.customerForm.controls['aadharNumber'].removeValidators(Validators.required);
    }
  }

  // Upload Files 
   uploadImages(fileDetails):Promise<any>{

    if(fileDetails){
      return new Promise( (resolve,reject) => {
        this.fileService.uploadFile(fileDetails).subscribe({
          next: (out: any) => {
            console.log("Upload Images response",out);
            console.log(out.status);
            
              if (out.status == 200) {
                console.log("Inside If");
                
                resolve (out);
              }
              else{
                reject;
              }
              
          },
          error: (err: any) => {
            console.log(err);
            this.toastr.error("Error while uploading Image", "Failure");
            reject(err)
          },
        });
      }
        
        
      )   
      // return res;
    
    }
    else{
      return new Promise((resolve,reject) => {
        reject();
      })
    }
    
  }

   uploadProfileImage() {
     var folderName = "profileImage"
    if (this.selectedProfileImage) {
      const file: File | null = this.selectedProfileImage.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.customerForm.value;
        var dt = this.datePipe.transform(new Date(),"ddMMyyyyhhmmss");
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-${dt}`,
          path: folderName,
          file: file,
        };
        
       this.uploadImages(imageDetails).then((res:any) => {
          console.log("Inside Then", res);
          if (res.status == 200) {
                this.selectedProfileImage = undefined;
                this.isProfileImageUploaded = true;
                this.profileImageUrl = `${apiBaseUrl}/${folderName}/${res.file.filename}`
              }
        });
        
        
      }
    }
  }

  uploadAadharFrontImage() {
    var folderName = "AadharCard"
    if (this.selectedAadharFront) {
      const file: File | null = this.selectedAadharFront.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.customerForm.value;
        var dt = this.datePipe.transform(new Date(),"ddMMyyyyhhmmss");
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-front-${dt}`,
          path: folderName,
          file: file,
        };
        
       this.uploadImages(imageDetails).then((res:any) => {
          console.log("Inside Then", res);
          if (res.status == 200) {
                this.selectedAadharFront = undefined;
                this.isAadharFrontImageUploaded = true;
                this.aadharFrontImageUrl = `${apiBaseUrl}/${folderName}/${res.file.filename}`
              }
        });
        
        
      }
    }
  }

  uploadPassportFrontImage() {
    var folderName = "Passport"
    if (this.selectedPassportFront) {
      const file: File | null = this.selectedPassportFront.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.customerForm.value;
        var dt = this.datePipe.transform(new Date(),"ddMMyyyyhhmmss");
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-front-${dt}`,
          path: folderName,
          file: file,
        };
        
       this.uploadImages(imageDetails).then((res:any) => {
          console.log("Inside Then", res);
          if (res.status == 200) {
                this.selectedPassportFront = undefined;
                this.isPassportFrontImageUploaded = true;
                this.passportFrontImageUrl = `${apiBaseUrl}/${folderName}/${res.file.filename}`
              }
        });
        
        
      }
    }
  }

  uploadAadharBackImage() {
    var folderName = "AadharCard"
    if (this.selectedAadharBack) {
      const file: File | null = this.selectedAadharBack.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.customerForm.value;
        var dt = this.datePipe.transform(new Date(),"ddMMyyyyhhmmss");
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-back-${dt}`,
          path: folderName,
          file: file,
        };
        
       this.uploadImages(imageDetails).then((res:any) => {
          console.log("Inside Then", res);
          if (res.status == 200) {
                this.selectedAadharBack = undefined;
                this.isAadharBackImageUploaded = true;
                this.aadharBackImageUrl = `${apiBaseUrl}/${folderName}/${res.file.filename}`
              }
        });
        
        
      }
    }
  }

  uploadPassportBackImage() {
    var folderName = "Passport"
    if (this.selectedPassportBack) {
      const file: File | null = this.selectedPassportBack.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.customerForm.value;
        var dt = this.datePipe.transform(new Date(),"ddMMyyyyhhmmss");
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-back-${dt}`,
          path: folderName,
          file: file,
        };
        
       this.uploadImages(imageDetails).then((res:any) => {
          console.log("Inside Then", res);
          if (res.status == 200) {
                this.selectedPassportBack = undefined;
                this.isPassportBackImageUploaded = true;
                this.passportBackImageUrl = `${apiBaseUrl}/${folderName}/${res.file.filename}`
              }
        });
        
        
      }
    }
  }

  selectImage(event: any): void {
    console.log('Inside Select File', event.target.id);
    if (event.target.id == "profileImage") {
      this.selectedProfileImage = event.target.files.length > 0 ?  event.target.files : null;
    }
    else if (event.target.id == "aadharFrontImage") {
      this.selectedAadharFront = event.target.files.length > 0 ?  event.target.files : null;
    }
    else if (event.target.id == "aadharBackImage") {
      this.selectedAadharBack = event.target.files.length > 0 ?  event.target.files : null;
    }
    else if (event.target.id == "passportFrontImage") {
      this.selectedPassportFront = event.target.files.length > 0 ?  event.target.files : null;
    }
    else if (event.target.id == "passportBackImage") {
      this.selectedPassportBack = event.target.files.length > 0 ?  event.target.files : null;
    }
    
  }

  getGroupCodes() {
    this.travelGroupService.getTravelGroups().subscribe({
      next: (out) => {
        console.log('Service Response for TG', out);

        this.groupList = out.map((g) => ({
          id: g._id,
          text: g.groupCode,
        }));
      },
      error: (err) => {},
    });
  }

  // Method: Save a new customer by calling create customer service.
  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.customerForm.getRawValue();
    // Check if form values are valid.
    if (this.customerForm.invalid) {
      console.log('Failed' + JSON.stringify(formValues));
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    console.log('Formvalues',formValues);

    if (!this.isProfileImageUploaded && formValues.profileImage != '') {
      console.log("!isProfileImageUploaded",!this.isProfileImageUploaded);
      console.log("formValues.profileImage",formValues.profileImage);
      
      this.toastr.error("Upload Profile Image !!!", "Alert");
      this.isSubmitted = false;
      this.disableSubmit = false;
      return
    }
    if (!this.isAadharFrontImageUploaded && formValues.aadharFrontImage != '') {
      this.toastr.error("Upload Aadhar Front Image !!!", "Alert");
      this.isSubmitted = false;
      this.disableSubmit = false;
      return
    }
    if (!this.isAadharBackImageUploaded && formValues.aadharBackImage != '') {
      this.toastr.error("Upload Aadhar Back Image !!!", "Alert");
      this.isSubmitted = false;
      this.disableSubmit = false;
      return
    }
    if (!this.isPassportFrontImageUploaded && formValues.passportFrontImage != '') {
      this.toastr.error("Upload Passport Front Image !!!", "Alert");
      this.isSubmitted = false;
      this.disableSubmit = false;
      return
    }
    if (!this.isPassportBackImageUploaded && formValues.passportBackImage != '') {
      this.toastr.error("Upload Passport Back Image !!!", "Alert");
      this.isSubmitted = false;
      this.disableSubmit = false;
      return
    }
    this.newCustomer = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      emailId: formValues.emailId,
      gender: formValues.gender,
      groupCode: formValues.groupCode == null ? [] : formValues.groupCode,
      mobileNumber: formValues.mobileNumber,
      dateOfBirth: formValues.dateOfBirth,
      dateOfAnniversary: formValues.dateOfAnniversary,
      profileImage: this.profileImageUrl,
      aadharCard: formValues.aadharNumber,
      passport: formValues.passportNumber,
      gstId: formValues.registrationNumber,
    };
    this.newAadharCard = {
      _id: formValues.aadharNumber,
      aadharNumber: formValues.aadharNumber,
      name: formValues.aadharName,
      address: formValues.address,
      frontImage: this.aadharFrontImageUrl,
      backImage: this.aadharBackImageUrl,
      dateOfBirth: formValues.dateOfBirth,
    };
    this.newPassport = {
      _id: formValues.passportNumber,
      passportNumber: formValues.passportNumber,
      givenName: formValues.givenName,
      surname: formValues.surname,
      dateOfIssue: formValues.dateOfIssue,
      dateOfExpiry: formValues.dateOfExpiry,
      frontImage: this.passportFrontImageUrl,
      backImage: this.passportBackImageUrl,
    };
    this.newGST = {
      _id: formValues.registrationNumber,
      registrationNumber: formValues.registrationNumber,
      companyName: formValues.companyName,
      companyAddress: formValues.companyAddress,
      emailId: formValues.gstEmailId,
      phoneNumber: formValues.phoneNumber,
    };
    
    console.log('Customer', this.newCustomer);
    console.log('AadharCard', this.newAadharCard);
    console.log('Passport', this.newPassport);
    console.log('GST', this.newGST);
    var requestBody = {
      customer: this.newCustomer,
      aadharCard: this.newAadharCard,
      passport: this.newPassport,
      gst: this.newGST,
    };

    this.customerService.addCustomer(requestBody).subscribe({
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

  // Method : Reset Form.
  onReset() {
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.isProfileImageUploaded = false;
    this.isAadharFrontImageUploaded = false;
    this.isAadharBackImageUploaded = false;
    this.isPassportFrontImageUploaded = false;
    this.isPassportBackImageUploaded = false;
    this.customerForm.controls['aadharName'].enable();
    this.customerForm.controls['aadharNumber'].removeValidators(Validators.required);
    this.customerForm.reset(this.initialValues);
  }
}
