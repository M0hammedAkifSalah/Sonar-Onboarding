import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { GeneralService } from 'src/app/general.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  Data:any;
  
  columnDefs: ColDef[] = [
    { headerName: 'Name',field: 'name', },
    { headerName: 'Gender',field: 'gender',
    
      cellStyle : (params => params.value  === 'Male' ? ({color:'black'})  : params.value  === 'Female' ?  {color:'black'} : {color:'red'} )    ,
      
    },
    { headerName: 'Parent Name',field: 'p_name',
    
  },
    { headerName: 'Parent Mobile',field: 'username',
    cellStyle: (params => params.value.toString().length == 10 ? { color: 'black' } : { color: 'red' } )},

    
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
    console.log(this.columnDefs)
    
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    console.log('data after changes is: ', event.data);
  }


  
    
}
