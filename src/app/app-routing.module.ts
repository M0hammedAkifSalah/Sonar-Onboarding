import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BulkUploadComponent } from './Components/bulk-upload/bulk-upload.component';
import { OperationsComponent } from './Components/operations/operations.component';
import { LoginOComponent } from './Components/operations/auth/login/login.component';
import { StudentsComponent } from './Components/students/students.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './Components/operations/dashboard/dashboard.component';
import { SchoolComponent } from './Components/operations/dashboard/school/school.component';
import { InstitutionComponent } from './Components/operations/dashboard/institution/institution.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'bulkupload', component: BulkUploadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'operations', component: OperationsComponent,
    children: [
      { path: 'login', component: LoginOComponent },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'school/:id', component: SchoolComponent},
      { path: 'institution', component: InstitutionComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
