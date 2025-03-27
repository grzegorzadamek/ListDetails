import { Component } from '@angular/core';
import { MessageService } from "src/app/services/message.service";

@Component({
    selector: 'app-messages',
    imports: [],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent {
  constructor(public messageService: MessageService) {}
}
