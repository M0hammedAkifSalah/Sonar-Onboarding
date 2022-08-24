import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import * as XLSX from '../../../../node_modules/xlsx'
import { MatDialog } from '@angular/material/dialog';
import { ThisReceiver } from '@angular/compiler';
import { PreviewComponent } from './preview/preview.component';
import { GeneralService } from 'src/app/general.service';
import { studentClasses } from 'src/app/models/studentClasses.model';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { TeacherPreviewComponent } from './teacher-preview/teacher-preview.component';
import { faTrashCan, faEye, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  faTrashCan = faTrashCan;
  faEye = faEye;
  faUpload = faUpload;
  schoolLevelData: any = []
  globalTeachers: any = []
  IndexTable: any = [];
  data: any = []
  rowData: any = [];
  classes: any = [];
  class: any;
  count: any;
  isLoaded: boolean = false;
  test: any;
  gotClasses: any;
  school:any;
  uploadDisabled: any = [];
  isUploadEnableTeachers :Boolean = true;
  constructor(private dialogRef: MatDialog, public valid: GeneralService, private http: HttpService, private router: Router, public dialog: MatDialog,private ngxLoader: NgxUiLoaderService) {

    this.http.getSchool(localStorage.getItem('id')).subscribe((res: any) => {
      this.school = res.data[0]
      console.log(this.school)
      console.log(res.data[0].classList)
      // this.gotClasses = ;
      console.log('Called2', res.status)
      if (res.status == 200) {

        res.data[0].classList.forEach((classObj: any) => {
          console.log(classObj)
          classObj.section.forEach((sectionObj: any) => {
            console.log(sectionObj)
            console.log('Called3', res.status)
            this.class = new studentClasses();
            this.class.Class = classObj;
            this.class.Section = sectionObj;

            console.log(this.class)
            this.classes.push(this.class)
          })
          //
        });

        this.isLoaded = true;


      }
      console.log(this.classes)


    });

  }

  ngOnInit(): void {
    this.data.classObj = []
    this.data.rowData = []

    console.log('Called')


    console.log(this.classes)
  }
  fileUploaded(event: any, classObj: any, i: any) {
    console.log(classObj)
    console.log(event.target.files[0])
    let selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' })
      let excelData: any = [];
      workbook.SheetNames.forEach((sheet) => {
        excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

      })

      console.log(excelData);
      console.log(classObj);
      let sectionLevelData: any = [];
      //construct section level data and push it to school level data
      excelData.forEach((ele: any) => {
        sectionLevelData.push({
          school_id: localStorage.getItem('id'),
          branch_id: this.school.branch[0]._id ,
          name: ele.Student_name,
          gender: ele.Gender,
          username: ele.Parent_Mobile,
          p_username: ele.Parent_Mobile,
          p_name: ele.Parent_Name,
          class: classObj.Class.classId,
          section: classObj.Section.id,
          guardian: "father",
          f_contact_number: ele.Parent_Mobile
        })
      });

      this.schoolLevelData = [...this.schoolLevelData, ...sectionLevelData];
      //alert('Uploaded')
      console.log(this.schoolLevelData)
      this.preview(classObj);
      this.uploadDisabled.push({ index: i, value: true })
      console.log(this.uploadDisabled)
     // let IndexTable: any = [];
      this.classes.forEach((ele: any, index: any) => {
        this.IndexTable.push({ Index: index })
        console.log(ele)
      });

      /*   let valueToCheck = this.uploadDisabled.filter((ele:any)=>{
          return IndexTable.indexOf(ele.index) === -1;
        }) */
      let valueToCheck = this.uploadDisabled.filter((ele: any) => {
      this.IndexTable[ele.index].value = ele.value
      console.log(this.IndexTable[ele.index].value)
      })
      console.log(this.IndexTable)
    }

    //make api call to pass excel data to class and section
  }

  onInputClick(event: any) {
    event.target.value = ''

  }
  bulkUpload() {

    console.log(this.schoolLevelData)
    let student_list = {
      student_list: this.schoolLevelData
    }
    console.log(student_list)
    this.ngxLoader.start();
    this.http.bulkUpload(student_list).subscribe((res: any) => {
      console.log(res)
      this.openDialog('student');
      this.ngxLoader.stop();
    },(err)=>{
      console.log(err)
      this.ngxLoader.stop();
    })

  }

  preview(classObj: any, i?: any) {

    console.log(classObj)
    const Classdata = this.schoolLevelData.filter((obj: any) => {

      return obj.class == classObj.Class.classId && obj.section == classObj.Section.id
    })

    console.log(Classdata)




    console.log(Classdata)
    this.dialogRef.open(PreviewComponent, {
      data: {

        rowData: Classdata
      }
    })

  }

  clear(classObj: any,i?:any) {
    const clearData = this.schoolLevelData.filter((obj: any) => {
      return obj.section !== classObj.Section.id
    })

    this.schoolLevelData = clearData
    console.log(this.schoolLevelData)


    this.IndexTable[i].value = false    //this.uploadDisabled = []
    this.uploadDisabled[i].value = false
     this.uploadDisabled.forEach((element:any) => {
      element.value ? element.value = false : ''
    }); 
    console.log(this.IndexTable)
  }

  add() {
    this.class = new studentClasses;
    this.classes.push(this.class)
  }



  step3() {
    console.log('Step3',this.valid.currStep.value)
   
      console.log('Step3')
      this.router.navigate([''])
      this.valid.currStep.next(3)
    
  }
  step2() {
    if (this.valid.currStep.value !== 2) {
      this.router.navigate([''])
      this.valid.currStep.next(2)
    }
  }
  step1() {
    if (this.valid.currStep.value !== 1) {
      this.router.navigate([''])
      this.valid.currStep.next(1)
    }
  }

  openDialog(student?: any): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '450px',
      height: '250px',
      data: { title: student ? 'Students Added Successfully' : 'Teachers Added Successfully', desc: student ? ` ${this.schoolLevelData.length} Students Added Successfully ` : ` ${this.globalTeachers.length} Teachers Added Successfully ` },
      panelClass: 'custom-modalbox'
    });
  }

  errorDialog(data?: any): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '450px',
      height: '250px',
      data: { title: 'Error', desc: data },
      panelClass: 'custom-modalbox'
    });
  }



  //Teacher Bulk Upload
  // Need to Take Uploaded file and Parse Object and Call API

  bulkUploadTeachers(event: any) {

    console.log(event.target.files[0])
    let selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' })
      let excelData: any = [];
      workbook.SheetNames.forEach((sheet) => {
        excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
      })

      console.log(excelData)
      excelData.forEach((ele: any) => {
        this.globalTeachers.push({
          name: ele.Name,
          //Teacher
          ...(ele.Profile_type === 'Teacher' && { profile_type: '5fd2f18f9cc6537951f0b35c' }),
          ...(ele.Profile_type === 'Teacher' && { profile_type_name: 'Teacher' }),
          //Principal
          ...(ele.Profile_type === 'Principal' && { profile_type: '5fd1c755ba54044664ff8c0f' }),
          ...(ele.Profile_type === 'Principal' && { profile_type_name: 'Principal' }),
          //Management
          ...(ele.Profile_type === 'Management' && { profile_type: '5fd1c839ba54044664ff8c10' }),
          ...(ele.Profile_type === 'Management' && { profile_type_name: 'Management' }),

          mobile: ele.Mobile,
          school_id: localStorage.getItem('id'),
          branch_id: this.school.branch[0]?._id,
          gender: ele.Gender,
          password: `${ele.Mobile}**`,

        })
      });

      console.log({ users: [this.globalTeachers] })

      this.teachersPreview(this.globalTeachers)
      this.isUploadEnableTeachers = false;
    }

  }

  teachersPreview(data?: any) {
    this.dialogRef.open(TeacherPreviewComponent, {
      data: {

        rowData: data
      }
    })
  }

  submitTeacher() {
    let errorObj: any = []
    if (this.globalTeachers) {
      this.ngxLoader.start();
      this.http.bulkUploadTeachers({ users: this.globalTeachers }).subscribe((res: any) => {
        console.log(res)
        this.ngxLoader.stop();
        this.openDialog();
      }, (err) => {
        this.ngxLoader.stop();
        err.error.data.forEach((ele: any) => {

          errorObj.push(`${ele.name} ${ele.error}`)

        })
        console.log(errorObj)
        this.errorDialog(errorObj)
      })
    }
  }
  clearTeachers() {
    this.globalTeachers = [];
    this.isUploadEnableTeachers = true;
  }



}
