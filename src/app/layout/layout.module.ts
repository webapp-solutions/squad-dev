import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopnavigationComponent } from './topnavigation/topnavigation.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    TopnavigationComponent,
    SidebarComponent, 
    FooterComponent
  ],
  exports: [
    TopnavigationComponent,
    SidebarComponent, 
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
