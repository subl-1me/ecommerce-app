import { Component, OnInit } from '@angular/core';

import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { Contact } from 'src/app/models/contact';

import { ContactService } from 'src/app/services/contact.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ ContactService ]
})
export class ContactComponent implements OnInit {

  // icons
  faMobileScreenButton = faMobileScreenButton;
  faEnvelope = faEnvelope;
  faCheck = faCheck;

  public isMessageSend: boolean;

  public contact: Contact;

  constructor(
    private _contactService: ContactService
  ) {
    this.isMessageSend = false;
    this.contact = {};
   }

  ngOnInit(): void {
  }

  public onSubmit(form:any):void{
    this.isMessageSend = true;

    this._contactService.createContactMessage(this.contact).subscribe((response) => {
      console.log(response);
    })

    setTimeout(() => {
      this.isMessageSend = false;
    }, 3000)
  }

}
