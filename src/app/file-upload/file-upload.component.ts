import {Component, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {
  AbstractControl, 
  ControlValueAccessor, 
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, 
  ValidationErrors, 
  Validator } from '@angular/forms';
import {of} from 'rxjs';


@Component({
  selector: 'file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor, Validator {

  @Input()
  requiredFileType:string;

  fileName:string = '';

  fileUploadedError = false;

  fileUploadedSuccess = false;

  uploadProgress: number;

  onChange = (fileName: string) => {};

  onTouched = () => {}

  onValidatorChange = () => {};

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
            this.fileUploadedSuccess = true;
            this.onChange(this.fileName);
            this.onValidatorChange();
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

  registerOnValidatorChange(onValidatorChange: () => void): void {
    this.onValidatorChange = onValidatorChange;
  }

  validate(control: AbstractControl): ValidationErrors | null {

    if (this.fileUploadedSuccess) {
      return null;
    }

    let errors: any = {
      requiredFileType: this.requiredFileType
    }

    if (this.fileUploadedError) {
      errors.uploadFailed = true;
    }

    return errors;

  }
}
