import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { MatDialog } from "@angular/material";
import { DialogComponent } from "../upload/dialog/dialog.component";
import { UploadService } from "../upload/upload.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-submit-request",
  templateUrl: "./submit-request.component.html",
  styleUrls: ["./submit-request.component.css"]
})
export class SubmitRequestComponent implements OnInit {
  private requests: Array<any> = [];
  requestform: FormGroup;
  maxDate = new Date();
  Filesexcelinfo = [];
  filecount = 0;
  submitcheck: boolean = false;
  public loading = false;
  showaftersubmit = false;
  response_jojpayload = {};
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public uploadService: UploadService
  ) {}
  ngOnInit() {
    this.requestform = this.formBuilder.group({
      SFID: ["", [Validators.required]],
      CID: ["", [Validators.required]],
      startdate: ["", [Validators.required]],
      enddate: ["", [Validators.required]],
      totalvisits: ["", [Validators.required]],
      operator: ["", [Validators.required]],
      Name: ["", [Validators.required]]
    });
  }

  get f() {
    return this.requestform.controls;
  }
  onSubmit() {
    var object: any = {};
    if (this.requestform.invalid) {
      return;
    }
    this.loading = true;
    object = this.requestform.value;
    object["files"] = this.Filesexcelinfo;
    this.uploadService
      .submitmaincall(object)
      .pipe(first())
      .subscribe(
        result => {
          console.log(result);
          this.response_jojpayload = result;
          this.loading = false;
          this.showaftersubmit = true;
          this.submitcheck = false;
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }
  public openUploadDialog() {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: "50%",
      height: "50%"
    });

    dialogRef.afterClosed().subscribe(val => {
      if (val.size != 0) {
        for (let key in val) {
          if (key.includes("_Fileneeded")) {
            this.Filesexcelinfo.push({
              name: val[key].name,
              path: val[key].path
            });
          }
        }
        this.submitcheck = true;
      } else {
        //disable submit button
        this.submitcheck = false;
      }
    });
  }
  onDeletecsv(file, index) {
    console.log(file);
    this.uploadService
      .deletefile(file)
      .pipe(first())
      .subscribe(
        result => {
          this.Filesexcelinfo.splice(index, 1);
          if (this.Filesexcelinfo.length === 0) {
            this.submitcheck = false;
          }
        },
        err => {
          console.log(err);
        }
      );
  }
  newjob() {
    this.requestform.reset();
    this.showaftersubmit = false;
    this.Filesexcelinfo = [];
  }
}
