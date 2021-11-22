import {Component, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms';
import {noop, of} from 'rxjs';


@Component({
  selector: 'file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"]
})
export class FileUploadComponent {

  @Input()
  requiredFileType:string;

  fileName:string = '';

  fileUploadedError = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: { target: { files: File[] } }) {

    const file:File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      this.fileUploadedError = false;

      this.http.post("/api/thumbnail-upload", formData)
        .pipe(
          catchError(error => {
            this.fileUploadedError = true;
            return of(error);
          })
        )
        .subscribe();
    }
  }

}
