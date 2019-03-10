import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PlotlyModule } from 'angular-plotly.js';

import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PlotlyModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
