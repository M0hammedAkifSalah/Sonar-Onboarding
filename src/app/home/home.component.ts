import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { ErrorDialogComponent } from '../Components/error-dialog/error-dialog.component';
import { GeneralService } from '../general.service';
import { branch } from '../models/branch.model'
import { Class } from '../models/class.model'
import { HttpService } from '../services/http.service';
import { SectionComponent } from './dialogs/section/section.component';
import { SubjectComponent } from './dialogs/subject/subject.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  schoolObj: any;
  classesObj: any = [];
  Country: any = [];
  States: any;
  City: any;
  selectedState: any;
  selectedCountry: any;
  bselectedState: any;
  selectedCity: any;
  bselectedCity: any;
  step: any = 1;

  school: any = [];
  branch = new branch()
  class = new Class()
  branches: any = [];
  count: any = 0;
  @ViewChild('formdiv2') formdiv2: ElementRef;
  Form: FormGroup;
  branchForm: FormGroup;
  //NoofBranches:any;
  classes: any = [];
  selectedClass: any = {};
  selectedValue: any = 1;
  selectedSec: any = {};
  selectedBoard: any = {}
  selectedSyllabus: any = {}
  selectedSubject: any = {}
  numStudents = 1;
  noofclasses: any = [];
  profile_pic: String;


  schoolId: any;

  selectSubjectBtn: boolean = true
  dselectSubjectBtn: boolean = true

  sectionObj: any
  customSections: any = [];
  existingSections: any = [];
  defaultSubjects: any = [];
  constructor(private route: Router, public data: GeneralService, private http: HttpService,
    private dialogRef: MatDialog, private http2: GeneralService) {
    this.getDefaultSubjects();
    if (data.currStep.value && Object.keys(this.classes).length < 1) {
      this.addclass()
    }

    if (!localStorage.getItem('token')) {
      route.navigate(['login'])
    }

    this.Form = new FormGroup({
      'School_Name': new FormControl(Validators.required, Validators.minLength(2)),
      'Email': new FormControl(),
      'Contact_Number': new FormControl(Validators.required, Validators.minLength(10)),
      'NoofBranches': new FormControl(1),
      'InstituteType': new FormControl('Private'),
      'Country': new FormControl(Validators.required),
      'State': new FormControl(Validators.required, Validators.minLength(2)),
      'City': new FormControl(Validators.required, Validators.minLength(2)),
      'Pincode': new FormControl(),
      'Address': new FormControl(),
    })
    this.branchForm = new FormGroup({
      'Branch_Name': new FormControl(),
      'Branch_Email': new FormControl(),
      'Branch_Contact': new FormControl(),
      'Branch_Country': new FormControl(),
      'Branch_State': new FormControl(),
      'Branch_City': new FormControl(),
      'Pincode': new FormControl(),
      'Branch_Address': new FormControl()
    })
    http.getSchool(localStorage.getItem('id')).subscribe((res) => {
      this.schoolObj = res;

      localStorage.setItem('schoolName', this.schoolObj.data[0].schoolName)
      localStorage.setItem('schoolImage', this.schoolObj.data[0].schoolImage)
      localStorage.setItem('schoolContactNumber', this.schoolObj.data[0].schoolContactNumber)
      data.schoolImage.next(this.schoolObj.data[0].schoolImage)

      data.schoolNumber.next(this.schoolObj.data[0].contact_number)

      if (this.schoolObj.data[0].branch.length >= 1) {
        if (data.currStep.value) {
          this.step = data.currStep.value;
        } else {
          this.step = 3;
          data.currStep.next(3)
          this.class = new Class();
          this.class.Board = []
          this.class.Class = []
          this.class.Subject = []
          this.class.Syllabus = []
          this.class.Section = [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'Other' },
          ]
          this.customSections ? this.class.Section = [...this.customSections, ...this.class.Section] : ''
          this.http.getClasses().subscribe((res: any) => {
            let data = res.data;

            for (let i = 0; i < data.length; i++) {
              this.class.Class.push(data[i])
            }

          })
          this.http.getBoards().subscribe((res: any) => {
            for (let i = 0; i < res.data.length; i++) {
              this.class.Board.push(res.data[i])
            }
          })
          this.http.getSyllabus().subscribe((res: any) => {
            for (let i = 0; i < res.data.length; i++) {
              this.class.Syllabus.push(res.data[i])
            }
          })
          this.http.getSubjects().subscribe((res: any) => {

            let data = res.data;
            this.defaultSubjects.forEach(async (x: any) => {
              let newArr = await data.filter((e: any, i: any) => {
                if (e.name == x.name) {
                  e.value = x.value
                }
              })
            })
            this.class.Subject = data
          })
          this.branches.push(this.branch)
          this.classes.push(this.class)
          // this.branch.BranchCountry = this.schoolObj.data[0].branch[0].branchCountryId;
          // this.branch.BranchState =   
          //this.getStates(this.schoolObj.data[0].branch[0].branchStateId);
          //
          /* this.branch.BranchCity = this.Form.value.City;
          this.branch.BranchPincode = this.Form.value.Pincode;
          this.branch.BranchAddress = this.Form.value.Address; */

        }



      }
      if (this.schoolObj.data[0].classList.length >= 1) {
        // route.navigate(['students'])

      }


      this.schoolObj.Contact_Number = JSON.stringify(this.schoolObj.data[0].contact_number);

      // this.Form.patchValue({})

      this.Form.patchValue({ Contact_Number: this.schoolObj.Contact_Number });
      this.Form.patchValue({ School_Name: this.schoolObj.data[0].schoolName });
      this.Form.patchValue({ Email: this.schoolObj.data[0].email })
      this.Form.patchValue({ Pincode: this.schoolObj.data[0].pincode })
      this.Form.patchValue({ Address: this.schoolObj.data[0].address })
      this.schoolObj.data[0].city ? this.Form.patchValue({ City: this.schoolObj.data[0].city }) : ''
      this.schoolObj.data[0].state ? this.Form.patchValue({ State: this.schoolObj.data[0].state }) : ''
      //this.schoolObj.data[0].country ? this.Form.patchValue({ Country: this.school.data[0].country}) : ''

      // Branch AutoFill
      if (this.schoolObj.data[0].branch) {
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Name: this.schoolObj.data[0].name }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Email: this.schoolObj.data[0].branch[0].email }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Contact: this.schoolObj.data[0].branch[0].contact }) : ''
        //  this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Country: this.schoolObj.data[0].branch[0].country._id }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_State: this.schoolObj.data[0].branch[0].state._id }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_City: this.schoolObj.data[0].branch[0].city._id }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Address: this.schoolObj.data[0].branch[0].address }) : ''
      }

      // this.schoolObj.data[0].city this.branchForm.patchValue()

      this.selectedState = this.schoolObj.data[0].state
      this.bselectedState = this.schoolObj.data[0].branchStateId

      this.selectedCity = this.schoolObj.data[0].city
      this.bselectedCity = this.schoolObj.data[0].branch.city
      //this.getCities();

      this.selectedState.state_name = this.schoolObj.data[0].state.state_name


      //this.Form.patchValue({Email:this.schoolObj.data[0].})
    })

    if (data.currStep) {
      this.step = data.currStep
    }


    if (this.data.currStep.value == 2) {
      this.branches.push(this.branch)
      this.http.getSchool(localStorage.getItem('id')).subscribe((res: any) => {
        this.schoolObj = res;
        if (this.schoolObj.data[0].branch[0]) {


          this.branchForm.patchValue({ Branch_Name: this.schoolObj.data[0].branch[0].name });
          this.branchForm.patchValue({ Branch_Email: this.schoolObj.data[0].branch[0].email });
          this.branchForm.patchValue({ Branch_Contact: this.schoolObj.data[0].branch[0].contact });

        }
      })
    }
    //Get Country
    this.getCountry()
    this.getStates()







    this.class.Class = []
    this.class.Section = [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
      { name: 'Other' },
    ]

    this.class.Board = []
    this.class.Syllabus = []
    this.class.Subject = []

    //Default Step
    this.step1();
  }

  ngOnInit(): void {
    // this.schoolObj.data[0] ? this.Form.patchValue({ School_Name: this.schoolObj.data[0].schoolName }) : '' 
    this.getCountry()

  }

  getCountry() {
    this.http.getCountry().subscribe((res: any) => {
      this.Country = res.data;

    })
  }

  getStates(stateId?: any) {
    this.http.getStates().subscribe((res: any) => {
      this.States = res.data

    })

  }

  getCities(branch?: any) {

    this.http.getCities().subscribe((res: any) => {
      this.City = res.data
      let formValue = this.Form.value
      const b_cities = this.City.filter((item: any) => {
        if (item.state_id === formValue.State._id) {
          return item.state_id
        }
      })

      this.City = b_cities;

    })
  }


  citySelected() {
    let Form = this.Form.value
    this.selectedCity = this.Form.value.City;
    this.bselectedCity = this.branchForm.value.Branch_City
  }

  getExistingSections() {
    this.http.getSection(localStorage.getItem('id')).subscribe((res: any) => {
      let existingSections = res.data

      this.existingSections = []
      existingSections.map((item: any) => {

        this.existingSections.push({ name: item.name })
      })
      this.existingSections ? this.class.Section = [...this.existingSections, ...this.class.Section] : ''

    })
  }

  onsubmit1() {


    let formStep1 = this.Form.value
    this.school = formStep1;


    let step1Data = {
      contact_number: this.school.Contact_Number,
      address: this.school.Address,
      city: this.school.City._id,
      country: this.school.Country[0]._id,
      institutionTypeId: this.school.InstituteType,
      pincode: this.school.Pincode,
      email: this.school.Email,
      schoolName: this.school.School_Name,
      state: this.Form.value.State._id,
      schoolImage: this.profile_pic ? this.profile_pic : this.schoolObj.data[0].schoolImage
    }


    this.profile_pic ? this.data.schoolImage.next(this.profile_pic) : ''

    this.school.Contact_Number ? this.data.schoolNumber.next(this.school.Contact_Number) : ''


    //  this.classes.push(this.class)


    //this.noofclasses.push(this.class)

    //  let currForm = this.Form.value;
    //  this.school = currForm


    if (this.Form.valid && this.school.Contact_Number !== '') {

      this.http.register(step1Data, localStorage.getItem('id')).subscribe((res: any) => {
        this.schoolId = res.data.schoolId

        if (this.branches.length < 1) {
          this.branches.push(this.branch)
        }
        if (this.schoolObj.data[0].branch[0]) {




          this.branchForm.patchValue({ Branch_Name: this.schoolObj.data[0].branch[0].name });
          this.branchForm.patchValue({ Branch_Email: this.schoolObj.data[0].branch[0].email });
          this.branchForm.patchValue({ Branch_Contact: this.schoolObj.data[0].branch[0].contact });

        }
        this.step = 2
        this.data.currStep.next(2)
      }, (err: any) => {

        this.errorDialog(err.error.message)
      })
    } else {
      this.errorDialog('Please Fill All Details')
    }

    // To Duplicate Branches based on No. of Branches
    /*     for (let i = 1; i < currForm.NoofBranches; i++) {
          this.branch = new branch()
          this.branches.push(this.branch)
        } */

    //this.step = 2
    //this.data.currStep.next(2)

    // this.branches.push(this.branch)

    /*  this.branch.BranchCountry = this.Form.value.Country;
     this.branch.BranchState = this.Form.value.State;
     this.branch.BranchCity = this.Form.value.City;
     this.branch.BranchPincode = this.Form.value.Pincode;
     this.branch.BranchAddress = this.Form.value.Address; */




  }

  errorDialog(data?: any): void {
    const dialogRef = this.dialogRef.open(ErrorDialogComponent, {
      width: '450px',
      height: '250px',
      data: { title: 'Error', desc: data },
      panelClass: 'custom-modalbox'
    });
  }


  branchSubmit() {
    // this.class = new Class();
    this.class.Board = []
    this.class.Class = []
    this.class.Subject = []
    this.class.Syllabus = []
    this.class.Section = [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
      { name: 'Other' },
    ]
    this.http.getClasses().subscribe((res: any) => {
      let data = res.data;

      for (let i = 0; i < data.length; i++) {
        this.class.Class.push(data[i])
      }

    })
    this.http.getBoards().subscribe((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.class.Board.push(res.data[i])
      }
    })
    this.http.getSyllabus().subscribe((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.class.Syllabus.push(res.data[i])
      }
    })
    this.http.getSubjects().subscribe((res: any) => {

      let data = res.data;
      // let finalArr = []
      this.defaultSubjects.forEach((x: any) => {
        let newArr = data.filter((e: any, i: any) => {
          if (e.name == x.name) {
            e.value = x.name
          }
        })
      })
      // 
      // finalArr = [...data, ...this.defaultSubjects]
      // this.defaultSubjects = finalArr
      // 
      this.class.Subject = data
      // finalArr.forEach((e) => {
      //   this.class.Subject.push(e)
      // })
      // data.map((item: any) => {
      //   this.class.Subject.push(item)
      // })
      // this.classes.push(this.class)
    })

    this.step = 3
    this.data.currStep.next(3)
    // MODIFIED FOR MFERD 
    this.step4();

    let data = this.branches
    this.school['Branch'] = data[0];


    let regData: any;


    let submitData: any;
    submitData = {
      "schoolId": this.schoolObj.data[0]._id,
      "name": this.branchForm.value.Branch_Name,
      "email": this.branchForm.value.Branch_Email,
      'contact': this.branchForm.value.Branch_Contact,
      "city": this.selectedCity._id,
      "country": this.Form.value.Country[0]._id,
      "state": this.selectedState._id,
      "pincode": this.branchForm.value.Pincode,
      "address": this.branchForm.value.Branch_Address
    }

    console.log(submitData)

    /* if (this.school.Branch.password === this.school.Branch.confirmPassword) {
      regData.password = this.school.Branch.password;
    } */
    console.log(regData)

    /* this.http.register(regData, localStorage.getItem('id')).subscribe((res: any) => {
      this.schoolId = res.data.schoolId
      console.log(res)
     
    }) */
    if (!this.schoolObj.data[0].branch[0]) {
      this.http.createBranch(submitData).subscribe((res: any) => {
        console.log(res)
      })
    } else {
      let id = this.schoolObj.data[0].branch[0]._id;
      this.http.updateBranch(id, submitData).subscribe((res: any) => {
        console.log(res)
      })
    }


  }

  addclass() {
    this.selectSubjectBtn = false
    this.count = this.count + 1;
    this.class = new Class();
    this.class.Class = []
    this.class.Subject = []
    this.class.Syllabus = []

    this.http.getSubjects().subscribe((res: any) => {
      console.log(res.data)
      let data = res.data;
      // I have 2 things
      // 1. All new Subjects
      console.log('New Subject', data)
      // 2. Default Subjects
      console.log('Default Subjects', this.defaultSubjects)
      // I need to Remove default Subs from New Subjects and Assign that Array to class.Subject
      this.defaultSubjects.forEach((x: any) => {
        let newArr = data.filter((e: any, i: any) => {
          if (e.name == x.name) {
            e.value = x.value
          }
        })
      })
      this.class.Subject = data;
      this.selectSubjectBtn = true
      console.log('Select Sub Btn', this.selectSubjectBtn)
    })
    this.http.getClasses().subscribe((res: any) => {
      let data = res.data;
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        this.class.Class.push(data[i])
      }
    })



    this.class.Section = [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
      { name: 'Other' },
    ]
    this.customSections ? this.class.Section = [...this.customSections, ...this.class.Section] : ''
    this.class.Board = []
    this.http.getBoards().subscribe((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.class.Board.push(res.data[i])
      }
    })
    this.http.getSyllabus().subscribe((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.class.Syllabus.push(res.data[i])
      }
    })
    console.log(this.class.Board)
    this.classes.push(this.class)
    console.log(this.classes)
  }

  changestep(step: any) {
    this.step = step;

  }

  submitClasses() {
    let s_id = localStorage.getItem('id')
    console.log(this.classes);
    let data = {

      Class: this.selectedClass,
      Section: this.selectedSec,
      Board: this.selectedBoard,
      Syllabus: this.selectedSyllabus,
      Subject: this.selectedSubject,

    }
    this.data.classes.next(data)
    console.log('Data', data.Class)

    //Adding Classes
    this.addClassesObj();








    // Adding Sections

    /* let sectionObj:any={}

    sectionObj = {
      School_id : s_id,
      data:[ {
        class_id:Object.values(this.selectedClass).map((e:any)=>{
        return e.toString()
      }), sectionList:[{
        name:Object.values(this.selectedSec).map((e:any) => {
        return e.toString()
      }), desc:null}]
    } ]
    } */




    //Adding Board

    let boardObj: any = {}
    boardObj = { "repository": [{ "id": `${s_id}`, "repository_type": "School", "mapDetails": [] }] }
    this.http.addBoard(this.selectedBoard[0], boardObj).subscribe((res: any) => {
      console.log(res)
      this.mapBoard()
      //alert('Board Added')
    }, (err: any) => {
      console.log(err)
      // alert(err.error.message)
      if (err.error.message === "Board already exist") {

        this.mapBoard()
      }

    })

    this.addSubject();
    //Adding Board

    let syllabusObj: any = {}
    syllabusObj = { "repository": [{ "id": `${s_id}`, "repository_type": "School", "mapDetails": [] }] }
    this.http.addSyllabus(this.selectedSyllabus[0], syllabusObj).subscribe((res: any) => {
      console.log(res)
      // alert('Classes Added')
    })


  }
  open() {
    this.dialogRef.open(LoginComponent)
  }

  addClassesObj() {

    this.classesObj.classList = []
    for (let i = 0; i < Object.keys(this.selectedClass).length; i++) {
      this.classesObj.classList.push(this.selectedClass[i])
    }
    this.data.classesObj.next(this.classesObj)
    console.log(this.classesObj)
    this.submitClassesObj();
  }
  submitClassesObj() {

    this.http.addClasses(localStorage.getItem('id'), {
      classList: Object.values(this.selectedClass).map((e: any) => {
        return e.toString()
      })
    }).subscribe((res: any) => {
      console.log(res)

      //  alert('Classes Added')
    })

    this.addsectionObj()
  }

  addsectionObj() {
    this.sectionObj = []
    this.sectionObj.name = []
    for (let i = 0; i < Object.keys(this.selectedSec).length; i++) {
      this.sectionObj.push({ name: this.selectedSec[i], desc: null })
    }

    //this.sectionObj.name.push(this.selectedSec)
    //this.sectionObj.name.push(this.selectedSec)
    let sectionObj: any;
    sectionObj = {
      School_id: localStorage.getItem('id'),
      data: [
        /*   {
            class_id: Object.values(this.selectedClass).map((e: any) => {
              return e
            }), sectionList: this.sectionObj
  
          }
   */

      ]


    }
    sectionObj.data = [];
    for (let j = 0; j < Object.keys(this.selectedClass).length; j++) {
      sectionObj.data.push({ class_id: this.selectedClass[j], sectionList: [this.sectionObj[j]] })
    }

    /* sectionObj.data.sectionList.push({name:this.selectedSec})
    console.log(sectionObj) */
    setTimeout(() => {
      this.submitSectionObj(sectionObj);
    }, 1000)

  }
  submitSectionObj(sectionObj: any) {
    this.http.addSection(sectionObj).subscribe((res: any) => {
      console.log(res)
      this.route.navigate(['students'])
      //
      //   alert('Sections Added')
    })
  }


  mapBoard() {
    let data: any;
    data = {
      boardId: this.selectedBoard[0],
      // mapDetails: [{classId: this.selectedClass[0]}],
      removeBoardId: null,
      syllabusId: this.selectedSyllabus[0]
    }
    // data.mapDetails=[];
    for (let i = 0; i < Object.keys(this.selectedClass).length; i++) {
      data.mapDetails = [({ classId: this.selectedClass[i] })]
      this.http.mapBoard(localStorage.getItem('id'), data).subscribe((res: any) => {

      })

    }


  }

  addSubject() {
    let data = {
      "repository": [{ "id": `${localStorage.getItem('id')}`, "repository_type": "School", "mapDetails": [] }]
    }


    for (let i = 0; i < Object.keys(this.selectedSubject).length; i++) {
      this.selectedSubject[i].forEach((element: any) => {
        this.http.addSubject(element._id, data).subscribe((res: any) => {


          this.mapSubject(i);
        }, (err: any) => {
          this.mapSubject(i);
        })

      });

    }


  }

  mapSubjects(index: any) {
    let data: any;
    data = {
      subjects: [],
      repository: [{ "id": localStorage.getItem('id'), "repository_type": "School", "mapDetails": [] }]
    }
    this.selectedSubject[index].forEach((element: any) => {
      data.subjects.push(element._id)
    })

    this.http.mapSubjects(data).subscribe((res: any) => {

    })
  }
  mapSubject(index: any) {


    let data: any = {
      boardId: this.selectedBoard[0],
      //classId: this.selectedClass[0],

      // newAddedSubjectId: [this.selectedSubject[0]],
      removeSubjectId: [],
      syllabuseId: this.selectedSyllabus[0]
    }

    data.classId = this.selectedClass[index]
    data.newAddedSubjectId = []

    /*  for (let i = 0; i < Object.keys(this.selectedSubject[index]).length; i++) {
       
       
     } */
    //let subIds:any = []
    this.selectedSubject[index].forEach((element: any) => {


      data.newAddedSubjectId.push(element._id)
    })




    this.http.mapSubject(localStorage.getItem('id'), data).subscribe((res: any) => {
      console.log(res)
    })
  }

  step2() {
    this.data.currStep.next(2)

    this.http.getSchool(localStorage.getItem('id')).subscribe((res: any) => {
      this.schoolObj = res;
      if (this.schoolObj.data[0].branch[0]) {

        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Name: this.schoolObj.data[0].branch[0].name }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Email: this.schoolObj.data[0].branch[0].email }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Contact: this.schoolObj.data[0].branch[0].contact }) : ''
        //  this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Country: this.schoolObj.data[0].branch[0].country.country_name }) : ''
        //this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_State:this.schoolObj.data[0].branch[0].state.state_name }) : ''
        //this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_City: this.schoolObj.data[0].branch[0].city.city_name }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Branch_Address: this.schoolObj.data[0].branch[0].address }) : ''
        this.schoolObj.data[0].branch[0] ? this.branchForm.patchValue({ Pincode: this.schoolObj.data[0].branch[0].pincode }) : ''
        /*  this.branchForm.patchValue({ Branch_Name: this.schoolObj.data[0].branch[0].name });
         this.branchForm.patchValue({ Branch_Email: this.schoolObj.data[0].branch[0].email });
         this.branchForm.patchValue({ Branch_Contact: this.schoolObj.data[0].branch[0].contact }); */

      }
    })

    if (Object.keys(this.branches).length == 0) {
      this.branches.push(this.branch)

      this.schoolObj.data[0].branch[0]
    }
  }
  step1() {
    if (this.data.currStep.value !== 1) {
      this.data.currStep.next(1);
      this.ngOnInit()
    }

  }
  step3() {
    if (this.data.currStep.value !== 3) {
      this.data.currStep.next(3)
      if (Object.keys(this.classes).length == 0) {
        this.addclass();
      }
    }
  }
  step4() {
    if (this.data.currStep.value !== 4) {
      this.data.currStep.next(4)
      this.route.navigate(['students'])
    }
  }

  sectionChanged(value: any, i: any) {
    if (value.target.value.includes('Other')) {
      this.openDialog(i)
    }
  }

  openDialog(i: any): void {
    const dialogRef = this.dialogRef.open(SectionComponent, {
      width: '450px',
      height: '340px',
      data: {},

    })
    dialogRef.afterClosed().subscribe((res: any) => {
      // received data from dialog-component
      if (res?.data?.name) {
        let secAlreadyExist = this.customSections.filter((item: any) => item.name.includes(res.data.name))
        if (secAlreadyExist.length == 0) {
          this.customSections.push({ name: res.data.name })
        }
        let alreadyExist = this.class.Section.filter((item: any) => item.name.includes(res.data.name));
        if (alreadyExist.length == 0) {
          this.class.Section = [
            { name: 'A' },
            { name: 'B' },
            { name: 'C' },
            { name: 'D' },
            { name: 'Other' },
          ]
          this.customSections ? this.class.Section = [...this.customSections, ...this.class.Section] : ''
          this.existingSections ? this.class.Section = [...this.existingSections, ...this.class.Section] : ''
        }
        this.selectedSec[i] = res.data.name
      }
    })
  }

  schoolUpload(event: any) {

    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.http.uploadFile(formData).subscribe((response: any) => {
      if (response.status === 'success') {
        this.profile_pic = response.message
      } else {
        console.log(response.status)
        return;
      }
    }, (err: any) => {
      if (err.status == 400) {
        console.log(err)
        return;
      } else {
        console.log(err)
        return;
      }
    });
  }

  selectSubjects = async (i?: number, subjects?: any, defaultSubs?: boolean) => {
    await this.openSubjectDialog(i, subjects, defaultSubs)
  }

  openSubjectDialog(i?: any, subs?: any, defSubs?: boolean): void {
    const dialogRef = this.dialogRef.open(SubjectComponent, {
      width: '450px',
      height: '450px',
      data: { subs, defSubs },
    })
    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (defSubs == true) {
        this.dselectSubjectBtn = false
        this.defaultSubjects = res.data
        if (i === 0) {
          let class1 = this.classes[0].Subject
          this.defaultSubjects.forEach((x: any) => {
            let newArr = class1.filter((e: any, i: any) => {
              if (e.name == x.name) {
                e.value = x.value
              }
            })
          })
        }
      } else {
        let selectedSubs = await res.data
        this.selectedSubject[i] = selectedSubs;
      }
    })
  }


  getDefaultSubjects() {
    this.http.getSubjects().subscribe((res: any) => {
      this.defaultSubjects = res.data
    })
  }

}


