import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatroomService } from '../services/chatroom/chatroom.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  chatroomForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(private chatroomService: ChatroomService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.chatroomService.createChatroom(this.chatroomForm.value.name).subscribe(
      res => {
        this.toastr.success(res);
      },
      err => {
        this.toastr.error(err.error);
      }
    )
  }

}
