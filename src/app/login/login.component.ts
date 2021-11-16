import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   // Default Object to add default value o loginForm 
   val = {
    email: "hello@gmail.com",
    password: "23456"
  }

  constructor() { }

  ngOnInit(): void {
  }

  login(loginForm: NgForm, submit: any) {
    console.log(loginForm.value, loginForm.valid)
    console.log(submit);

    console.log("val", this.val); //Printing val Object
  }

  onEmailChange(event: any) {
    console.log(event);
  }

}
