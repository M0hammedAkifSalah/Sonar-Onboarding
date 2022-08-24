import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/general.service';
import { HttpService } from 'src/app/services/http.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/Components/error-dialog/error-dialog.component';

export interface Data {
  name: string;
  gender: string;
  p_name: string;
  p_mobile: number;
}


const DATA: Data[] = [];
@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  displayedColumns: string[] = ['name', 'gender', 'p_name', 'p_mobile', 'pin'];
  displayedColumns2: string[] = ['name', 'mobile', 'profile_type', 'gender'];
  dataSource = new MatTableDataSource<Data>();
  dataSource2 = new MatTableDataSource<Data>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) paginator2: MatPaginator;
  school: any = {};
  Form: FormGroup;
  Country: any;
  branchForm: FormGroup;
  Teachers: any;
  Students: any;
  Classes: any;
  pageSize: any = 1;
  searchTableisEnabled: boolean = false;
  searchTableisEnabled2: boolean = false;
  institutions: any;
  countries: any;
  cities: any;
  states: any;
  selectedState: any/* ={
    state_name:'',
    _id:''
  }; */
  selectedCountry: any;
  selectedCity: any;
  selectedInstitute: any;
  selectedsmsActivated: any;
  branchLength: any;
  gov: String = '60b49af9cca795cf59c4bc1e';
  pvt: String = '6155b3403f741836b8be5773';
  teachersLength: number;
  totalStudentCount: number;

  constructor(private route: ActivatedRoute, private http: HttpService, public service: GeneralService, private router: Router, private dialog: MatDialog) {
    this.Form = new FormGroup({
      School_Name: new FormControl(),
      Email: new FormControl(),
      Contact_Number: new FormControl(),
      NoofBranches: new FormControl(),
      InstituteType: new FormControl(),
      Country: new FormControl(),
      State: new FormControl(),
      City: new FormControl(),
      Pincode: new FormControl(),
      Address: new FormControl(),
      Institute: new FormControl(),
      smsActivated: new FormControl(),
    })
    this.branchForm = new FormGroup({
      'Branch_Name': new FormControl(),
      'Branch_Email': new FormControl(),
      'Branch_Contact': new FormControl(),
      'Branch_Country': new FormControl(),
      'Branch_State': new FormControl(),
      'Branch_City': new FormControl(),
      'Branch_Pincode': new FormControl(),
      'Branch_Address': new FormControl()
    })


    this.http.getSchool(route.snapshot.paramMap.get('id')).subscribe((res: any) => {
      this.school = res.data[0];
      console.log(this.school)
      this.getStudentCount()

      //School AutoFill
      this.Form.patchValue({ 'School_Name': this.school.schoolName })
      this.Form.patchValue({ 'Email': this.school.email })
      this.Form.patchValue({ 'Contact_Number': this.school.contact_number })
      // this.Form.patchValue({ 'InstituteType': this.school.institute_type })
      this.Form.patchValue({ 'NoofBranches': this.school.branch.length })
      this.Form.patchValue({ 'Country': this.school.country._id })
      this.Form.patchValue({ 'State': this.school.state })
      this.Form.patchValue({ 'City': this.school.city })
      this.Form.patchValue({ 'Pincode': this.school.pincode })
      this.Form.patchValue({ 'Address': this.school.address })
      this.Form.patchValue({ 'Institute': this.school.institute })
      this.Form.patchValue({ 'smsActivated': this.school.smsActivated })

      //Branch AutoFill
      this.branchForm.patchValue({ 'Branch_Name': this.school.branch[0] ? this.school.branch[0].name : '' })
      this.branchForm.patchValue({ 'Branch_Email': this.school.branch[0] ? this.school.branch[0].email : '' })
      this.branchForm.patchValue({ 'Branch_Contact': this.school.branch[0] ? this.school.branch[0].contact : '' })
      this.branchForm.patchValue({ 'Branch_Country': this.school.country._id })
      this.branchForm.patchValue({ 'Branch_Address': this.school.address })
      this.branchForm.patchValue({ 'Branch_Pincode': this.school.pincode })

      this.branchLength = this.school.branch.length;
      console.log(this.branchLength)
      this.selectedInstitute = this.school.institute
      console.log(this.selectedInstitute)
      this.Classes = this.school.classList ? this.school.classList : '';
      this.getCountry()
      console.log(this.school.state)
      this.selectedState = this.school ? this.school.state : ''
      console.log(this.selectedState)
      this.selectedCity = this.school.city
      this.selectedCountry = this.school.country
      this.getStudents(this.school.classList[0]?.classId);
      this.dataSource.paginator = this.paginator;
      this.dataSource2.paginator = this.paginator2;
      this.getTeachers();
      this.getInstitutions();
    })

    this.getCountries();
    this.getStates();
  }

  ngOnInit(): void {
    /*  this.selectedState = this.school ? this.school.state : '';
     console.log(this.selectedState) */
    // this.dataSource.paginator = this.paginator;

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;
  }
  changeTab(tab: any) {
    this.service.currenttab.next(tab)
    this.router.navigate(['operations/dashboard'])
  }

  // Get Country
  getCountry() {
    this.http.getCountry().subscribe((res: any) => {
      this.Country = res.data;
      console.log(this.Country)
    })
  }

  getTeachers() {
    this.http.getAllUsers(this.school.school_code).subscribe((res: any) => {
      this.dataSource2 = res.data;
      console.log(this.dataSource2)
    })
    this.http.getTeachers(this.school._id, 1, 500).subscribe((res: any) => {
      this.Teachers = res.data;
      // this.dataSource2 = res.data;
      this.teachersLength = res.data.length;
      console.log('Length', this.teachersLength)
      this.dataSource2.paginator = this.paginator2;
      console.log(this.Teachers.length)
    })
  }


  getStudents(id?: any, pageSize?: any, search?: any) {
    this.http.getStudentbyClass(this.school._id, 2000, id).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<Data>(res.data);
      console.log('DataSource', this.dataSource)
      this.Students = res.data;
      console.log(this.paginator)
      this.dataSource.paginator = this.paginator;
    })
  }

  updateStudents(classObj: any) {
    this.dataSource = new MatTableDataSource<Data>();
    this.dataSource.paginator = this.paginator;
    this.pageSize = 1;
    console.log(classObj)
    this.getStudents(classObj.classId)
  }
  onPaginateChange(classObj: any, event: any) {
    console.log(this.paginator)
    console.log(this.dataSource.paginator)
  }
  applyFilter(search: any) {
    console.log(search)
    if (search === '') {

      this.searchTableisEnabled = false;
      this.http.getStudentbySearch(this.route.snapshot.paramMap.get('id'), search).subscribe((res: any) => {
        console.log(res.data)
        this.dataSource = new MatTableDataSource<Data>(res.data);
        //console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;

      })
    } else {
      this.searchTableisEnabled = true;
      this.http.getStudentbySearch(this.route.snapshot.paramMap.get('id'), search).subscribe((res: any) => {
        console.log(res.data)
        this.dataSource = new MatTableDataSource<Data>(res.data);
        //console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;

      })
    }


  }

  applyFilter2(search: any) {
    console.log(search)
    if (search === '') {
      this.searchTableisEnabled2 = false;
      this.http.getUsersbySearch(this.route.snapshot.paramMap.get('id'), search).subscribe((res: any) => {
        this.dataSource2 = new MatTableDataSource<Data>(res.data);
        console.log('dataSource', this.dataSource2)
        this.dataSource.paginator = this.paginator2;

      })
    } else {
      this.searchTableisEnabled2 = true;
      this.http.getUsersbySearch(this.route.snapshot.paramMap.get('id'), search).subscribe((res: any) => {
        this.dataSource2 = new MatTableDataSource<Data>(res.data);
        console.log('dataSource', this.dataSource2)
        this.dataSource.paginator = this.paginator2;

      })
    }

  }

  getInstitutions() {
    this.http.getInstitutions().subscribe((res: any) => {
      this.institutions = res.data;
      console.log(this.institutions)
    })
  }

  update() {
    console.log(this.Form.value)
    let data = {
      SchoolContactNumber: this.Form.value.Contact_Number,
      address: this.Form.value.Address,
      city: this.Form.value.City._id,
      country: this.Form.value.Country,
      sType: this.Form.value.InstituteType,
      pincode: this.Form.value.Pincode,
      schoolEmail: this.Form.value.Email,
      schoolName: this.Form.value.School_Name,
      state: this.Form.value.State._id,
      smsActivated: this.Form.value.smsActivated
    }
    console.log('Filled Data', data)
    this.http.register(data, this.route.snapshot.paramMap.get('id')).subscribe((res: any) => {
      console.log(res)
    })

    let map = {
      id: this.school.institute?._id ? this.school.institute._id : this.Form.value.Institute._id,
      schoolList: [this.route.snapshot.paramMap.get('id')]
    }

    console.log(map)
    console.log(this.school.institute)
    if (this.school.institute) {
      let data = {
        schoolId: this.route.snapshot.paramMap.get('id')
      }
      this.http.removeInstution(this.school.institute._id, data).subscribe((res: any) => {
        console.log(res)
        this.http.mapInstitution(map).subscribe((res: any) => {
          console.log('Map', res)
          this.dialog.open(ErrorDialogComponent, {
            data: {
              title: 'Updated',
              desc: 'School Updated Successfully'
            }
          })
        })
      })
    } else {
      console.log('Here')
      this.http.mapInstitution(map).subscribe((res: any) => {
        console.log('Map', res)
        this.dialog.open(ErrorDialogComponent, {
          data: {
            title: 'Updated',
            desc: 'School Updated Successfully'
          }
        })
      })
    }



  }


  getCountries() {
    this.http.getCountry().subscribe((res: any) => {
      this.countries = res.data;
      console.log(this.countries)
    })
  }
  getStates() {
    this.http.getStates().subscribe((res: any) => {
      this.states = res.data;
      console.log(this.states)
    })
  }

  getCities() {
    let state = this.Form.value.State._id;

    this.http.getCities().subscribe((res: any) => {
      this.cities = res.data.filter((city: any) => {
        return city.state_id === state
      })
      console.log(this.cities)
    })

  }

  getStudentCount() {
    this.http.getStudentsCount(this.school._id).subscribe((res: any) => {
      this.totalStudentCount = res.data[0].totalBoys + res.data[0].totalGirls
    })
  }
}
