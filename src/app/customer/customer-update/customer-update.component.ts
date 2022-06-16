import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { Customer } from 'src/app/shared/models/Customer';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { TravelGroupService } from 'src/app/shared/services/travelgroup.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileService } from 'src/app/shared/services/file.service';
import { imageBaseUrl } from 'src/app/shared/appConfig';
import { TravelGroup } from 'src/app/shared/models/TravelGroup';
import { Passport } from 'src/app/shared/models/Passport';
import { AadharCard } from 'src/app/shared/models/AadharCard';
import { GST } from 'src/app/shared/models/GST';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.css'],
})
export class CustomerUpdateComponent implements OnInit {
  /* #region  Global Variabes */
  updateForm: FormGroup;
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  storedCustomer: Customer;
  storedPassport: Passport = new Passport();
  storedAadhar: AadharCard = new AadharCard();
  storedGST: GST = new GST();
  selectedGender: String;
  selectedGroupCode = [];
  updatedCustomer: Customer;
  genders = [];
  groupList = [];
  profileImageUrl?: string = '';
  passportFrontImageUrl?: string = '';
  passportBackImageUrl?: string = '';
  aadharFrontImageUrl?: string = '';
  aadharBackImageUrl?: string = '';
  selectedProfileImage?: FileList;
  selectedPassportFront?: FileList;
  selectedPassportBack?: FileList;
  selectedAadharFront?: FileList;
  selectedAadharBack?: FileList;
  isProfileImageUploaded: boolean = false;
  isAadharFrontImageUploaded: boolean = false;
  isAadharBackImageUploaded: boolean = false;
  isPassportFrontImageUploaded: boolean = false;
  isPassportBackImageUploaded: boolean = false;
  modalTitle: string;
  imageUrl: string;
  /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private travelGroupService: TravelGroupService,
    private fileService: FileService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
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
      copyToAadhar: [false],
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

    this.getGroupCodes();
    this.genders = [
      { id: 'Male', text: 'Male' },
      { id: 'Female', text: 'Female' },
    ];

    //Fetch Customer using customerID provided in route parameter.
    this.route.paramMap.subscribe((params) => {
      const customerId = params.get('customerId');
      if (customerId && customerId != null) {
        this.getCustomerById(customerId);
      }
    });
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

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.updateForm.controls;
  }

  getCustomerById(customerId: string) {
    this.customerService.getCustomer(customerId).subscribe({
      next: (out) => {
        console.log('Output', out);
        if (out && out.status == 200 && out.customer != null) {
          console.log('Fetched Customer : ', JSON.stringify(out.customer));
          this.storedCustomer = out.customer;
          if (
            this.storedCustomer.gender != null &&
            this.storedCustomer.gender != ''
          ) {
            this.selectedGender = this.storedCustomer.gender;
          }
          if (
            this.storedCustomer.groupCode != null &&
            this.storedCustomer.groupCode.length > 0
          ) {
            this.storedCustomer.groupCode.forEach((g) => {
              this.selectedGroupCode.push(g['_id']);
            });
          }
          if (
            this.storedCustomer.passport != null &&
            this.storedCustomer.passport != ''
          ) {
            this.storedPassport = this.storedCustomer.passport;
          }
          if (
            this.storedCustomer.aadharCard != null &&
            this.storedCustomer.aadharCard != ''
          ) {
            this.storedAadhar = this.storedCustomer.aadharCard;
          }
          if (
            this.storedCustomer.gstId != null &&
            this.storedCustomer.gstId != ''
          ) {
            this.storedGST = this.storedCustomer.gstId;
          }
          this.patchValues();
        } else {
          // Toaster Error: Failed to fetch Consumer.
          this.toastr.error(out, 'Error');
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

  // Patch fetched values to the form.
  patchValues() {
    this.updateForm.patchValue({
      // Basic Values
      firstName: this.storedCustomer.firstName,
      lastName: this.storedCustomer.lastName,
      emailId: this.storedCustomer.emailId,
      mobileNumber: this.storedCustomer.mobileNumber,
      gender: this.selectedGender,
      groupCode: this.selectedGroupCode,
      // profileImage: this.storedCustomer.profileImage,
      dateOfBirth: formatDate(
        this.storedCustomer.dateOfBirth,
        'yyyy-MM-dd',
        'en'
      ),
      dateOfAnniversary:
        this.storedCustomer.dateOfAnniversary != null
          ? formatDate(
              this.storedCustomer.dateOfAnniversary,
              'yyyy-MM-dd',
              'en'
            )
          : '',
      // Aadhar Card
      aadharNumber: this.storedCustomer.aadharCard
        ? this.storedCustomer.aadharCard['aadharNumber']
        : '',
      aadharName: this.storedCustomer.aadharCard
        ? this.storedCustomer.aadharCard['name']
        : '',
      address: this.storedCustomer.aadharCard
        ? this.storedCustomer.aadharCard['address']
        : '',
      // aadharFrontImage: this.storedCustomer.aadharCard
      //   ? this.storedCustomer.aadharCard['frontImage']
      //   : false,
      // aadhaBackImage: this.storedCustomer.aadharCard
      //   ? this.storedCustomer.aadharCard['backImage']
      //   : false,
      // dateOfBirth: this.storedCustomer.aadharCard ? this.storedCustomer.aadharCard['dateOfBirth']  : false,

      //Passport
      passportNumber: this.storedCustomer.passport
        ? this.storedCustomer.passport['passportNumber']
        : '',
      givenName: this.storedCustomer.passport
        ? this.storedCustomer.passport['givenName']
        : '',
      surname: this.storedCustomer.passport
        ? this.storedCustomer.passport['surname']
        : '',
      dateOfIssue: this.storedPassport?.dateOfIssue
        ? formatDate(this.storedPassport.dateOfIssue, 'yyyy-MM-dd', 'en')
        : '',
      dateOfExpiry: this.storedPassport?.dateOfExpiry
        ? formatDate(this.storedPassport.dateOfExpiry, 'yyyy-MM-dd', 'en')
        : '',
      // passportFrontImage: this.storedCustomer.passport
      //   ? this.storedCustomer.passport['frontImage']
      //   : false,
      // passportBackImage: this.storedCustomer.passport
      //   ? this.storedCustomer.passport['backImage']
      //   : false,

      // GST
      registrationNumber: this.storedCustomer.gstId
        ? this.storedCustomer.gstId['registrationNumber']
        : '',
      companyName: this.storedCustomer.gstId
        ? this.storedCustomer.gstId['companyName']
        : '',
      companyAddress: this.storedCustomer.gstId
        ? this.storedCustomer.gstId['companyAddress']
        : '',
      gstEmailId: this.storedCustomer.gstId
        ? this.storedCustomer.gstId['emailId']
        : '',
      phoneNumber: this.storedCustomer.gstId
        ? this.storedCustomer.gstId['phoneNumber']
        : '',
    });

    console.log('Patch Values passport', this.storedPassport);
    console.log('Patch Values passport', this.storedPassport?.frontImage);

    this.isProfileImageUploaded =
      this.storedCustomer.profileImage != '' ? true : false;
    this.isPassportFrontImageUploaded =
      this.storedPassport?.frontImage != '' ? true : false;
    this.isPassportBackImageUploaded =
      this.storedPassport?.backImage != '' ? true : false;
    this.isAadharFrontImageUploaded =
      this.storedAadhar?.frontImage != '' ? true : false;
    this.isAadharBackImageUploaded =
      this.storedAadhar?.backImage != '' ? true : false;
  }

  onSave() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.updateForm.getRawValue();
    // Check if form values are valid.
    if (this.updateForm.invalid) {
      console.log('Failed' + JSON.stringify(formValues));
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    console.log('Formvalues', formValues);
    if (!this.isProfileImageUploaded && formValues.profileImage != '') {
      console.log('!isProfileImageUploaded', !this.isProfileImageUploaded);
      console.log('formValues.profileImage', formValues.profileImage);

      this.toastr.error('Upload Profile Image !!!', 'Alert');
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    if (!this.isAadharFrontImageUploaded && formValues.aadharFrontImage != '') {
      this.toastr.error('Upload Aadhar Front Image !!!', 'Alert');
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    if (!this.isAadharBackImageUploaded && formValues.aadharBackImage != '') {
      this.toastr.error('Upload Aadhar Back Image !!!', 'Alert');
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    if (
      !this.isPassportFrontImageUploaded &&
      formValues.passportFrontImage != ''
    ) {
      this.toastr.error('Upload Passport Front Image !!!', 'Alert');
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }
    if (
      !this.isPassportBackImageUploaded &&
      formValues.passportBackImage != ''
    ) {
      this.toastr.error('Upload Passport Back Image !!!', 'Alert');
      this.isSubmitted = false;
      this.disableSubmit = false;
      return;
    }

    // basic Customer Details
    this.storedCustomer.firstName = formValues.firstName;
    this.storedCustomer.lastName = formValues.lastName;
    this.storedCustomer.emailId = formValues.emailId;
    this.storedCustomer.gender = formValues.gender;
    this.storedCustomer.groupCode =
      formValues.groupCode == null ? [] : formValues.groupCode;
    this.storedCustomer.mobileNumber = formValues.mobileNumber;
    this.storedCustomer.dateOfBirth = formValues.dateOfBirth;
    this.storedCustomer.dateOfAnniversary = formValues.dateOfAnniversary;
    this.storedCustomer.profileImage =
      this.storedCustomer.profileImage != ''
        ? this.storedCustomer.profileImage
        : this.profileImageUrl;
    this.storedCustomer.aadharCard = formValues.aadharNumber;
    this.storedCustomer.passport = formValues.passportNumber;
    this.storedCustomer.gstId = formValues.registrationNumber;
    // Aadhar Card
    this.storedAadhar._id = formValues.aadharNumber;
    this.storedAadhar.aadharNumber = formValues.aadharNumber;
    this.storedAadhar.name = formValues.aadharName;
    this.storedAadhar.address = formValues.address;
    this.storedAadhar.frontImage =
      this.storedAadhar.frontImage != ''
        ? this.storedAadhar.frontImage
        : this.aadharFrontImageUrl;
    this.storedAadhar.backImage =
      this.storedAadhar.backImage != ''
        ? this.storedAadhar.backImage
        : this.aadharBackImageUrl
    this.storedAadhar.dateOfBirth = formValues.dateOfBirth
    // Passport
    this.storedPassport._id = formValues.passportNumber;
    this.storedPassport.passportNumber = formValues.passportNumber;
    this.storedPassport.givenName = formValues.givenName;
    this.storedPassport.surname = formValues.surname;
    this.storedPassport.dateOfIssue = formValues.dateOfIssue;
    this.storedPassport.dateOfExpiry = formValues.dateOfExpiry;
    this.storedPassport.frontImage =
      this.storedPassport.frontImage != ''
        ? this.storedPassport.frontImage
        : this.passportFrontImageUrl;
    this.storedPassport.backImage =
    this.storedPassport.backImage != ''
      ? this.storedPassport.backImage
      : this.passportBackImageUrl

    // GST
    this.storedGST._id = formValues.registrationNumber;
    this.storedGST.registrationNumber = formValues.registrationNumber;
    this.storedGST.companyName = formValues.companyName;
    this.storedGST.companyAddress = formValues.companyAddress;
    this.storedGST.emailId = formValues.gstEmailId;
    this.storedGST.phoneNumber = formValues.phoneNumber;

    console.log('Customer', this.storedCustomer);
    console.log('AadharCard', this.storedAadhar);
    console.log('Passport', this.storedPassport);
    console.log('GST', this.storedGST);
    var requestBody = {
      customer: this.storedCustomer,
      aadharCard: this.storedAadhar,
      passport: this.storedPassport,
      gst: this.storedGST,
    };

    this.customerService.updateCustomer(requestBody).subscribe({
      next:(out) => {
         // console.log("Success" + JSON.stringify(this.newCustomer));
         console.log('output' + JSON.stringify(out));
         if (out.status == 200 ) {
           this.toastr.success(out.message, "Success");
           this.router.navigate(["customer/list"]);
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
      }
    })
  }

  onReset() {
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.patchValues();
  }

  // Upload Files
  uploadImages(fileDetails): Promise<any> {
    if (fileDetails) {
      return new Promise((resolve, reject) => {
        this.fileService.uploadFile(fileDetails).subscribe({
          next: (out: any) => {
            console.log('Upload Images response', out);
            console.log(out.status);

            if (out.status == 200) {
              console.log('Inside If');

              resolve(out);
            } else {
              reject;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.toastr.error('Error while uploading Image', 'Failure');
            reject(err);
          },
        });
      });
      // return res;
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  uploadProfileImage() {
    var folderName = 'profileImage';
    if (this.selectedProfileImage) {
      const file: File | null = this.selectedProfileImage.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.updateForm.value;
        var dt = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-${dt}`,
          path: folderName,
          file: file,
        };

        this.uploadImages(imageDetails).then((res: any) => {
          console.log('Inside Then', res);
          if (res.status == 200) {
            this.selectedProfileImage = undefined;
            this.isProfileImageUploaded = true;
            this.profileImageUrl = `${imageBaseUrl}/${folderName}/${res.file.filename}`;
          }
        });
      }
    }
  }

  uploadAadharFrontImage() {
    var folderName = 'AadharCard';
    if (this.selectedAadharFront) {
      const file: File | null = this.selectedAadharFront.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.updateForm.value;
        var dt = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-front-${dt}`,
          path: folderName,
          file: file,
        };

        this.uploadImages(imageDetails).then((res: any) => {
          console.log('Inside Then', res);
          if (res.status == 200) {
            this.selectedAadharFront = undefined;
            this.isAadharFrontImageUploaded = true;

            this.aadharFrontImageUrl = `${imageBaseUrl}/${folderName}/${res.file.filename}`;
          }
        });
      }
    }
  }

  uploadPassportFrontImage() {
    var folderName = 'Passport';
    if (this.selectedPassportFront) {
      const file: File | null = this.selectedPassportFront.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.updateForm.value;
        var dt = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-front-${dt}`,
          path: folderName,
          file: file,
        };

        this.uploadImages(imageDetails).then((res: any) => {
          console.log('Inside Then', res);
          if (res.status == 200) {
            this.selectedPassportFront = undefined;
            this.isPassportFrontImageUploaded = true;
            this.passportFrontImageUrl = `${imageBaseUrl}/${folderName}/${res.file.filename}`;
          }
        });
      }
    }
  }

  uploadAadharBackImage() {
    var folderName = 'AadharCard';
    if (this.selectedAadharBack) {
      const file: File | null = this.selectedAadharBack.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.updateForm.value;
        var dt = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-back-${dt}`,
          path: folderName,
          file: file,
        };

        this.uploadImages(imageDetails).then((res: any) => {
          console.log('Inside Then', res);
          if (res.status == 200) {
            this.selectedAadharBack = undefined;
            this.isAadharBackImageUploaded = true;
            this.aadharBackImageUrl = `${imageBaseUrl}/${folderName}/${res.file.filename}`;
          }
        });
      }
    }
  }

  uploadPassportBackImage() {
    var folderName = 'Passport';
    if (this.selectedPassportBack) {
      const file: File | null = this.selectedPassportBack.item(0);
      if (file) {
        // this.currentFile = file;
        var formValues = this.updateForm.value;
        var dt = this.datePipe.transform(new Date(), 'ddMMyyyyhhmmss');
        console.log('name', formValues.firstName);

        var imageDetails = {
          name: `${formValues.firstName}-back-${dt}`,
          path: folderName,
          file: file,
        };

        this.uploadImages(imageDetails).then((res: any) => {
          console.log('Inside Then', res);
          if (res.status == 200) {
            this.selectedPassportBack = undefined;
            this.isPassportBackImageUploaded = true;
            this.passportBackImageUrl = `${imageBaseUrl}/${folderName}/${res.file.filename}`;
          }
        });
      }
    }
  }

  selectImage(event: any): void {
    console.log('Inside Select File', event.target.id);
    if (event.target.id == 'profileImage') {
      this.selectedProfileImage =
        event.target.files.length > 0 ? event.target.files : null;
    } else if (event.target.id == 'aadharFrontImage') {
      this.selectedAadharFront =
        event.target.files.length > 0 ? event.target.files : null;
    } else if (event.target.id == 'aadharBackImage') {
      this.selectedAadharBack =
        event.target.files.length > 0 ? event.target.files : null;
    } else if (event.target.id == 'passportFrontImage') {
      this.selectedPassportFront =
        event.target.files.length > 0 ? event.target.files : null;
    } else if (event.target.id == 'passportBackImage') {
      this.selectedPassportBack =
        event.target.files.length > 0 ? event.target.files : null;
    }
  }

  deleteImage(imageType: any) {
    console.log('Inside deleteImage', imageType);

    if (imageType == 'profileImage') {
      this.isProfileImageUploaded = false;
      this.storedCustomer.profileImage = '';
    } else if (imageType == 'aadharFrontImage') {
      this.isAadharFrontImageUploaded = false;
      this.storedAadhar.frontImage = '';
    } else if (imageType == 'aadharBackImage') {
      this.isAadharBackImageUploaded = false;
      this.storedAadhar.backImage = '';
    } else if (imageType == 'passportFrontImage') {
      this.isPassportFrontImageUploaded = false;
      this.storedPassport.frontImage = '';
    } else if (imageType == 'passportBackImage') {
      this.isPassportBackImageUploaded = false;
      this.storedPassport.backImage = '';
    }
  }

  open(imageType: string) {
    console.log('Inside open Image', imageType);

    if (imageType == 'profileImage') {
      this.modalTitle = 'Profile Image';
      this.imageUrl =
        this.storedCustomer.profileImage != ''
          ? this.storedCustomer.profileImage
          : this.profileImageUrl;
    } else if (imageType == 'aadharFrontImage') {
      this.modalTitle = 'Aadhar Card Front Image';
      this.imageUrl =
        this.storedAadhar.frontImage != ''
          ? this.storedAadhar.frontImage
          : this.aadharFrontImageUrl;
    } else if (imageType == 'aadharBackImage') {
      this.modalTitle = 'Aadhar Card Back Image';
      this.imageUrl =
        this.storedAadhar.backImage != ''
          ? this.storedAadhar.backImage
          : this.aadharBackImageUrl;
    } else if (imageType == 'passportFrontImage') {
      this.modalTitle = 'Passport Front Image';
      this.imageUrl =
        this.storedPassport.frontImage != ''
          ? this.storedPassport.frontImage
          : this.passportFrontImageUrl;
    } else if (imageType == 'passportBackImage') {
      this.modalTitle = 'Passport Back Image';
      this.imageUrl =
        this.storedPassport?.backImage != ''
          ? this.storedPassport?.backImage
          : this.passportBackImageUrl;
    }
  }
}
