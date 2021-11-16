import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validators } from "@angular/forms";
import { createPasswordStrengthValidator } from "../Validators/password-strength.validator";

@Directive({
    selector: "[passwordStrength]",
    providers: [{ 
        provide: NG_VALIDATORS, 
        useExisting: PasswordStrengthDirective, 
        multi: true
    }]
})
export class PasswordStrengthDirective implements Validators{

    validate(control: AbstractControl): ValidationErrors | null {
        return createPasswordStrengthValidator()(control);
    }
}