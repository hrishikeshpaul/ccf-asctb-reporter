import { Injectable } from '@angular/core';
import { Legend } from '../../models/legend.model';
@Injectable({
  providedIn: 'root'
})
export class LegendService {

  constructor() { }


  makeLegendData(treeData, bimodalData):Array<Legend>{
    let legends: Array<Legend>;
    let addedBM:boolean = false;
    let addedCT:boolean = false;
    for (const i in treeData) {
      if (treeData[i].type=='AS'){
          legends.push({ name :'Anatomical Structures',
                  color : '#E41A1C', style:''});
          break
      }
    }
    for (const i in bimodalData) {
      if (!addedBM && bimodalData[i].type=='BM'){
        legends.push({ name :'Biomarkers',
        color : '#4DAF4A', style:''});
        addedBM=true;
      }
      if (!addedCT && bimodalData[i].type=='BM'){
        legends.push({ name :'Cell Types',
        color:'#377EB8', style:''});
        addedCT=true;
      }
      
    } 
    return legends;
  }
}
