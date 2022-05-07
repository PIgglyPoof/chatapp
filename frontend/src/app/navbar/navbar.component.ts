import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onClickSignout(){
    this.authService.logout();
    this.toastr.success("Logged Out Successfully !!!");
    this.router.navigate(['login']);
  }

}
