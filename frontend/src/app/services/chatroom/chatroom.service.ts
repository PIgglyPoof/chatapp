import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import  io from 'socket.io-client';


const uploadUri = 'http://localhost:3000/upload';
const downloadUri = 'http://localhost:3000/download';
const uri = "http://localhost:3000";
@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(private http: HttpClient, private authService: AuthService) {

  }

  createChatroom(chatroom: string){
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    });
    return this.http.post(`${uri}/chatroom/create`,{"name": chatroom}, {responseType: 'text', headers: header});
  }

  getAllChatroom(){
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    });

    return this.http.post(`${uri}/chatroom/all`,{}, {responseType: 'json', headers: header});

  }

  getAllChats(chatroom: String){
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
   });

    return this.http.post(`${uri}/chatroom/${chatroom}`,{}, {responseType: 'json', headers: header});
  }

  uploadFile(selectedFile: any, chatroom: string){

    const formData = new FormData();
    formData.append('file', selectedFile);

    const header = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'Chatroom': chatroom
    });

    return this.http.post<any>(uploadUri,formData,{headers: header});

  }

  downloadFile(filename: string, chatroom: string){

    const header = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'Chatroom': chatroom,
      'Filename': filename
    });

    return this.http.get(downloadUri, {responseType: 'blob', headers: header});

  }

  getSocket(chatroom: string){
    return io(uri, {
      auth: {
        token: this.authService.getToken(),
        chatroom: chatroom
      }
    });
  }

}
