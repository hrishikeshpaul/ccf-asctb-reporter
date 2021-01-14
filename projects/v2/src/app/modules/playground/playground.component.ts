import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SheetState } from '../../store/sheet.state';
import { Observable } from 'rxjs';

import * as jexcel from "jexcel";
import { UpdatePlaygroundData } from '../../actions/sheet.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit, AfterViewInit {
  @ViewChild("spreadsheet") spreadsheet: ElementRef;
  
  @Select(SheetState.getParsedData) data$: Observable<string[][]>;

  spreadSheetData: Array<string[]>;
  table: any;
  prevTab = 0;

  constructor(public store: Store) { 
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.data$.subscribe(data => {
      if (data.length) {
        console.log(data.length, data[0].length)
        this.spreadSheetData = data;
        if (!this.table) {
          this.initTable(data, this.store);
        } else {
          this.table.destroy()
          this.initTable(data, this.store);
        }
      }
      
    })
  }

  generateColumns(len) {
    let columns = []
    for(let i = 0; i < len; i ++) {
      columns.push({
        type: 'text',
        width: 120
      })
    }
    return columns;
  }

  initTable(data: string[][], store: Store) {
    let that = this;
    this.table = jexcel(this.spreadsheet.nativeElement, {
      data: data,
      minDimensions: [50, 50],
      onchange: function() {
        that.spreadSheetData = data;
      },
      contextMenu: function(obj, x, y, e) {
        var items = [];

        if (y == null) {
            // Insert a new column
            if (obj.options.allowInsertColumn == true) {
                items.push({
                    title:obj.options.text.insertANewColumnBefore,
                    onclick:function() {
                        obj.insertColumn(1, parseInt(x), 1);
                    }
                });
            }

            if (obj.options.allowInsertColumn == true) {
                items.push({
                    title:obj.options.text.insertANewColumnAfter,
                    onclick:function() {
                        obj.insertColumn(1, parseInt(x), 0);
                    }
                });
            }

            // Delete a column
            if (obj.options.allowDeleteColumn == true) {
                items.push({
                    title:obj.options.text.deleteSelectedColumns,
                    onclick:function() {
                        obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
                    }
                });
            }

            // Rename column
            if (obj.options.allowRenameColumn == true) {
                items.push({
                    title:obj.options.text.renameThisColumn,
                    onclick:function() {
                        obj.setHeader(x);
                    }
                });
            }

            // Sorting
            if (obj.options.columnSorting == true) {
                // Line
                items.push({ type:'line' });

                items.push({
                    title:obj.options.text.orderAscending,
                    onclick:function() {
                        obj.orderBy(x, 0);
                    }
                });
                items.push({
                    title:obj.options.text.orderDescending,
                    onclick:function() {
                        obj.orderBy(x, 1);
                    }
                });
            }
        } else {
            // Insert new row
            if (obj.options.allowInsertRow == true) {
                items.push({
                    title:obj.options.text.insertANewRowBefore,
                    onclick:function() {
                        obj.insertRow(1, parseInt(y), 1);
                    }
                });

                items.push({
                    title:obj.options.text.insertANewRowAfter,
                    onclick:function() {
                        obj.insertRow(1, parseInt(y));
                    }
                });
            }

            if (obj.options.allowDeleteRow == true) {
                items.push({
                    title:obj.options.text.deleteSelectedRows,
                    onclick:function() {
                        obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                    }
                });
            }

            if (x) {
                if (obj.options.allowComments == true) {
                    items.push({ type:'line' });

                    var title = obj.records[y][x].getAttribute('title') || '';

                    items.push({
                        title: title ? obj.options.text.editComments : obj.options.text.addComments,
                        onclick:function() {
                            obj.setComments([ x, y ], prompt(obj.options.text.comments, title));
                        }
                    });

                    if (title) {
                        items.push({
                            title:obj.options.text.clearComments,
                            onclick:function() {
                                obj.setComments([ x, y ], '');
                            }
                        });
                    }
                }
            }
        }

        // Line
        items.push({ type:'line' });

        // Do not show copy and paste options
        /*items.push({
            title:obj.options.text.copy,
            shortcut:'Ctrl + C',
            onclick:function() {
                obj.copy(true);
            }
        });

        // Paste
        if (navigator && navigator.clipboard) {
            items.push({
                title:obj.options.text.paste,
                shortcut:'Ctrl + V',
                onclick:function() {
                    if (obj.selectedCell) {
                        navigator.clipboard.readText().then(function(text) {
                            if (text) {
                                jexcel.current.paste(obj.selectedCell[0], obj.selectedCell[1], text);
                            }
                        });
                    }
                }
            });
        }*/

        // Save
        if (obj.options.allowExport) {
            items.push({
                title: obj.options.text.saveAs,
                shortcut: 'Ctrl + S',
                onclick: function () {
                    obj.download(true);
                }
            });
        }

        // About
        if (obj.options.about) {
            items.push({
                title:obj.options.text.about,
                onclick:function() {
                    alert(obj.options.about);
                }
            });
        }

        return items;
    },
      columns: [...this.generateColumns(data[0].length)],
      style: {
        A1: 'width: 100px;'
      }
    });
  }


  addRow() {

  }

  tabChange(tab: MatTabChangeEvent) {
     if (this.prevTab === 1 && tab.index === 0) {
      this.store.dispatch(new UpdatePlaygroundData(this.spreadSheetData));
     }
      this.prevTab = tab.index
  }

}