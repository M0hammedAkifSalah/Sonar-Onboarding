import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close()
  }
  redirect(){
    this.document.location.href = `https://web.growon.app/`
   
  }
}
