import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class DataFirestoreService {

  isMenuCollapsed: boolean = false;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  uploadFile(filePath: string, file: any) {
    return this.storage.upload(filePath, file);
  }

  deleteFile(fileURL: string) {
    return this.storage.storage.refFromURL(fileURL).delete();
  }
}
