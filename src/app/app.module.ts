import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './Components/students/students.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PreviewComponent } from './Components/students/preview/preview.component';
import { BulkUploadComponent } from './Components/bulk-upload/bulk-upload.component'
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component'
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field'; import { TokenInterceptorService } from './services/token-interceptor.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox'
import { ModalComponent } from './Components/modal/modal.component';
import { SectionComponent } from './home/dialogs/section/section.component';
import { TeacherPreviewComponent } from './Components/students/teacher-preview/teacher-preview.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorDialogComponent } from './Components/error-dialog/error-dialog.component';
import { SubjectComponent } from './home/dialogs/subject/subject.component';
import { UploadBtnPipe } from './upload-btn.pipe';
import { OperationsComponent } from './Components/operations/operations.component';
import { LoginOComponent } from './Components/operations/auth/login/login.component';
import { DashboardComponent } from './Components/operations/dashboard/dashboard.component';
import { SchoolComponent } from './Components/operations/dashboard/school/school.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InstitutionComponent } from './Components/operations/dashboard/institution/institution.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#ffc30a",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 5,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#ffc30a",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "three-bounce",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": '../assets/Logo.png',
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#ffc30a",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    StudentsComponent,
    PreviewComponent,
    BulkUploadComponent,
    RegisterComponent,
    LoginComponent,
    LoginOComponent,
    ModalComponent,
    SectionComponent,
    TeacherPreviewComponent,
    ErrorDialogComponent,
    SubjectComponent,
    UploadBtnPipe,
    OperationsComponent,
    DashboardComponent,
    SchoolComponent,
    InstitutionComponent,
  ],
  exports: [MatIconModule],
  imports: [
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
    MatDialogModule,
    MatTabsModule,
    HttpClientModule,
    MatCardModule,
    MatCheckboxModule,
    FontAwesomeModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true })

  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {

}
