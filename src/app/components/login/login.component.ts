import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  isLogin: Boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onLogin():void {
    alert('Hello world');
  }
}
