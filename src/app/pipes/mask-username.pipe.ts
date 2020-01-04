import { Pipe, PipeTransform } from '@angular/core';
import { repeat } from 'rxjs/operators';

@Pipe({
  name: 'maskUsername'
})
export class MaskUsernamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
   
    if (value.length>2){ 
      let asterisque="*";
      value=value[0]+asterisque.repeat(value.length-2)+value[value.length-2];
    }
    return value;
  }

}
