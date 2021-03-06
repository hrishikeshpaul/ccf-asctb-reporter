import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Select, Store } from '@ngxs/store';
import { UIState } from '../../store/ui.state';
import { Observable } from 'rxjs';
import { ToggleControlPane } from '../../actions/ui.actions';
import { Error } from '../../models/response.model';
import { SheetState } from '../../store/sheet.state';
import { Sheet, SheetConfig, CompareData } from '../../models/sheet.model';
import { TreeState } from '../../store/tree.state';
import { TNode } from '../../models/tree.model';
import { VegaService } from '../tree/vega.service';
import { UpdateVegaSpec } from '../../actions/tree.actions';
import { UpdateConfig, ToggleShowAllAS, FetchAllOrganData } from '../../actions/sheet.actions';
import { BimodalService } from '../tree/bimodal.service';
import { BMNode } from '../../models/bimodal.model';

@Component({
  selector: 'app-control-pane',
  templateUrl: './control-pane.component.html',
  styleUrls: ['./control-pane.component.scss']
})
export class ControlPaneComponent implements OnInit {
  @Input() error: Error;

  @Select(SheetState.getSheetConfig) config$: Observable<SheetConfig>;
  @Select(SheetState.getSheet) sheet$: Observable<Sheet>;
  @Select(TreeState.getVegaView) view$: Observable<any>;

  @Select(TreeState.getTreeData) td$: Observable<TNode[]>;
  @Select(TreeState.getBimodal) bm$: Observable<any>;
  @Select(SheetState.getCompareSheets) cs$: Observable<CompareData[]>;

  view: any;

  constructor(public store: Store, public bm: BimodalService, public vs: VegaService) {
  }

  ngOnInit(): void {
    this.view$.subscribe(data => {
      this.view = data;
    });


  }

  updateConfigInSheet(prop) {
    switch (prop.property) {
      case 'width': this.vs.makeBimodal(this.view.signal('as_width', prop.config.width)); break;
      case 'height': this.vs.makeBimodal(this.view.signal('as_height', prop.config.height)); break;
      case 'show-ontology': this.view.signal('show_ontology', prop.config.show_ontology).runAsync(); break;
      case 'bm-x': this.updateBimodal(prop.config); break;
      case 'bm-y': this.updateBimodal(prop.config); break;
      case 'show-as': this.showAllAS(); break;
    }
  }

  showAllAS() {
    this.store.dispatch(new ToggleShowAllAS()).subscribe(states => {
      const sheet = states.sheetState.sheet;
      this.store.dispatch(new FetchAllOrganData(sheet));
    });
  }

  updateBimodal(config: SheetConfig) {
    this.store.dispatch(new UpdateConfig(config)).subscribe(states => {
      const data = states.sheetState.data;
      const sheet = states.sheetState.sheet;
      const treeData = states.treeState.treeData;
      const bimodalConfig = states.treeState.bimodal.config;


      if (data.length) {
        try {
          this.bm.makeBimodalData(data, treeData, bimodalConfig, sheet, config);
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  togglePane() {
    this.store.dispatch(new ToggleControlPane());
  }

  sendMail() {
    const subject = `About the ASCT+B Reporter!`;
    const body = `Hi, thank you for wanting to contact us! This is an auto-generated body template. Below are a list of possible subjects, %0D%0A%0D%0A1. Issue/bug wit the Reporter%0D%0A%0D%0A2. Feature request for the reporter.%0D%0A%0D%0A3. General discussion about the Reporter.`;
    const mailText = `mailto:infoccf@indiana.edu?subject=${subject}&body=${body}`;
    window.location.href = mailText;
    // this.ga.eventEmitter( 'report', 'click',  'Report Problem' , 1);
  }
}
