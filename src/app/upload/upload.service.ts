import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpHeaders
} from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { FileUtil } from "../../app/fileutils/file.util";
const url = "http://localhost:8000/upload";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor(private http: HttpClient) {}
  public upload(
    files: Set<File>
  ): { [key: string]: { progress: Observable<number> } } {
    var i = 0;
    // this will be the our resulting map
    const status: {
      [key: string]: {
        name: String;
        path: String;
        progress: Observable<number>;
      };
    } = {};

    files.forEach(file => {
      //this.i++;
      // create a new multipart-form for every file
      // check the extension of file

      const formData: FormData = new FormData();

      formData.append("file", file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest("POST", url, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      var returnresponse;
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round((100 * event.loaded) / event.total);
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          console.log(status);
          console.log("HTTPResponse:", event);
          returnresponse = event.body[i][1];
          status[file.name + "_Fileneeded"] = {
            name: returnresponse.name,
            path: returnresponse.path,
            progress: progress.asObservable()
          };
          //console.log(returnresponse);
          progress.complete();
          i++;
        }
      });
      // Save every progress-observable in a map of all observables
      status[file.name] = {
        name: "",
        path: "",
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

  deletefile(datafeed: any): Observable<any> {
    console.log("delete file input", datafeed);
    return this.http.post("http://localhost:8000/deletefile", datafeed).pipe(
      map(result => {
        console.log("result is ", result);
        return result;
      })
    );
  }
  submitmaincall(datafeed: any): Observable<any> {
    console.log("submitmaincall input", datafeed);
    return this.http.post("http://localhost:8000/maincall", datafeed).pipe(
      map(result => {
        console.log("main call is ", result);
        return result;
      })
    );
  }

  getallrequest(): Observable<any> {
    return this.http.get("http://localhost:8000/getrequest").pipe(
      map(result => {
        console.log("result is ", result);
        return result;
      })
    );
  }

  getalljobstatus(runid): Observable<any> {
    return this.http
      .post("http://localhost:8000/getjobstatus", {
        run_id: runid
      })
      .pipe(
        map(result => {
          console.log("result is ", result);
          return result;
        })
      );
  }
}
