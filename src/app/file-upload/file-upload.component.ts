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
export class FileUploadComponent implements ControlValueAccessor {

  @Input()
  requiredFileType:string;

  fileName:string = '';

  fileUploadedError = false;

  uploadProgress: number;

  onChange = (fileName: string) => {};

  onTouched = () => {}

  disable: boolean = false;

  constructor(private http: HttpClient) {}

  onClick(fileUpload: HTMLInputElement) {
    this.onTouched();
    fileUpload.click();
  }

  onFileSelected(event: { target: { files: File[] } }) {

    const file:File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append("thumbnail", file);

      this.fileUploadedError = false;

      this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          catchError(error => {
            this.fileUploadedError = true;
            return of(error);
          }),
          finalize(() => {
            this.uploadProgress = null;
          })
        )
        .subscribe(event => {

          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress= Math.round(100*(event.loaded / event.total));
          } else if (event.type == HttpEventType.Response) {
            this.onChange(this.fileName)
          }
        });
    }
  }

  writeValue(value: string) {
    this.fileName = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisable: boolean) {
    this.disable = isDisable;
  }
}
