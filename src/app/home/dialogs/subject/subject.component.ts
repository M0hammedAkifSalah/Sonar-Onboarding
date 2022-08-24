import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox'

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  searchSubject: String;
  filteredSubjects: any;
  checked: boolean = false
  subjectsCount: number;
  constructor(public dialogRef: MatDialogRef<SubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('SUB POPUP', data)
    this.filteredSubjects = this.data.subs
    console.log(this.filteredSubjects)
  }

  ngOnInit(): void {
    console.log('this.data', this.data)
    this.subjectsCount = this.data.subs.length
  }
  add() {
    // this.dialogRef.close({ data: this.data })
    this.dialogRef.close({ data: this.filteredSubjects })
  }
  selectedValue() {
    console.log(this.data)
  }

  searchChange() {
    this.filteredSubjects = this.data.subs.filter((ele: any) => {
      return ele.name.toLowerCase().includes(this.searchSubject)
    })
    console.log(this.filteredSubjects)
  }
}
