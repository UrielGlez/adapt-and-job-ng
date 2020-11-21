import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(    
    private data: DataService,
  ) { }

  ngOnInit(): void {
    
  }

  onFindUsers() {
    console.log('[userListComponent][onFind]');

    this.data.find('/users/index/5fa9e3de3efed73f01031187').subscribe(res => {
      console.log(res);
    }, (e) => {
      console.log(e);
    });
  }

  

}
