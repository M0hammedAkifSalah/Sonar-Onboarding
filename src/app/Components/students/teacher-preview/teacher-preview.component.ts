import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { GeneralService } from 'src/app/general.service';

@Component({
  selector: 'app-teacher-preview',
  templateUrl: './teacher-preview.component.html',
  styleUrls: ['./teacher-preview.component.css']
})
export class TeacherPreviewComponent implements OnInit {
  Data: any;

  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', },
    {
      headerName: 'Mobile', field: 'mobile',
     cellStyle: (params => params.value.toString().length == 10 ? { color: 'black' } : { color: 'red' })
    },
    {
      headerName: 'Profile Type', field: 'profile_type_name',
     
    },
    {
      headerName: 'Gender', field: 'gender',

      cellStyle: (params => params.value === 'Male' ? ({ color: 'black' }) : params.value === 'Female' ? { color: 'black' } : { color: 'red' }),

    },




  ];
  public defaultColDef: ColDef = {

    editable: true,

  };
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private valid : GeneralService) { 
    this.Data = data
    console.log(this.Data);
    console.log(this.valid.previewValid)
  }

  ngOnInit(): void {
  }

}
