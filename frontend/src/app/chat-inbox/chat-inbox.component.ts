import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../models/Message';
import { saveAs } from 'file-saver';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatroomService } from '../services/chatroom/chatroom.service';
import { ToastrService } from 'ngx-toastr';

const SOCKET_ENDPOINT = 'http://localhost:3000';
const uploadUri = 'http://localhost:3000/upload';
const downloadUri = 'http://localhost:3000/download';
@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.css']
})
export class ChatInboxComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('chats') private chatsContainer!: ElementRef;
  @ViewChild('sendMessageBox') private sendMessageBoxContainer!: ElementRef;

  socket: any;
  message: string;
  messages: Message[];
  chatroom: string;
  selectedFile: any;
  socketid: string;
  color: string[];
  chatwindow: any;
  users: string[];

  constructor(private renderer: Renderer2, private elem: ElementRef,private http: HttpClient,public authService : AuthService, private chatroomService: ChatroomService,private _Activatedroute:ActivatedRoute, private toastr: ToastrService) {
    this.message = "";
    this.messages = [];
    this.selectedFile = null;
    this.chatroom = this._Activatedroute.snapshot.paramMap.get("name") || '';
    this.socketid = '';
    this.users = [];
    this.color = ['red', 'blue', 'darkred', 'darkgreen', 'teal', 'royalblue', 'darkslateblue', 'goldenrod'];
   }

  ngOnInit(): void {
    this.setupSocketConnection();
    this.loadAllChats();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onClickUserListButton(){
    if(this.chatsContainer.nativeElement.style.display=="none") this.chatsContainer.nativeElement.style.display = "block";
    else this.chatsContainer.nativeElement.style.display = "none";
    if(this.sendMessageBoxContainer.nativeElement.style.display=="none") this.sendMessageBoxContainer.nativeElement.style.display = "flex";
    else this.sendMessageBoxContainer.nativeElement.style.display = "none";
  }

  loadAllChats(){
    this.chatroomService.getAllChats(this.chatroom).subscribe(
      response => {
        console.log(response);
        this.messages = response as any;
      },
      error => {
        this.toastr.error("Failed to Load Old Chats !!!");
        console.log("couldn't load chats");
      }
    );
  }

  setupSocketConnection() {
    this.socket = this.chatroomService.getSocket(this.chatroom);
    this.socket.emit('user', this.chatroom);
    this.socket.on(this.chatroom+"-user", (data: string[]) => {
      this.users = data;
    });
    this.socket.on(this.chatroom, (data: Message) => {
        console.log(data);
        this.messages.push(data);
    });

  }

  onClickSendButton() {
    console.log(this.message);
    if(this.message.length<=0){
      return;
    }
    this.socket.emit('message', {chatroom: this.chatroom, message: this.message, type: 0});
    //this.messages.push(this.message);
    this.message = "";
  }

  onFileSelected(event: any){
    console.log(event);
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }

  onClickDownloadButton(filename: string){
    console.log(filename);
    this.chatroomService.downloadFile(filename, this.chatroom).subscribe(
      (res) => {
        console.log(res);
        saveAs(res, filename);
      },
      (err) => {
        // failed to get file
        this.toastr.error("Failed to Download File !!!");
        console.log(err);
      }
    );
  }

  onUpload(){
    console.log(this.selectedFile);
    if(this.selectedFile==null){
      return;
    }
    this.chatroomService.uploadFile(this.selectedFile, this.chatroom).subscribe(
      (res) => {
        console.log(res);
        this.socket.emit('file', {chatroom: this.chatroom, message: res.filename, type: 1});
        this.toastr.success("Filed Uploaded Successfully !!!");
      },
      (err) => {
        // failed to get file
        this.toastr.error("Failed to Upload File !!!")
        console.log(err);
      }
    );
  }

  getColor(index: number) {
    return index % this.color.length;
  }

}
