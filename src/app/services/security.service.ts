import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Observer } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DataService } from './data.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SecurityService {

  jwt: any;
  pictureProfile: any;
  constructor(
    private http: HttpClient,
    private dataService: DataService
  ) {

    this.jwt = new JwtHelperService();
  }

  private userChanges = new EventEmitter<any>();
  public userChangePictureProfile = new EventEmitter<any>();
  private currentUser: any;

  login(credentials: any): Observable<any> {
    return new Observable((observer) => {
      this.http.post(environment.serverBaseURL + '/signin', credentials).subscribe(res => {
        if (!res) {
          observer.error();
        } else {
          if (res["user"] && res["token"]) {
            this.userChanges.emit(res["user"]);
            this.currentUser = res['user'];

            localStorage.setItem('tokenAdapt', res['token']);
          }
          observer.next(res);
        }
        observer.complete();

      }, error => {
        observer.error(error);
      });
    });
  }

  signup(obj): Observable<any> {
    return new Observable((observer) => {
      this.http.post(environment.serverBaseURL + '/signup', obj).subscribe(res => {
        if (!res) {
          observer.error();
        } else {
          observer.next(res);
        }
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  isTokenExpired() {
    return this.jwt.isTokenExpired(this.getToken());
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.currentUser = null;

      localStorage.removeItem('tokenAdapt');
      localStorage.removeItem('cookie');

      this.userChanges.emit();
      observer.next();
      observer.complete();
    });
  }

  getAccountId() {
    return localStorage.getItem('accountId');
  }

  getToken() {
    return localStorage.getItem('tokenAdapt');
  }

  getCookie() {
    return localStorage.getItem('cookie');
  }

  async getCurrentUser(): Promise<User> {
    if (this.currentUser) {
      return this.currentUser;
    }
    var obj = this.jwt.decodeToken(this.getToken());

    if (obj) {
      let res = await this.dataService.findByFilter('/users/index/filter', { email: obj.email }).toPromise();
      this.currentUser = res['data'][0] as User;
      return this.currentUser;
    } else {
      return null;
    }
  }

  getUserChangesEmitter() {
    return this.userChanges;
  }

  getUserChangePictureProfile() {
    this.pictureProfile = localStorage.getItem('profilePicture');
    return this.pictureProfile;
  }

  UserChangePictureProfile(picture) {
    localStorage.setItem('profilePicture', picture);
    return this.userChangePictureProfile.emit(picture);
  }

  getCurrentUserRoles() {

    if (this.currentUser) {
      return this.currentUser.role;
    }
 
    var obj = this.jwt.decodeToken(this.getToken());
    if (obj && obj.role) {
      return obj.role;
    } else {
      return [];
    }
  }

  hasPermisions(roles) {
    let currentRoles = this.getCurrentUserRoles();

    if (roles && currentRoles) {
      return roles.some((role, index, x) => {
        if (currentRoles.indexOf(role) > -1) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }

}