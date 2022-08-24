import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/general.service';
import { ErrorDialogComponent } from 'src/app/Components/error-dialog/error-dialog.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Form: FormGroup;

  constructor(private http: HttpService, private dialog: MatDialog, private Router: Router, private service: GeneralService) {
    let scode = localStorage.getItem('s_code');
    this.Form = new FormGroup({
      'username': new FormControl('', Validators.minLength(10)),
      'password': new FormControl('', Validators.required),
      'school_Code': new FormControl(Number(scode), Validators.required)
    })
  }

  ngOnInit(): void {
  }

  login() {

    let data = {
      username: this.Form.value.username,
      password: this.Form.value.password,
      school_code: this.Form.value.school_Code,
      global: false
    }
    if (data.username && data.password && data.school_code) {
      //  console.log(data)
      this.http.login(data).subscribe((res:any) => {
        if (res.message == 'User does Not Exist') {
          this.errorDialog('User does Not Exist')
        } else {
          localStorage.setItem('token', `${res.token}`)
          localStorage.setItem('id', res.user_info[0].school_id)
          localStorage.setItem('schoolContact', res.user_info[0].school_details[0].contact_number)
          localStorage.setItem('schoolCode', res.user_info[0].school_details[0].school_code)
          this.service.schoolName.next(res.user_info[0].school_details[0].schoolName)
          this.service.schoolCode.next(res.user_info[0].school_details[0].school_code)
          this.Router.navigate([''])
          //this.dialog.closeAll();
        }

      } ,(err:any) => {
        console.log(err,'Hello')
       this.errorDialog(err.error.message ? err.error.message : '');
        //alert(err.message)
      })
    } else {
      this.errorDialog('Please Enter All Details')
    }


  }
  errorDialog(data?: any): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '450px',
      height: '250px',
      data: { title: 'Error', desc: data },
      panelClass: 'custom-modalbox'
    });
  }

  signUp() {
    this.Router.navigate(['register'])
  }

}
