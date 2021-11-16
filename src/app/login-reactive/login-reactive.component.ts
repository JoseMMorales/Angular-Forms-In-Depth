import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { createPasswordStrengthValidator } from '../Validators/password-strength.validator';

@Component({
  selector: 'app-login-reactive',
  templateUrl: './login-reactive.component.html',
  styleUrls: ['./login-reactive.component.css']
})
export class LoginReactiveComponent implements OnInit {

  form = this.fb.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
      UpdateOn: 'blur'
    }],
    password: ['', [   
      Validators.required, 
      Validators.minLength(4),
      createPasswordStrengthValidator()
      ]
    ]
  })

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

}
