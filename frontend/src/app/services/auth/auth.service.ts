import { Injectable } from '@angular/core';
import { User } from 'src/app/models/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri: string;

  constructor(private http: HttpClient) {
    this.uri = "http://localhost:3000";
  }

  register(user: User){
    return this.http.post(this.uri+'/register', user);
  }

  login(user: User){
    return this.http.post(`${this.uri}/login`, user, {responseType: 'json'});
  }

  // check if user is logged in
  isLoggedIn(){
    let token = localStorage.getItem("token");
    if(token==undefined||token==null||token===''){
      return false;
    }
    else{
      return true;
    }
  }

  getUsername(){
    if(this.isLoggedIn())
      return localStorage.getItem("username");
    else
      return "";
  }

  logout(){
    localStorage.setItem("token", '');
  }

  // get token
  getToken() {
    return localStorage.getItem("token");
  }

}
