import { Component, OnInit } from "@angular/core";
import {
  customerRoutes, travelGroupRoutes,
} from "src/app/shared/appConfig";
// import { Router } from '@angular/router';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  dashboard=""

  /* #region  Customer Routes */
  listCustomers = `/${customerRoutes.Base}/${customerRoutes.List}`;
  createCustomer = `/${customerRoutes.Base}/${customerRoutes.Add}`;
  /* #endregion */

  // /* #region  Customer Account Routes */
  // listConsumerAccounts = `/${customerAccountRoutes.Base}/${customerAccountRoutes.List}`;
  createTravelGroup = `/${travelGroupRoutes.Base}/${travelGroupRoutes.Add}`;
  /* #endregion */

  /* #region  Receipt Routes */
  // listReceipts = `/${receiptRoutes.Base}/${receiptRoutes.List}`;
  // createReceipt = `/${receiptRoutes.Base}/${receiptRoutes.Add}`;
  /* #endregion */
 
  /* #region  Delivery Man Routes */
  // listDeliveryMen = `/${deliveryManRoutes.Base}/${deliveryManRoutes.List}`;
  // createDeliveryMan = `/${deliveryManRoutes.Base}/${deliveryManRoutes.Add}`;
  /* #endregion */

}
