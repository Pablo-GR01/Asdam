import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService, Contact, Message } from '../../../../services/chat.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-mmsc',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mmsc.html',
  styleUrls: ['./mmsc.css']
})
export class MMSC {
  searchText = '';
  selectedContact: Contact | null = null;
  newMessage = '';
  userId = 'ID_UTILISATEUR_CONNECTE';
  contacts: Contact[] = [];
  messages: Message[] = [];

  private searchSubject = new Subject<string>();

  constructor(private chatService: ChatService) {
    this.loadContacts();

    this.searchSubject.pipe(debounceTime(300))
      .subscribe(text => this.searchContacts(text));

    this.chatService.onNewMessage().subscribe(msg => {
      if (
        (msg.senderId === this.selectedContact?._id && msg.receiverId === this.userId) ||
        (msg.senderId === this.userId && msg.receiverId === this.selectedContact?._id)
      ) {
        this.messages.push(msg);
      }
    });
  }

  loadContacts() {
    this.chatService.getContacts().subscribe(data => this.contacts = data);
  }

  onSearchChange(text: string) {
    this.searchSubject.next(text);
  }

  searchContacts(text: string) {
    if (!text.trim()) {
      this.loadContacts();
      return;
    }
    this.chatService.searchContacts(text).subscribe(data => this.contacts = data);
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
    if (!contact) return;

    this.chatService.getMessages(this.userId, contact._id).subscribe(msgs => this.messages = msgs);
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) return;

    const msg: Message = {
      senderId: this.userId,
      receiverId: this.selectedContact._id,
      text: this.newMessage
    };

    this.chatService.sendMessage(msg).subscribe(sent => {
      this.messages.push({
        ...sent,
        senderName: 'Moi',
        receiverName: `${this.selectedContact?.firstName} ${this.selectedContact?.lastName}`
      });
      this.newMessage = '';
    });
  }
}
