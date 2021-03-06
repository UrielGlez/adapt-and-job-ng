import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { CleanComponent } from './layout/clean/clean.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './layout/main/main.component';
import { FooterComponent } from './layout/main/footer/footer.component';
import { HeaderComponent } from './layout/main/header/header.component';
import { MenuComponent } from './layout/main/menu/menu.component';
import { DocumentsComponent } from './components/documents/documents.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SecurityGuard } from "./services/security.guard";
import { TokenInterceptor } from "./services/token.interceptor";

import { MessageService, ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog'; 
import { ToastModule } from "primeng/toast";
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    CleanComponent,
    SignupComponent,
    HomeComponent,
    MainComponent,
    FooterComponent,
    HeaderComponent,
    MenuComponent,
    DocumentsComponent
  ],
  imports: [
    BrowserModule,
    ToastModule,
    BrowserAnimationsModule,
    ConfirmPopupModule,
    MultiSelectModule,
    FormsModule,
    ProgressBarModule,
    HttpClientModule,
    PdfViewerModule,
    ConfirmDialogModule,
    FileUploadModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule, 
    AppRoutingModule, 
    NgbModule,
    DialogModule
  ],
  providers: [
    SecurityGuard,
    ConfirmationService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
