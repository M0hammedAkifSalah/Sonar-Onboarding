import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  currStep = new BehaviorSubject<any>(1);
  previewValid = new BehaviorSubject(true) ;
  classes = new BehaviorSubject<any>(null);
  classesObj = new BehaviorSubject<any>(null);
  schoolName = new BehaviorSubject<any>(localStorage.getItem('schoolName') ? localStorage.getItem('schoolName') : null);
  schoolCode = new BehaviorSubject<any>(localStorage.getItem('schoolCode') ? localStorage.getItem('schoolCode') : null);
  schoolImage = new BehaviorSubject<any>(localStorage.getItem('schoolImage') ? localStorage.getItem('schoolImage') : '');
  schoolNumber = new BehaviorSubject<any>(localStorage.getItem('schoolContactNumber') ? localStorage.getItem('schoolContactNumber') : ''); 
  currenttab = new BehaviorSubject<number>(1);
  popupYes = new BehaviorSubject<boolean>(false);
  //Operations Dashboard
  leads = new BehaviorSubject<number>(0);
  schools = new BehaviorSubject<number>(0);
  institutions = new BehaviorSubject<number>(0);
  constructor() { }


  
}
