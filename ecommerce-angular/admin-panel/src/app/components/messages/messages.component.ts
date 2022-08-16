import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/services/messages.service';

import { Message } from 'src/app/models/message';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [ MessagesService ]
})
export class MessagesComponent implements OnInit {

  public messages: Array<Message>;

  // Icons
  faXmark = faXmark;

  constructor(
    private _messagesServices: MessagesService
  ) { 
    this.messages = [];
  }

  ngOnInit(): void {
    this.getMessages();
  }

  public getMessages():void{
    this._messagesServices.getMessages().subscribe((response) => {
      if(response.message) return;

      this.messages = response.messages;
      console.log(this.messages);
      
    })
  }

  public closeMessage(messageID:any):void{
    this._messagesServices.closeMessage(messageID).subscribe((response) => {
      if(!response.status) return;

      this.getMessages();
    })
  }

}
