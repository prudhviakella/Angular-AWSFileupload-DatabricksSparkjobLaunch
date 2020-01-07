import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { UploadService } from "../upload/upload.service";
import { first } from "rxjs/operators";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { CheckstatusComponent } from "../checkstatus/checkstatus.component";
export interface Request {
  sfid: string;
  name: string;
  cid: Date;
  runid: String;
  number_in_job: String;
  errorcode: String;
  error: Number;
  s3inputfile: String;
  s3outputfile: String;
  createdAt: Date;
}

@Component({
  selector: "app-search-request",
  templateUrl: "./search-request.component.html",
  styleUrls: ["./search-request.component.css"]
})
export class SearchRequestComponent implements OnInit, AfterViewInit {
  public displayedColumns = [
    "sfid",
    "name",
    "cid",
    "runid",
    "createdAt",
    "checkstatus"
  ];
  public dataSource = new MatTableDataSource<Request>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public loading = false;
  constructor(public uploadService: UploadService, public dialog: MatDialog) {
    this.loading = true;
    this.uploadService
      .getallrequest()
      .pipe(first())
      .subscribe(
        result => {
          this.dataSource.data = result as Request[];
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }

  onclickme(element) {
    this.loading = true;
    this.uploadService
      .getalljobstatus(element.runid)
      .pipe(first())
      .subscribe(
        result => {
          console.log("getoutput", result);
          let notebook_result = {};
          if (result.notebook_output.result) {
            notebook_result = JSON.parse(result.notebook_output.result);
            notebook_result["status"] = "Not Running";
            console.log(notebook_result);
          } else {
            notebook_result = { status: "Running" };
          }
          this.loading = false;

          let dialogRef = this.dialog.open(CheckstatusComponent, {
            width: "40%",
            height: "55%",
            data: {
              element: element,
              result: notebook_result
            }
          });
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }
  ngOnInit() {}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
}
