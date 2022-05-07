import { Component, OnInit } from '@angular/core';
import { ChatroomService } from '../services/chatroom/chatroom.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chatrooms: any;

  constructor(private authService: AuthService, private chatroomService: ChatroomService) {
    chatroomService.getAllChatroom().subscribe(
      response => {
        this.chatrooms = response;
        console.log(response);
      },
      error => {
        console.log(Error);
        this.chatrooms = [];
      }
    );


    // var count = 10;
    // var lst = [];
    // var s:Date = new Date();
    // var e:Date = new Date();
    // for(var i=0;i<800;++i){
    //   chatroomService.getAllChats("aaa").subscribe(
    //     response => {
    //       e = new Date();
    //       console.log(e.getTime() - s.getTime());
    //     },
    //     error => {
    //       e = new Date();
    //       console.log(e.getTime() - s.getTime());
    //     }
    //   );
    // }

  }

  ngOnInit(): void {
  }

}
