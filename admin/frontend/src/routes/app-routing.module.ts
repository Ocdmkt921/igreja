import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/pages/home/home.component';
import { DashboardComponent } from 'src/pages/dashboard/dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/day/0', pathMatch: 'full' },
  { 
    path: '', component: HomeComponent, 
    children: [
      { path: 'day/:weekday', component: DashboardComponent }
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
