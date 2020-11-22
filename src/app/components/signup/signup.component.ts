import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';

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


  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    if (this.password !== this.passwordConfirm) {
      alert('Las contraseñas no coinciden');
    } else {
      this.securityService.signup(
        {
          firstName: this.firstName, 
          lastName: this.lastName, 
          email: this.email, 
          password: this.password
        }
      ).subscribe(() => {
        this.router.navigate(['/login']);
      }, (error) => {
        console.log(error);
      });
    }
  }

}
