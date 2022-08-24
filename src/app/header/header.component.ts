import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  schoolImage:any;
  schoolName :any;
  schoolContact:any;
  
  constructor(private router:Router,public service:GeneralService) { 
    
    this.schoolContact = localStorage.getItem('schoolContact')
    this.schoolImage = localStorage.getItem('schoolImage')
  }

  ngOnInit(): void {
    console.log(this.service.schoolName.value)
    //this.service.loggedIn ? this.schoolName = localStorage.getItem('schoolName') : ''
  }
  logOut(){
    localStorage.clear();
    this.router.navigate(['login'])
    this.service.schoolName.next('')
    this.service.schoolCode.next('')
    this.service.schoolNumber.next('')
    this.service.schoolImage.next('')
  }

  schoolDetails(){
    this.service.currStep.next(1)
    this.router.navigate([''])
  }
  branchDetails(){
    this.service.currStep.next(2)
    this.router.navigate([''])
   

  }
  classes(){
    this.service.currStep.next(3)
    this.router.navigate([''])
  }
}
