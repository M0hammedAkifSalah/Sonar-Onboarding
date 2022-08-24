import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from 'src/app/general.service';
import { HttpService } from 'src/app/services/http.service';
import { ErrorDialogComponent } from '../../../error-dialog/error-dialog.component';

export interface Data {
  name: string;
  email: string;
  contact_number: number;
  institution_code:number;
  noofschools: number;
}

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {
  dataSource = new MatTableDataSource<Data>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'email', 'contact_number','institution_code', 'noofschools','delete','edit'];
  institutions:[]=[];
  Form: FormGroup;
  currTab:number=2;
  institute:any;
  countries:any;
  states:any;
  cities:any=[];
  isUpdate:boolean=false;
  profile_pic:any;

  selectedCity:any;
  constructor(private http:HttpService,private dialog:MatDialog,private service:GeneralService) { 
    this.getCountries();
    this.getStates();
   
    this.Form = new FormGroup({
      Institute_Name: new FormControl('',Validators.required),
      Email: new FormControl('',Validators.required),
      Contact_Number: new FormControl('',Validators.required),
      Country: new FormControl(null,Validators.required),
      State: new FormControl(null,Validators.required),
      City: new FormControl(null,Validators.required),
      Pincode: new FormControl(),
      Address: new FormControl(),
      Website: new FormControl()
    })
  }

  ngOnInit(): void {
    this.getInstituions();
  }

  getInstituions(){
    this.http.getInstitutions().subscribe((res:any)=>{
      this.institutions = res.data
      this.service.institutions.next(this.institutions.length)
      this.dataSource = res.data;
      console.log(this.institutions)
    })
  }
  changeTab(tab:number){
    this.currTab = tab;
  }

  getCountries(){
    this.http.getCountry().subscribe((res:any)=>{
      this.countries = res.data;
      console.log(this.countries)
    })
  }
  getStates(){
    this.http.getStates().subscribe((res:any)=>{
      this.states = res.data;
      console.log(this.states)
    })
  }

  getCities(){
    let state = this.Form.value.State;

    this.http.getCities().subscribe((res:any)=>{
      this.cities = res.data.filter((city:any)=>{
        return city.state_id === state
      })
      console.log(this.cities)
    })

  }

  schoolUpload(event: any) {
    console.log(event.target.files[0])
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    console.log(formData)
    this.http.uploadFile(formData).subscribe((response: any) => {
      console.log(response)
      if (response.status === 'success') {

        this.profile_pic = response.message
        console.log('Profile_pic ', this.profile_pic)
      } else {
        console.log(response.status)
        return;
      }
    }, (err) => {
      console.log(err)
      if (err.status == 400) {
        console.log(err)
        return;
      } else {
        console.log(err)
        return;
      }
    });
  }

  delete(id:any,name:String){
    this.http.delete(id).subscribe((res:any)=>{
      this.getInstituions()
      this.dialog.open(ErrorDialogComponent,{data:{
        title:'Deleted',
        desc:`${name} is Deleted`
      }})

    })
  }

  submit(){
    if(this.isUpdate){
      this.update();
    }else{
    let Items:any=[];
    Items = Object.entries(this.Form.controls);
   // console.log(Items)
    let invalidItems:any=[];
    
    invalidItems = Items.filter((element:any) => {
      console.log(element[1].status)
      return element[1].status === 'INVALID'
    }) 
    console.log(invalidItems)
    console.log(this.profile_pic)
    if(this.Form.valid){
      let obj = {
        name: this.Form.value.Institute_Name,
        profile_image: this.profile_pic,
        address: this.Form.value.Address,
        city: this.Form.value.City,
        state: this.Form.value.State,
        country: this.Form.value.Country,
        email: this.Form.value.Email,
        webSite: this.Form.value.Website,
        contact_number: this.Form.value.Contact_Number,
        pincode:this.Form.value.Pincode,
        activeStatus:true
    }
    console.log(obj)
    this.http.createInstitute(obj).subscribe((res:any)=>{
      console.log(res)
      
      this.getInstituions();
      this.dialog.open(ErrorDialogComponent,{data:{
        title:'Created',
        desc:`${this.Form.value.Institute_Name} is Created`
      }})
      this.currTab = 2;
    },err=>{
      console.log(err)
      this.dialog.open(ErrorDialogComponent,{data:{
        title:'Error',
        desc:`${err.error.message}`
      }})
    })

    }else{
       let check = invalidItems.map((item:any)=>{
        return item[0]
      }) 
      console.log(check)
      let data={
        title:'Invalid Fields',
        desc:`Please Enter ${check}`
      };
     
      this.dialog.open(ErrorDialogComponent,{data})
    }
    }
    
    
  }

  edit(id:any){
    
    this.http.getInstitute(id).subscribe((res:any)=>{
      this.institute = res.data[0]
      console.log(this.institute)
      this.Form.patchValue({'Institute_Name':this.institute.name});
      this.Form.patchValue({'Email':this.institute.email});
      this.Form.patchValue({'Contact_Number':this.institute.contact_number});
      this.Form.patchValue({'Country':this.institute.country._id});
      this.Form.patchValue({'State':this.institute.state._id});
      this.Form.patchValue({'City':this.institute.city._id});
      this.Form.patchValue({'Pincode':this.institute.pincode});
      this.Form.patchValue({'Address':this.institute.address});
      this.Form.patchValue({'Website':this.institute.webSite});
    })

    
    this.currTab = 1;
    this.isUpdate = true;
   
  }

  update(){
    console.log(this.institute.state)
    let obj = {
      name: this.Form.value.Institute_Name ,
      profile_image: this.profile_pic,
      address: this.Form.value.Address,
      city: this.Form.value.City,
      state: this.Form.value.State,
      country: this.Form.value.Country,
      email: this.Form.value.Email,
      webSite: this.Form.value.Website,
      contact_number: this.Form.value.Contact_Number,
      pincode:this.Form.value.Pincode,
      activeStatus:true,
      _id:this.institute._id
  }
  console.log(obj)
  this.http.update(obj).subscribe((res:any)=>{
    console.log(res)
    this.getInstituions();
    this.currTab = 2;
    this.dialog.open(ErrorDialogComponent,{
      data:{
        title:'Updated',
        desc:`${this.Form.value.Institute_Name} Updated Successfully`
      }
    })
  },err =>{
    this.dialog.open(ErrorDialogComponent,{
      data:{
        title:'Update Error',
        desc:err.error.message
      }
    })
  })
  }
  
  add(){
    this.isUpdate = false;
    this.institute = null;
    this.Form.patchValue({'Institute_Name':''});
      this.Form.patchValue({'Email':''});
      this.Form.patchValue({'Contact_Number':''});
      this.Form.patchValue({'Country':null});
      this.Form.patchValue({'State':null});
      this.Form.patchValue({'City':null});
      this.Form.patchValue({'Pincode':''});
      this.Form.patchValue({'Address':''});
      this.Form.patchValue({'Website':''});
    this.changeTab(1)
  }
  
}
