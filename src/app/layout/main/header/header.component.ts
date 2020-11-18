import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  awaitingNotifications: any[] = [];

  showNotificacions: boolean = false;
  showUserInfo: boolean = false;
  currentUser: any={};

  style = "transform: translate3d(-135px, 32px, 0px)";

  constructor(
    //public securityService: SecurityService, 
    //public data: DataService, 
    private router: Router
  ) {}

  async ngOnInit() {
    //this.currentUser = await this.securityService.getCurrentUser();
  }

  onLogout() {
    alert('LOGOUT');
    /*this.securityService.logout().subscribe(() =>{
      this.router.navigate(['/login']);
    });*/
  }

}
