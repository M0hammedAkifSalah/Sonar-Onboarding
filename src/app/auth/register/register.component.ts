import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Form: FormGroup;
  Country: any;
  States: any;
  City: any;
  constructor(private http: HttpService, private Route: Router) {
    this.Form = new FormGroup({
      'School_Name': new FormControl('', Validators.required),
      'Admin_Name': new FormControl('', Validators.required),
      'Email': new FormControl('', Validators.email),
      'Phone_Number': new FormControl('', Validators.minLength(10)),
      'Password': new FormControl('', Validators.required),
      'Confirm_Password': new FormControl('', Validators.required),
      'Country': new FormControl(null, Validators.required),
      'State': new FormControl(null, Validators.required),
      'City': new FormControl(null, Validators.required)
    })

  }

  ngOnInit(): void {
    this.getCountry();
    this.getStates();
  }

  signUp(event: any) {
    let data = {
      schoolName: this.Form.value.School_Name,
      SchoolContactNumber: this.Form.value.Phone_Number,
      schoolEmail: this.Form.value.Email,
      countryId: this.Country[0]._id,
      stateId: this.Form.value.State,
      cityId: this.Form.value.City,
    }
    console.log(data)

    this.http.signUp(data).subscribe((res:any)=>{
      console.log(res)
      localStorage.setItem('id',res.data.schoolId)
      localStorage.setItem('s_code',res.data.school_code)
     
      if(res.data.schoolId){
        let data = {
          name: this.Form.value.Admin_Name,
          email:this.Form.value.Email,
          mobile:this.Form.value.Phone_Number,
          password: this.Form.value.Password,
          school_id: res.data.schoolId,
          designation: "ADMIN",
          profile_type: "5fd1c4f6ba54044664ff8c0d"
        }
        this.http.regAdmin(data).subscribe((res:any)=>{
            console.log(res)
            this.Route.navigate(['login'])
        })
      }

    }, (err) => {
      console.log(err.message)
    }) 
  }

  login() {
    this.Route.navigate(['login'])
  }


  getCountry() {
    this.http.getCountry().subscribe((res: any) => {
      this.Country = res.data;
      console.log(this.Country)
    })
  }
  
  getStates(stateId?: any) {
    this.http.getStates().subscribe((res: any) => {
      this.States = res.data
      console.log(this.States)
    })

  }

  getCities(branch?: any) {

    this.http.getCities().subscribe((res: any) => {
      this.City = res.data
      let formValue = this.Form.value
      console.log(formValue)
      const b_cities = this.City.filter((item: any) => {
        if (item.state_id === formValue.State) {
          return item.state_id
        }
      })
      this.City = b_cities;
      console.log(this.City)
    })
  }


}
