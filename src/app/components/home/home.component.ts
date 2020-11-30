import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { DataFirestoreService } from "../../services/data.firestore.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  @ViewChild('fileInput') fileInput: FileUpload;
  navigationSubscription: any;

  display: boolean = false;
  isLoading: boolean;
  workSpaceId: string; 
  workSpace: any;
  progress: boolean = false;
  linkUrl: boolean =  false;

  constructor(    
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseData: DataFirestoreService
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

  ngOnInit(): void {
    this.workSpaceId = this.route.snapshot.paramMap.get("id");
    if(this.workSpaceId != null && this.workSpaceId != 'null') {
      this.onFindWorkSpace();
    }
  }

  onFindWorkSpace() {
    console.log('[HomeComponent][onFindworkSpace]');
    this.isLoading = true;
    this.data.findById('/workspace/index', this.workSpaceId).subscribe((res) => {
      this.workSpace = res.objs;
      this.linkUrl = this.workSpace._regulation_link;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
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

  validateFileSize(event: any, maxFileSize: number) {
    console.log("validateFileSize", event);
    if (event.files[0].size > maxFileSize) {
      console.log("Archivo muy grande");
    }
  }

}
