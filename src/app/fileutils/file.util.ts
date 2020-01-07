import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorCheckComponent } from "../error-check/error-check.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import * as moment from "moment";
@Injectable()
export class FileUtil {
  constructor(public dialog: MatDialog) {}
  dialogRef: MatDialogRef<any>;
  isCSVFile(file) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr, tokenDelimeter) {
    let headers = csvRecordsArr[0].split(tokenDelimeter);
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  validateHeaders(origHeaders, fileHeaaders) {
    if (origHeaders.length != fileHeaaders.length) {
      return false;
    }

    var fileHeaderMatchFlag = true;
    for (let j = 0; j < origHeaders.length; j++) {
      if (origHeaders[j] != fileHeaaders[j]) {
        fileHeaderMatchFlag = false;
        break;
      }
    }
    return fileHeaderMatchFlag;
  }

  getDataRecordsArrayFromCSVFile(
    csvRecordsArray,
    headerLength,
    validateHeaderAndRecordLengthFlag,
    tokenDelimeter,
    displaydialogRef: MatDialogRef<any>
  ) {
    console.log("inside getDataRecordsArrayFromCSVFile");
    var dataArr = [];

    for (let i = 0; i < csvRecordsArray.length; i++) {
      console.log(csvRecordsArray[i]);
      let tmpdata = csvRecordsArray[i].replace(/"/g, '""');
      tmpdata = tmpdata.replace(/,/g, ",");
      tmpdata = tmpdata.replace(/'/g, "'");
      tmpdata = tmpdata.replace(",,", ", ,");
      console.log("tmpdata", tmpdata);
      if (tmpdata !== "") {
        // ignoring commas within double quotes
        let data = tmpdata.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        console.log("data str", data);
        if (validateHeaderAndRecordLengthFlag && data.length != headerLength) {
          if (data == "") {
            this.dialogRef = this.dialog.open(ErrorCheckComponent, {
              width: "30%",
              height: "28%",
              data: {
                error: 1,
                errorstring:
                  "Extra blank line is present at line number " +
                  i +
                  ", please remove it."
              }
            });
            this.dialogRef.afterClosed().subscribe(val => {
              displaydialogRef.close({ status: "Not ok" });
            });
            return null;
          } else {
            this.dialogRef = this.dialog.open(ErrorCheckComponent, {
              width: "30%",
              height: "28%",
              data: {
                error: 1,
                errorstring:
                  "Record at line number " +
                  i +
                  " contain " +
                  data.length +
                  " tokens, and is not matching with header length of :" +
                  headerLength
              }
            });
            this.dialogRef.afterClosed().subscribe(val => {
              displaydialogRef.close({ status: "Not ok" });
            });
            return null;
          }
        }

        let col = [];
        for (let j = 0; j < data.length; j++) {
          if (i != 0) {
            if (j === 1) {
              // Validations on Latitude
              if (typeof data[j] === "string") {
                let lat = parseFloat(data[j]); // converting string to decimal
                if (isNaN(lat)) {
                  // Decimal Format check
                  this.displayerror(
                    i + 1,
                    "latitude",
                    this.dialogRef,
                    displaydialogRef,
                    "Expected Decimal"
                  );
                  return null;
                }
                if (parseFloat("-90") < lat && lat < parseFloat("90")) {
                  console.log("lat is in b/w +90 and -90");
                } else {
                  this.displayerror(
                    i + 1,
                    "latitude",
                    this.dialogRef,
                    displaydialogRef,
                    "Has to be in between +90 and -90"
                  );
                  return null;
                }
              }
            }
            if (j === 2) {
              // Validations on Longitude
              if (typeof data[j] === "string") {
                let lon = parseFloat(data[j]); // converting string to decimal
                if (isNaN(lon)) {
                  // Decimal Format check
                  this.displayerror(
                    i + 1,
                    "longitude",
                    this.dialogRef,
                    displaydialogRef,
                    "Expected Decimal"
                  );
                  return null;
                }
                if (parseFloat("-180") < lon && lon < parseFloat("180")) {
                  console.log("lon is in b/w +90 and -90");
                } else {
                  this.displayerror(
                    i + 1,
                    "longitude",
                    this.dialogRef,
                    displaydialogRef,
                    "Has to be in between +180 and -180"
                  );
                  return null;
                }
              }
            }
            if (j === 3) {
              if (typeof data[j] === "string") {
                let radius = parseInt(data[j]);
                if (isNaN(radius)) {
                  // Decimal Format check
                  this.displayerror(
                    i + 1,
                    "radius",
                    this.dialogRef,
                    displaydialogRef,
                    "Expected Integer"
                  );
                  return null;
                }
              }
            }
            if (j === 4) {
              if (typeof data[j] !== "string") {
                let radius = parseInt(data[j]);
                // Decimal Format check
                this.displayerror(
                  i + 1,
                  "units",
                  this.dialogRef,
                  displaydialogRef,
                  "Expected String"
                );
                return null;
              }
            }
            if (j === 5) {
              console.log("start_date", data[j]);
              if (!moment(data[j], "MM/DD/YY", true).isValid()) {
                // Decimal Format check
                this.displayerror(
                  i + 1,
                  "Start date",
                  this.dialogRef,
                  displaydialogRef,
                  "Expected date formate MM/dd/yy"
                );
                return null;
              }
            }
            if (j === 6) {
              if (!moment(data[j], "MM/DD/YY", true).isValid()) {
                // Decimal Format check
                this.displayerror(
                  i + 1,
                  "End date",
                  this.dialogRef,
                  displaydialogRef,
                  "Expected date formate MM/dd/yy"
                );
                return null;
              }
            }
          }
          col.push(data[j]);
        }
        dataArr.push(col);
      }
    }
    return dataArr;
  }

  returnparsedcsvline(line: any) {
    var regexp = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    var arr = [String];
    var res;
    while ((res = regexp.exec(line)) !== null) {
      arr.push(res[0].replace(/(?:^")|(?:"$)/g, ""));
    }
    return arr;
  }

  displayerror(
    linenumber,
    columnname,
    dialogRef,
    displaydialogRef,
    errorstring
  ) {
    dialogRef = this.dialog.open(ErrorCheckComponent, {
      width: "30%",
      height: "28%",
      data: {
        error: 1,
        errorstring:
          "Column : " +
          columnname +
          ", Line number : " +
          linenumber +
          ", Error : " +
          errorstring
      }
    });
    dialogRef.afterClosed().subscribe(val => {
      displaydialogRef.close({ status: "Not ok" });
    });
  }
}
