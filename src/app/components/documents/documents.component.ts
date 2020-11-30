import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { DataFirestoreService } from "../../services/data.firestore.service";
import { SecurityService } from "../../services/security.service";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;

  display: boolean = false;
  isLoading: boolean = true;
  workSpaceId: string; 
  workSpace: any;
  linkUrl: boolean =  false;
  progress: boolean = false;
  supportMaterial: any = {};
  currentUser: any;
  supportMaterialDocs: any = [];
  file: any;

  constructor(
    public securityService: SecurityService, 
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseData: DataFirestoreService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.securityService.getCurrentUser();
    this.workSpaceId = this.route.snapshot.paramMap.get("id");
    if(this.workSpaceId) {
      this.onFindSupportMaterial();
      this.onFindWorkSpace();
    }
  }

  onFindWorkSpace() {
    console.log('[HomeComponent][onFindworkSpace]');
    this.data.findById('/workspace/index', this.workSpaceId).subscribe((res) => {
      this.workSpace = res.objs;
      this.linkUrl = this.workSpace._regulation_link;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
    });
  }

  onFindSupportMaterial() {
    this.data.findByParams('/support-material', this.workSpaceId).subscribe(res => {
      this.supportMaterialDocs = res.objs.docs;
      console.log(this.supportMaterialDocs)
    }, error => {
      console.log(error);
    });
  }

  validateFileSize(event: any, maxFileSize: number) {
    console.log("validateFileSize", event);
    if (event.files[0].size > maxFileSize) {
      //toast
      console.log("Archivo muy grande");
    }
  }

  onCreateSupportMaterial() {
    if (this.fileInput && this.fileInput?.files.length == 0) {
      return;
    }

    const path = `material/${new Date().getTime()}`;
    this.firebaseData.uploadFile(path, this.fileInput.files[0]).then(result => {
      result.ref.getDownloadURL().then(mediaURL => {
        this.fileInput.clear();

        console.log('----------')
        console.log(mediaURL);

        this.supportMaterial.link = mediaURL;
        this.supportMaterial.creator= this.currentUser._id;
        this.supportMaterial.creator_name = this.currentUser._first_name;
        this.supportMaterial.space = this.workSpaceId;

        this.data.insertOne('/support-material', this.supportMaterial).subscribe(res => {
          let materialDoc = res['objs'];
          this.supportMaterialDocs.push(materialDoc);
        }, error => {
          console.log(error);
        });
        this.progress = false;
      });
      }, error => {
        //toast
        console.log(error);
      }
    );
    this.showDialog();
    this.progress = false;
  }

  showDialog() {
    this.display = !this.display;
  }

  onUpload(event: any) {
    this.progress = true;
    console.log("[uploadFile][onUpload]");
    this.file = event.files[0];
  }
}
