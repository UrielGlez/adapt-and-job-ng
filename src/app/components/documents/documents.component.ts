import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { DataFirestoreService } from "../../services/data.firestore.service";
import { SecurityService } from "../../services/security.service";
import { ConfirmationService, MessageService } from 'primeng/api';

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
  isCreatorOfMaterial: boolean = false;

  constructor(
    public securityService: SecurityService, 
    private data: DataService,
    private route: ActivatedRoute,
    private toast: MessageService,
    private firebaseData: DataFirestoreService,
    private confirmationService: ConfirmationService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.securityService.getCurrentUser();
    this.workSpaceId = this.route.snapshot.paramMap.get("id");
    if(this.workSpaceId != null && this.workSpaceId != 'null') {
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
      this.toast.add({ severity: 'error', summary: 'Error', detail: "No se pudo cargar el espacio. Intentalo de nuevo." });
      console.log(error);
      this.isLoading = false;
    });
  }

  onFindSupportMaterial() {
    this.data.findByParams('/support-material', this.workSpaceId).subscribe(res => {
      this.supportMaterialDocs = res.objs.docs;
      console.log(this.supportMaterialDocs);
    }, error => {
      this.toast.add({ severity: 'error', summary: 'Error', detail: "No se pudo cargar el material. Intentalo de nuevo." });
      console.log(error);
    });
  }

  validateFileSize(event: any, maxFileSize: number) {
    if (event.files[0].size > maxFileSize) {
      this.toast.add({ severity: 'info', summary: 'Archivo muy grande', detail: "Intenta con otro archivo." });
    }
  }

  confirm(materialId: string) {
    this.confirmationService.confirm({
      message: '¿Seguro que quieres eliminar este material?',
      accept: () => {
        this.onDeleteMaterial(materialId);
      }
    });
  }

  onDeleteMaterial(materialId: string) {
    this.data.deleteOne('/support-material', materialId).subscribe(res => {
      this.toast.add({ severity: 'info', summary: 'Material eliminado', detail: "El material ha sido eliminado correctamente." });
      this.supportMaterialDocs.splice(this.supportMaterialDocs.indexOf(this.supportMaterialDocs.find(m => m._id == materialId)), 1);
    }, err => {
      this.toast.add({ severity: 'error', summary: 'Error', detail: err.error.message });
    });
  }

  onCreateSupportMaterial() {
    if (this.fileInput && this.fileInput?.files.length == 0) {
      return;
    }

    const path = `material/${new Date().getTime()}`;
    this.firebaseData.uploadFile(path, this.fileInput.files[0]).then(result => {
      result.ref.getDownloadURL().then(mediaURL => {
        this.fileInput.clear();

        this.supportMaterial.link = mediaURL;
        this.supportMaterial.creator= this.currentUser._id;
        this.supportMaterial.creator_name = this.currentUser._first_name;
        this.supportMaterial.space = this.workSpaceId;

        this.data.insertOne('/support-material', this.supportMaterial).subscribe(res => {
          let materialDoc = res['objs'];
          this.toast.add({ severity: 'success', summary: 'Éxito', detail: "Tu material ha sido creado correctamente." });
          this.supportMaterialDocs.push(materialDoc);
        }, error => {
          this.toast.add({ severity: 'error', summary: 'Error', detail: "No se ha podido subir tu material. Intentalo de nuevo." });
          console.log(error);
        });
        this.progress = false;
      });
      }, error => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: "Ocurrió un problema al subir el material." });
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
