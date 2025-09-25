import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService, Contact, Message } from '../../../../../services/chat.service';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mmsc',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mmsc.html',
  styleUrls: ['./mmsc.css']
})
export class MMSC implements OnInit, OnDestroy {
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
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Récupère la session utilisateur depuis localStorage
    const storedUser = localStorage.getItem('utilisateur');
    if (!storedUser) return console.error('Utilisateur non connecté !');

    const user = JSON.parse(storedUser);
    if (!user._id) return console.error('Utilisateur invalide ou ID manquant !');

    this.userId = user._id;
    console.log('Utilisateur connecté :', user);

    this.loadContacts();

    // Recherche avec debounce
    const searchSub = this.searchSubject.pipe(debounceTime(200))
      .subscribe(text => this.filterContacts(text));
    this.subscriptions.push(searchSub);

    // Écoute des nouveaux messages
    const msgSub = this.chatService.onNewMessage().subscribe(msg => {
      if (
        (msg.senderId === this.selectedContact?._id && msg.receiverId === this.userId) ||
        (msg.senderId === this.userId && msg.receiverId === this.selectedContact?._id)
      ) {
        this.messages.push(msg);
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
    this.subscriptions.push(msgSub);
  }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites mémoire
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadContacts() {
    this.chatService.getContacts().subscribe({
      next: (data) => {
        // Exclure l'utilisateur connecté
        const otherUsers = data.filter(contact => contact._id !== this.userId);
        this.contacts = otherUsers;
        this.filteredContacts = otherUsers;
        // console.log('Contacts chargés :', this.contacts);
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
    console.log('Contact sélectionné :', contact);

    if (!this.userId) return console.error('userId non défini');

    this.chatService.getConversation(this.userId, contact._id).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        console.log('Conversation chargée :', msgs);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur récupération conversation:', err);
        alert('Impossible de récupérer la conversation. Vérifie que le serveur est actif.');
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) {
      console.warn('Message vide ou destinataire non sélectionné');
      return;
    }
  
    if (!this.userId) {
      console.error('Erreur : userId non défini');
      alert('Impossible d’envoyer le message : utilisateur non connecté.');
      return;
    }
  
    const msg: Message = {
      senderId: this.userId,
      receiverId: this.selectedContact._id,
      text: this.newMessage.trim()
    };
  
    console.log('Envoi du message :', msg);
  
    this.chatService.sendMessage(msg).subscribe({
      next: (sent) => {
        this.newMessage = ''; // juste vider le champ
        setTimeout(() => this.scrollToBottom(), 100);
        this.chatService.emitNewMessage(sent); // le message sera ajouté via l'abonnement
      },
      error: (err) => {
        console.error('Erreur envoi message :', err);
        alert('Impossible d’envoyer le message. Vérifie que le serveur est actif et que l’API est accessible.');
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
