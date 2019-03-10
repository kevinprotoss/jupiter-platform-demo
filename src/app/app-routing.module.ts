import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report', component: ReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
