import { Component, OnInit, EventEmitter, Output, Input, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SheetService } from '../services/sheet.service';
import { LoadingComponent } from '../loading/loading.component';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportService } from '../report/report.service';
import {GaService} from '../services/ga.service';
import { SconfigService } from '../services/sconfig.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  link: string;
  columnNumbers: string;
  formGroup: FormGroup;
  formSheets: FormArray;
  loadingDialog: any;

  @Input() sources;
  @Output() compareData = new EventEmitter<any>();

  constructor(
    private dialogRef: MatDialogRef<CompareComponent>,
    public sheet: SheetService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public report: ReportService,
    public fb: FormBuilder,
    public ga: GaService,
    public sc: SconfigService,
    @Inject(MAT_DIALOG_DATA) public dialogSources: any
  ) {

  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      sheets: this.fb.array([this.createCompareForm()])
    });

    this.formSheets = this.formGroup.get('sheets') as FormArray;

    // retain the previously uploaded sheet data sources
    if (this.dialogSources.sources.length > 0) {
      for (const source of this.dialogSources.sources) {
        this.formSheets.push(this.createCompareForm(source.link, source.color, source.title, source.description));
      }

      // remove the row that was insert on component creation
      this.removeCompareSheetRow(0);
    }
  }

  createCompareForm(link= '', color?: string, title= '', description= ''): FormGroup {
    if (!color) { color = this.getRandomColor(); }

    return this.fb.group({
      title: [title],
      description: [description],
      link: [link, Validators.compose([Validators.required, Validators.pattern(/\/([\w-_]{15,})\/(.*?gid=(\d+))?/)])],
      // columnNumbers: ['', Validators.compose([Validators.required, Validators.pattern(/^([0-9\s]+,)*([0-9\s]+){1}$/i)])],
      color: [color]
    });
  }


  public async getData(link?: string, columns?: string) {
    this.openLoading();
    const exportCompareData = [];
    const sources = [];

    try {
    for (const [idx, ddSheet] of this.formGroup.value.sheets.entries()) {
      sources.push({
        link: ddSheet.link,
        color: ddSheet.color,
        title: ddSheet.title === '' ? `Sheet ${idx + 1}` : ddSheet.title,
        description: ddSheet.description
      });

      const sheetID = this.checkLinkFormat(ddSheet.link).sheetID;
      const gid = this.checkLinkFormat(ddSheet.link).gid;


      const constructedURL = `${this.sc.SERVER_URL}/${sheetID}/${gid}`;
      // const constructedURL = `http://localhost:5000/${sheetID}/${gid}`;

      const csvData = await this.sheet.getDataFromURL(
          constructedURL, 11, {isNew: true, color: ddSheet.color}
        );

      exportCompareData.push({
          data: csvData.data,
          color: ddSheet.color,
          title: ddSheet.title === '' ? `Sheet ${idx + 1}` : ddSheet.title,
          description: ddSheet.description
        });
      const sheetTitle = ddSheet.title === '' ? `Sheet ${idx + 1}` : ddSheet.title;
      this.ga.eventEmitter('compare', 'input', `(${sheetTitle},${ddSheet.description} , ${ddSheet.link}, ${ddSheet.color})`, idx + 1);


      }
    this.openSnackBar('Derived Data sheet succesfully fetched.', 'Close', 'green');
    this.report.reportLog(
      `Compare sheet data successfully rendered`,
      'success',
      'msg'
    );
    this.dialogRef.close({ data: exportCompareData, sources });
      } catch (err) {
        console.log(this.sheet);
        this.openSnackBar(err.msg, 'Close', 'red');
        this.report.reportLog(
          `Compare data failed to rendered`,
          'error',
          'msg'
        );
      }
    this.loadingDialog.close();

  }

  addCompareSheetRow() {
    this.formSheets.push(this.createCompareForm());
  }

  removeCompareSheetRow(i: number) {
    this.formSheets.removeAt(i);
    this.ga.eventEmitter('compare', 'click', 'Delete Sheet' , i + 1);
  }

  get CSControls() {
    return this.formGroup.get('sheets') as FormArray;
  }

  checkLinkFormat(url: string) {
    const matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url);

    if (matches) {
      return {
        sheetID: matches[1],
        gid: matches[3],
      };
    }
  }

  openSnackBar(message, action, style) {
    this.snackBar.open(message, action, {
      duration: style === 'green' || style === 'warn' ? 3000 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`${style}-snackbar`],
    });
  }

  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      sheet: 'Derived Data Sheet'
    };
    this.loadingDialog = this.dialog.open(LoadingComponent, dialogConfig);
  }

  doesFormHaveError() {
    return this.formGroup.status !== 'VALID';
  }

  close() {
    this.dialogRef.close({data: []});
  }

  getRandomColor() {
    const letters = '3456789BC'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }
}