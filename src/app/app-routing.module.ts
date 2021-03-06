import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { CleanComponent } from './layout/clean/clean.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './layout/main/main.component';
import { SecurityGuard } from "./services/security.guard";
import { DocumentsComponent } from './components/documents/documents.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "",
    component: CleanComponent,
    children: [
      { path: "landing", component: LandingComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
    ],
  },
  {
    path: "", component: MainComponent, 
    children: [
      { path: "home",  component: HomeComponent, canActivate: [SecurityGuard] },
      { path: "home-info/:id",  component: HomeComponent, canActivate: [SecurityGuard], runGuardsAndResolvers: 'always'},
      { path: "documents/:id",  component: DocumentsComponent, canActivate: [SecurityGuard] },
    ]
  },
  { path: '**', redirectTo: "landing", pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
