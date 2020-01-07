import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";

import { SubmitRequestComponent } from "./submit-request/submit-request.component";
import { SearchRequestComponent } from "./search-request/search-request.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MainComponentComponent } from "./main-component/main-component.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material";
import { NgxLoadingModule } from "ngx-loading";
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressBarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule
} from "@angular/material";

import { DialogComponent } from "./upload/dialog/dialog.component";
import { UploadService } from "./upload/upload.service";
import { CheckstatusComponent } from "./checkstatus/checkstatus.component";
import { FileUtil } from "../app/fileutils/file.util";
import { ErrorCheckComponent } from "./error-check/error-check.component";
import { DisplaycsvComponent } from "./displaycsv/displaycsv.component";
import { ShowexceptionComponent } from "./showexception/showexception.component";
@NgModule({
  declarations: [
    AppComponent,
    SubmitRequestComponent,
    SearchRequestComponent,
    MainComponentComponent,
    DialogComponent,
    CheckstatusComponent,
    ErrorCheckComponent,
    DisplaycsvComponent,
    ShowexceptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [UploadService, FileUtil],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogComponent,
    CheckstatusComponent,
    ErrorCheckComponent,
    DisplaycsvComponent,
    ShowexceptionComponent
  ]
})
export class AppModule {}
