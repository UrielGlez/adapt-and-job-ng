import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  isLogin: Boolean = false;

  constructor(
    private data: DataService, 
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLogin():void {
    console.log('[LoginComponent][onLogin]');
    this.isLogin = true;

    this.securityService.login({
      email: this.email,
      password: this.password
    }).subscribe((res) => {
      this.isLogin = false;
      this.router.navigate(['/home']);
    }, (error) => {
        this.isLogin = false;
        console.log(error);
    });
    /*console.log('[LogintComponent][onLogin]');
    this.isLogin = true;
    const auth = {
      email: this.email,
      password: this.password
    }

    this.data.insertOne('/signin', auth).subscribe(res => {
      this.isLogin = false;
      console.log(res);
      this.router.navigate(['/home']);
    }, (e) => {
      this.isLogin = false;
      console.log(e);
    });*/
  }
}
