import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatInboxComponent } from './chat-inbox/chat-inbox.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FileSaverModule } from 'ngx-filesaver';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CreateComponent } from './create/create.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponent,
    DashboardComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    CreateComponent,
    BaseLayoutComponent,
    HomeLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      "positionClass": "toast-bottom-center"
    })
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
