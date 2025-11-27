// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChildFormComponent } from './pages/child-form/child-form.component';
import { ChildDetailsComponent } from './pages/child-details/child-details.component';
import { ChatComponent } from './chat/chat.component';
// Optional home page

export const routes: Routes = [
  // Root home page
  { path: 'login', component: LoginComponent },
  { path: 'register-child', component: ChildFormComponent },
  { path: 'child-details/:id', component: ChildDetailsComponent },
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: '' },
];
