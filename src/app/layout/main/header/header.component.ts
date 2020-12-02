import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { SecurityService } from "../../../services/security.service";
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  display: boolean = false;
  currentUser: any = {};
  workSpace: any = {};

  workSpaces: any = [];
  
  title: string;
  description: string;

  constructor(
    public securityService: SecurityService, 
    public data: DataService, 
    private toast: MessageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.currentUser = await this.securityService.getCurrentUser();
    this.onFindWorkspace();
  }

  showDialog() {
    this.display = !this.display;
  }

  onFindWorkspace() {
    this.data.find('/workspace').subscribe(res => {
      this.workSpaces = res.objs.docs;
    }, error => {
      this.toast.add({ severity: 'error', summary: 'Error', detail: "No se pudieron cargar los espacios. Intentalo de nuevo." });
      console.log(error)
    });
  }

  onLogout() {
    this.securityService.logout().subscribe(() =>{
      this.router.navigate(['/login']);
    });
  }

  onCreateWorkSpace() {
    this.workSpace.creator = this.currentUser._id;
    this.data.insertOne('/workspace', this.workSpace).subscribe(res => {
      this.toast.add({ severity: 'success', summary: 'Éxito', detail: "Se ha creado correctamente el espacio." });
      let space = res['objs'];
      this.workSpaces.push(space);
    }, error => {
      this.toast.add({ severity: 'error', summary: 'Error', detail: "No se pudo crear el espacio. Intentalo de nuevo." });
      console.log(error);
    });

    this.showDialog();
  }

}
