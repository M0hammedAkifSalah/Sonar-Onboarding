import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/general.service';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/Components/error-dialog/error-dialog.component';
import { faPen } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faPen = faPen;
  leads:any=[];
  schools:any=[];
  heading:any;
  searchList:any=[];
  institutionsEnabled:boolean=false;
  status:Boolean=false;
  constructor(private http:HttpService,private router:Router,private route:ActivatedRoute,public service:GeneralService,private dialog:MatDialog) {
    if(service.currenttab.value === 1){
      this.heading = 'Leads'
    }else if(service.currenttab.value === 2){
      this.heading = 'Onboarded Schools'
    }else{
      this.heading = 'Institutions';
      this.institutionsEnabled = true;
    }
    this.getSchools();
   // this.service.currenttab.next(1)
    if (!localStorage.getItem('opToken')) {
      router.navigate(['operations/login'])
    }
    this.getInstituions()
  }

  ngOnInit(): void {
  }
  getSchools(){
    this.http.getSchools().subscribe((res:any)=>{
      console.log(res)
      res.data.forEach((element:any) => {
       if(element.isOnboarded) {
        this.schools.push(element)
       }
       else{
         this.leads.push(element)
       }
      });
      this.service.schools.next(this.schools.length);
      this.service.leads.next(this.leads.length);
      console.log(this.leads)
      console.log(this.schools)
    })
   
   
   
  }

  changeTab(tab:any){
    this.service.currenttab.next(tab)
    if(tab === 1){
      this.heading = `Leads - ${this.leads.length}`;
      this.institutionsEnabled = false;
    }else if(tab === 2){
      this.heading = `Onboarded Schools - ${this.schools.length}`
      this.institutionsEnabled = false;
    }else{
      this.heading = `Institutions`
      this.institutionsEnabled = true;
    }
  }

  singleSchool(school:any){
    
    console.log(school._id)
    this.router.navigate([`operations/school/${school._id}`])
  }
  logOut(){
    localStorage.clear();
    this.router.navigate(['operations/login'])
  }
  /* search(value:any){

    this.schools.filter((item:any)=>{
      if(item.schoolName === value.target.value){
        this.searchList.push(item)
      }
     
    })
    if(value.target.value === ''){
      this.searchList = []
    }
    console.log(this.searchList)
  } */
  getInstituions(){
    this.http.getInstitutions().subscribe((res:any)=>{
      this.service.institutions.next(res.data.length)
    })
  }

  toggleChanged(id:any,activestatus:any){
    console.log('State',activestatus)
    let data = {
      activeStatus: false,
      repositoryId: id
    }
   
    //this.status = !this.status;
    if(activestatus){
      console.log('Active')
      this.http.deactivateSchool(data).subscribe((res:any)=>{
        console.log(res)
       
       // this.getSchools();
        this.ngOnInit();
      })
    }else{
      console.log('Not Active')
      this.http.deactivateSchool({
        activeStatus: true,
        repositoryId: id
      }).subscribe((res:any)=>{
        console.log(res)
       
      //  this.getSchools();
        this.ngOnInit();
      })
    }
    this.dialog.open(ErrorDialogComponent,{
      width: '350px',
      height: '250px',
      data: { title: 'Updated' , desc: `School Updated`, accept:true},
    })
        
        
     


    
  }
}
