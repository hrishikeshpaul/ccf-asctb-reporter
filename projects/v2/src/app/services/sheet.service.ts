import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL, getAssetsURL, getInformation, PLAYGROUND } from './../static/url';


@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(private http: HttpClient) { }

  fetchSheetData(sheetId: string, gid: string) {
    return this.http.get(`${URL}/${sheetId}/${gid}`);
  }

  fetchDataFromAssets(dataVersion: string, currentSheet: any) {
    return this.http.get(getAssetsURL(dataVersion, currentSheet), { responseType: 'text' });
  }

  fetchBottomSheetData(id: string) {
    return this.http.get(getInformation(id));
  }

  fetchPlaygroundData(data?: string) {
    return this.http.get(`${URL}/playground`);
  }

  updatePlaygroundData(data: string[][]) {
    return this.http.post(`${URL}/playground`, {data});
  }
}
