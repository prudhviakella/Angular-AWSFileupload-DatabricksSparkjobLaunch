import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ErrorCheckComponent } from "../error-check/error-check.component";
import { Constants } from "./test.constants";
import { FileUtil } from "../../app/fileutils/file.util";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

@Component({
  selector: "app-displaycsv",
  templateUrl: "./displaycsv.component.html",
  styleUrls: ["./displaycsv.component.css"]
})
export class DisplaycsvComponent implements OnInit {
  public file: File;
  public reader: FileReader;
  csvRecords = [];
  public columns = [];
  public displayedColumns;
  public dataSource = [];
  public validheaders = [
    "location_id",
    "latitude",
    "longitude",
    "radius",
    "units",
    "start_date",
    "end_date"
  ];
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _fileUtil: FileUtil
  ) {
    this.file = this.data.file;
    console.log(this.file);
    var reader = new FileReader();
    reader.readAsText(this.file);
    reader.onload = data => {
      let csvData = reader.result;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

      var headerLength = -1;
      if (Constants.isHeaderPresentFlag) {
        let headersRow = this._fileUtil.getHeaderArray(
          csvRecordsArray,
          Constants.tokenDelimeter
        );
        headerLength = headersRow.length;
        //Header Validations.
        let errorfound = 0;
        let errorstring = "";
        for (let i = 0; i < this.validheaders.length; i++) {
          let found = 0;
          for (let j = 0; j < headersRow.length; j++) {
            if (headersRow[j] === this.validheaders[i]) {
              found = 1;
              break;
            }
          }
          if (found !== 1) {
            errorfound = 1;
            errorstring = errorstring + " " + this.validheaders[i];
          }
        }
        if (errorfound == 1) {
          let dialogReferror = this.dialog.open(ErrorCheckComponent, {
            width: "30%",
            height: "28%",
            data: {
              error: 1,
              errorstring: "Headers: " + errorstring + " not found"
            }
          });
          dialogReferror.afterClosed().subscribe(val => {
            this.dialogRef.close({ status: "Not Ok" });
          });
        } else {
          for (let i = 0; i < headersRow.length; i++) {
            this.columns.push({
              columnDef: headersRow[i].toLowerCase(),
              header: headersRow[i],
              cell: (element: any, index) => `${element.headersRow[index]}`
            });
          }
          this.displayedColumns = this.columns.map(c => c.columnDef);
        }

        this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headerLength,
          Constants.validateHeaderAndRecordLengthFlag,
          Constants.tokenDelimeter,
          this.dialogRef
        );
        // mapping header information with Table data
        for (let i = 0; i < this.csvRecords.length; i++) {
          if (i != 0) {
            let tmp = this.csvRecords[i];
            let tmpjson = {};
            for (let j = 0; j < tmp.length; j++) {
              tmpjson[this.columns[j].columnDef] = tmp[j];
            }
            this.dataSource.push(tmpjson);
          }
        }
        console.log("datasource finally", this.dataSource);
      }
    };
  }

  ngOnInit() {}

  closeModal(status): void {
    this.dialogRef.close({ status: status });
  }
}
