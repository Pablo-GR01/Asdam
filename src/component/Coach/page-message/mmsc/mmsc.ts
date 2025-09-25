import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService, Contact, Message } from '../../../../../services/chat.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-mmsc',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mmsc.html',
  styleUrls: ['./mmsc.css']
})
export class MMSC implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  searchText = '';
  selectedContact: Contact | null = null;
  newMessage = '';
  userId = '';
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  showSuggestions = false;
  messages: Message[] = [];

  private searchSubject = new Subject<string>();

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // ✅ Récupère la session utilisateur depuis localStorage
    const storedUser = localStorage.getItem('utilisateur');
    if (!storedUser) return console.error('Utilisateur non connecté !');

    const user = JSON.parse(storedUser);
    if (!user._id) return console.error('Utilisateur invalide ou ID manquant !');

    this.userId = user._id;
    console.log('Utilisateur connecté :', user);

    this.loadContacts();

    // Recherche avec debounce
    this.searchSubject.pipe(debounceTime(200)).subscribe(text => this.filterContacts(text));

    // Écoute des nouveaux messages
    this.chatService.onNewMessage().subscribe(msg => {
      if (
        (msg.senderId === this.selectedContact?._id && msg.receiverId === this.userId) ||
        (msg.senderId === this.userId && msg.receiverId === this.selectedContact?._id)
      ) {
        this.messages.push(msg);
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  // Charger tous les contacts depuis le service
  loadContacts() {
    this.chatService.getContacts().subscribe({
      next: (data) => {
        // Exclure l'utilisateur connecté
        const otherUsers = data.filter(contact => contact._id !== this.userId);
  
        // console.log('Contacts reçus (hors utilisateur connecté):', otherUsers);
  
        // Boucle pour afficher chaque contact dans la console
        otherUsers.forEach(contact => {
          
        });
  
        this.contacts = otherUsers;
        this.filteredContacts = otherUsers;
      },
      error: (err) => console.error('Erreur récupération contacts:', err)
    });
  }
  

  onSearchChange(text: string) {
    this.showSuggestions = true;
    this.searchSubject.next(text);
  }

  filterContacts(text: string) {
    if (!text.trim()) {
      this.filteredContacts = this.contacts;
      return;
    }
    this.filteredContacts = this.contacts.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(text.toLowerCase())
    );
  }

  selectSuggestion(contact: Contact) {
    this.showSuggestions = false;
    this.searchText = `${contact.firstName} ${contact.lastName}`;
    this.selectContact(contact);
  }

  selectContact(contact: Contact | null) {
    if (!contact) return;

    this.selectedContact = contact;

    this.chatService.getConversation(this.userId, contact._id).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Erreur récupération conversation:', err)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) return;

    const msg: Message = {
      senderId: this.userId,
      receiverId: this.selectedContact._id,
      text: this.newMessage.trim()
    };

    this.chatService.sendMessage(msg).subscribe({
      next: (sent) => {
        this.messages.push(sent);
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur envoi message:', err);
        alert('Impossible d’envoyer le message. Vérifie que le serveur est actif.');
      }
    });
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  hideSuggestions() {
    setTimeout(() => (this.showSuggestions = false), 200);
  }
}
