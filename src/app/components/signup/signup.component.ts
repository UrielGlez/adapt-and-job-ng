import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: String;
  firstName: String; 
  lastName: String;
  password: String;
  passwordConfirm: String;
  isValidating: Boolean = false;


  constructor() { }

  ngOnInit(): void {
  }

  onRegister(): void {
    alert('Hello world');
  }

}
