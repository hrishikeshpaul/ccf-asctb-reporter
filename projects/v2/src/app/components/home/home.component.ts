import { Component, OnInit } from '@angular/core';
// import { SconfigService } from '../services/sconfig.service';
import { environment } from '../../../environments/environment';
import { SHEET_OPTIONS } from '../../static/config';
// import {GaService} from '../services/ga.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  window = window;
  screenWidth = document.getElementsByTagName('body')[0].clientWidth;
  dataVersion = 'latest';
  SHEET_OPTIONS = SHEET_OPTIONS;

  constructor() {
  }

  ngOnInit(): void {}

  openGithub(event?: Event) {
    window.open(
      'https://github.com/hubmapconsortium/ccf-asct-reporter',
      '_blank'
    );
      // if (event){
      //   this.ga.eventEmitter( 'home', 'click', 'Icon', 1);
      // }else{
      //   this.ga.eventEmitter( 'home', 'click', 'GitHub', 1);
      // }
    }


  openDocs() {
    window.open(
      'https://drive.google.com/file/d/1r8Br4t6zftyrRXbb-DnidzwS3t8FSCu4/view?usp=sharing',
      '_blank'
    );
    // this.ga.eventEmitter(  'home', 'click', 'Documentation', 1);
  }

  openData() {
    window.open(
      'https://docs.google.com/spreadsheets/d/1j_SLhFipRWUcRZrCDfNH15OWoiLf7cJks7NVppe3htI/edit#gid=1199090884',
      '_blank'
    );
    // this.ga.eventEmitter(  'home', 'click', 'Tables', 1);
  }

  onResize(e) {
    this.screenWidth = e.target.innerWidth;
  }
}
