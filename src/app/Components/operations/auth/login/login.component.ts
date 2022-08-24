import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/Components/error-dialog/error-dialog.component';
import { GeneralService } from 'src/app/general.service';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginOComponent implements OnInit {

  Form: FormGroup;

  constructor(private http: HttpService, private dialog: MatDialog, private Router: Router,private service:GeneralService) {
    this.Form = new FormGroup({
      'username': new FormControl('', Validators.minLength(10)),
      'password': new FormControl('', Validators.required),
    })
    if(localStorage.getItem('opToken')){
      Router.navigate(['operations/dashboard'])
    }
  }

  ngOnInit(): void {
  }

  login() {

    let data = {
      username: this.Form.value.username,
      password: this.Form.value.password,
      global:false
    }
    if(data.username && data.password ){
            //  console.log(data)
    this.http.login(data).subscribe((res: any) => {
      console.log(res);
      if(res.message == 'User does Not Exist'){
        this.errorDialog('User does Not Exist')
      }else{
        localStorage.setItem('opToken',res.token)
        this.Router.navigate(['operations/dashboard'])
        //this.dialog.closeAll();
      }
     
    }, err => {
      console.log(err)
      this.errorDialog(err.error.message);
      //alert(err.message)
    })
    }else{
      this.errorDialog('Please Enter All Details')
    }


  }
  errorDialog(data?:any): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '450px',
      height: '250px',
      data: { title: 'Error' , desc: data },
      panelClass: 'custom-modalbox'
    });
  }

  

}
