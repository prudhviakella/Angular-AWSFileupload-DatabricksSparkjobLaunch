import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ShowexceptionComponent } from "../showexception/showexception.component";
@Component({
  selector: "app-checkstatus",
  templateUrl: "./checkstatus.component.html",
  styleUrls: ["./checkstatus.component.css"]
})
export class CheckstatusComponent implements OnInit {
  public status = "";
  public running = false;
  public failed = false;
  public success = false;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    console.log("Dialog input", data);

    if (data.result.status === "Running") {
      this.status = "Running";
      this.running = true;
    } else if (data.result.status === "Not Running") {
      if (data.result.error_code === 1) {
        this.status = "Failed";
        this.failed = true;
      } else if (data.result.error_code === 0) {
        this.status = "Success";
        this.success = true;
      }
    }
  }

  ngOnInit() {}

  onexceptionclick(exception) {
    this.dialogRef = this.dialog.open(ShowexceptionComponent, {
      width: "90%",
      height: "90%",
      data: {
        error: 1,
        errorstring: exception
      }
    });
  }
}
