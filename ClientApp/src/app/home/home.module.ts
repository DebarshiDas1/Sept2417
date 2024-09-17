import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateListComponent } from '../template/tempale-list/template-list.component';
import { TemplateAddComponent } from '../template/template-add/template-add.component';
import { TemplateComponent } from '../template/template/template.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { TemplatePreviewComponent } from '../template/template-preview/template-preview.component';
import { DynamicLayoutComponent } from '../template/dynamic-layout/dynamic-layout.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PreviewLayoutComponent } from '../template/preview-layout/preview-layout.component';

@NgModule({
  declarations: [
    SideBarComponent,
    TopBarComponent,
    HomeComponent,
    LoginComponent,
    TemplateListComponent,
    TemplateAddComponent,
    DashboardComponent,
    TemplateComponent,
    TemplatePreviewComponent,
    DynamicLayoutComponent,
    PreviewLayoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    FormsModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    provideNativeDateAdapter()
  ]
})
export class HomeModule { }
