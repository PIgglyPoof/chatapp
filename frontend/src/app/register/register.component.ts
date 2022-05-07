import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authService: AuthService, public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.userForm.value);
    this.authService.register(this.userForm.value).subscribe(res => {
      console.log(res);
      this.toastr.success("Registration Successful !!!");
      this.router.navigate(['login']);
    },
    err => {
      console.log(err);
      this.toastr.error(err.error);
    });
  }

}
