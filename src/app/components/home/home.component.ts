import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { DataFirestoreService } from "../../services/data.firestore.service";
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  @ViewChild('fileInput') fileInput: FileUpload;
  navigationSubscription: any;

  isCreatorOfBoard: boolean = false;
  isLoadingUsers: boolean = false;
  displayInvite: boolean = false;
  isLoading: boolean = true;
  progress: boolean = false;
  linkUrl: boolean =  false;
  display: boolean = false;

  selectedUsers: any = [];
  workSpaceId: string; 
  users: any = [];
  workSpace: any;
  user: any;

  constructor(    
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseData: DataFirestoreService,
    private securityService: SecurityService,
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      this.initialiseInvites();
    });
  }

  initialiseInvites() {
    this.ngOnInit();
  }
 
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.user = await this.securityService.getCurrentUser();
    this.workSpaceId = this.route.snapshot.paramMap.get("id");
    if(this.workSpaceId != null && this.workSpaceId != 'null') {
      this.onFindWorkSpace();
      this.onFindUsers();
    }
  }

  onFindWorkSpace() {
    console.log('[HomeComponent][onFindworkSpace]');
    this.isLoading = true;
    this.data.findById('/workspace/index', this.workSpaceId).subscribe((res) => {
      this.workSpace = res.objs;

      if(this.workSpace._creator === this.user._id) {
        this.isCreatorOfBoard = true;
      } else {
        this.isCreatorOfBoard = false;
      }

      this.linkUrl = this.workSpace._regulation_link;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    });
  }

  onFindUsers() {
    this.isLoadingUsers = true;
    this.data.find('/users').subscribe(d => {
      this.users = d.objs.docs;
      this.isLoadingUsers = false;
    }, error => {
      this.isLoadingUsers = false;
      console.log(error);
      //this.toast.add({ severity: 'error', summary: 'Error', detail: error });
    });
  }

  showDialog() {
    this.display = true;
  }

  onUpload(event: any) {
    this.progress = true;
    console.log("[rgulationPDF][onUpload]");
    const file = event.files[0];
    const path = `regulation-docs/${new Date().getTime()}`;

    this.firebaseData.uploadFile(path, file).then(result => {
      result.ref.getDownloadURL().then(mediaURL => {
        this.fileInput.clear();
        this.workSpace._regulation_link = mediaURL;

        const auxWorkSpace = {
          regulation_link: mediaURL
        }

        this.data.updateOne('/workspace', this.workSpaceId, auxWorkSpace).subscribe((res) => {
          this.linkUrl = this.workSpace._regulation_link;
          //toast
        }, (error) => {
          //toast
          console.log(error);
        });
        this.progress = false;
      });
    }, error => {
      //toast
      console.log(error);
    }
    );
    this.progress = false;
  }

  showInviteDialog() {
    this.displayInvite = true;
  }

  onAddUser() {
    this.selectedUsers.forEach(u => {
      this.data.addToBoard(this.workSpaceId, u._id).subscribe(d => {
        //this.toast.add({ severity: 'info', summary: 'Agregdos', detail: "Usuarios agregados al tablero" });
        console.log(d);
        this.displayInvite = false;
      }, error => {
        this.displayInvite = false;
        console.log(error);
        //this.toast.add({ severity: 'error', summary: 'Error', detail: error.error.message });
      });
    });
  }

  validateFileSize(event: any, maxFileSize: number) {
    console.log("validateFileSize", event);
    if (event.files[0].size > maxFileSize) {
      console.log("Archivo muy grande");
    }
  }

}
