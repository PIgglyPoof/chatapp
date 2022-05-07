import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatInboxComponent } from './chat-inbox/chat-inbox.component';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { HomeLayoutComponent } from './home-layout/home-layout.component';

const routes: Routes = [
  {
      path: '',
      component: BaseLayoutComponent,
      children: [
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent}
      ]
  },
  {
  path: '',
  component: HomeLayoutComponent,
  children: [
    {path: 'chat-index/:name', component: ChatInboxComponent, canActivate: [AuthGuard]},
    {path: 'chatroom/create', component: CreateComponent, canActivate: [AuthGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}
   ]
  }
];

// const routes: Routes = [
//   {path: 'chat-index/:name', component: ChatInboxComponent, canActivate: [AuthGuard]},
//   {path: 'chatroom/create', component: CreateComponent, canActivate: [AuthGuard]},
//   {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
//   {path: 'login', component: LoginComponent},
//   {path: 'register', component: RegisterComponent}
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent = [ChatInboxComponent, DashboardComponent, LoginComponent, RegisterComponent]
