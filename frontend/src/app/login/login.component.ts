import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authService: AuthService, public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    //console.log(this.userForm.value);
    this.authService.login(this.userForm.value).subscribe(
      (response: any) => {
        console.log(response);
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.username);
        this.toastr.success("Logged in Successfully !!!");
        this.router.navigate(['dashboard']);
      },
      error => {
        this.toastr.error("Failed to Login !!!");
        console.log(error);
      }
    );
  }

}
