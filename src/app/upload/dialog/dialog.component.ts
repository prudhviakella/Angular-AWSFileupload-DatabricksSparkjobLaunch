import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { UploadService } from "../upload.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { first } from "rxjs/operators";
import { FileUtil } from "../../../app/fileutils/file.util";
import { MatDialog } from "@angular/material";
import { ErrorCheckComponent } from "../../error-check/error-check.component";
import { DisplaycsvComponent } from "../../../app/displaycsv/displaycsv.component";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"]
})
export class DialogComponent {
  @ViewChild("file") file;
  public files: Set<File> = new Set();
  progress;
  canBeClosed = true;
  primaryButtonText = "Upload";
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  returnedfiles = [];
  clikedon_upload = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public uploadService: UploadService,
    private _fileUtil: FileUtil,
    public dialog: MatDialog
  ) {}
  addFiles() {
    this.file.nativeElement.click();
  }
  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        if (!this._fileUtil.isCSVFile(files[key])) {
          //alert(files[key].name + " is not a .csv file.");
          let dialogRef = this.dialog.open(ErrorCheckComponent, {
            width: "30%",
            height: "28%",
            data: {
              error: 1,
              errorstring: files[key].name + " is not a csv file."
            }
          });
        } else {
          
          let dialogRef = this.dialog.open(DisplaycsvComponent, {
            width: "95%",
            height: "75%",
            data: {
              file: files[key]
            }
          });
          dialogRef.afterClosed().subscribe(val => {
            if (val.status === "ok") {
              this.files.add(files[key]);
            } else {
              this.reset();
            }
          });
        }
      }
    }
  }
  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close(this.progress);
    }

    // set the component state to "uploading"
    this.uploading = true;
    this.clikedon_upload = true;
    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = "Finish";

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;
    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
  cancel() {
    this.files.clear();
    return this.dialogRef.close(this.files);
  }
  deletefile(file) {
    /*if (this.clikedon_upload) {
      //post for delete file and delete file from Array

      this.uploadService
        .deletefile("{}")
        .pipe(first())
        .subscribe(
          result => {
            //this.managerlist = result._source.managerlist;
          },
          err => {
            console.log(err);
          }
        );
    } else {*/
    this.files.delete(file);
    this.reset();
    //}
  }

  reset() {
    console.log(this.file.nativeElement.files);
    this.file.nativeElement.value = "";
    console.log(this.file.nativeElement.files);
  }
}
