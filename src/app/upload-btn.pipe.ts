import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uploadBtn'
})
export class UploadBtnPipe implements PipeTransform {

  transform(value: any[],filter:Object,): any {
    if (!value || !filter) {
      return value;
  }
  // filter items array, items which match and return true will be
  // kept, false will be filtered out
  //return value.filter((ele:any) => ele.value.indexOf(filter.value) !== -1);
    
  }

}
