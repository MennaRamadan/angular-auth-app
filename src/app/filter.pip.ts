import { PipeTransform, Pipe } from "@angular/core";

//here we specifiy the name of pipe
@Pipe({
    name: "filter",
    pure: false
})

export class FilterPipe implements PipeTransform{
    transform(value: any, filterString: string, propName: string): any{
        const resultArray = [];

        if(value.length === 0 || filterString === ''){
            return value;
        }
        for(const item of value){
            if(item[propName] === filterString){
                resultArray.push(item);
            }
        }
        return resultArray;
    }
}