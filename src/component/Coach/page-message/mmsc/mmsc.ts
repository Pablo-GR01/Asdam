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

  // Infos utilisateur connecté
  userId = '';
  userNom = '';
  userPrenom = '';
  userInitiales = '';

  // Liste affichée dynamiquement
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  showSuggestions = false;
  messages: Message[] = [];

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('utilisateur');
    if (!storedUser) return console.error('Utilisateur non connecté !');

    const user = JSON.parse(storedUser);
    if (!user._id) return console.error('Utilisateur invalide ou ID manquant !');

    this.userId = user._id;
    this.userPrenom = user.prenom || '';
    this.userNom = user.nom || '';
    this.userInitiales = user.initiale || `${this.userPrenom[0] || ''}${this.userNom[0] || ''}`.toUpperCase();

    console.log('Utilisateur connecté :', user);

    // 🔹 Récupérer la liste de contacts persistée depuis localStorage
    const savedContacts = localStorage.getItem(`contacts_${this.userId}`);
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
    } else {
      this.contacts = [];
    }

    const searchSub = this.searchSubject.pipe(debounceTime(200))
      .subscribe(text => this.filterContacts(text));
    this.subscriptions.push(searchSub);

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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // 🔹 Recherche des utilisateurs via l'API
  onSearchChange(text: string) {
    this.showSuggestions = true;
    this.searchSubject.next(text);
  }

  filterContacts(text: string) {
    if (!text.trim()) {
      this.filteredContacts = [];
      return;
    }

    this.chatService.getContacts().subscribe({
      next: (data) => {
        this.filteredContacts = data
          .filter(c => c._id !== this.userId && `${c.firstName} ${c.lastName}`.toLowerCase().includes(text.toLowerCase()));
      },
      error: (err) => console.error('Erreur récupération contacts:', err)
    });
  }

  selectSuggestion(contact: Contact) {
    this.showSuggestions = false;
    this.searchText = `${contact.firstName} ${contact.lastName}`;
    this.selectContact(contact);

    // Ajouter le contact à la liste s'il n'y est pas déjà
    const exists = this.contacts.find(c => c._id === contact._id);
    if (!exists) {
      this.contacts.unshift(contact);
      this.saveContacts();
    }
  }

  selectContact(contact: Contact | null) {
    if (!contact) return;
    this.selectedContact = contact;

    if (!this.userId) return console.error('userId non défini');

    this.chatService.getConversation(this.userId, contact._id).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur récupération conversation:', err);
        alert('Impossible de récupérer la conversation. Vérifie que le serveur est actif.');
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) return;

    if (!this.userId) {
      alert('Impossible d’envoyer le message : utilisateur non connecté.');
      return;
    }

    const msg: Message = {
      senderId: this.userId,
      receiverId: this.selectedContact._id,
      text: this.newMessage.trim()
    };

    this.chatService.sendMessage(msg).subscribe({
      next: (sent) => {
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 100);
        this.chatService.emitNewMessage(sent);
      },
      error: (err) => {
        console.error('Erreur envoi message :', err);
        alert('Impossible d’envoyer le message.');
      }
    });
  }

  removeContact(contactId: string) {
    this.contacts = this.contacts.filter(c => c._id !== contactId);
    this.saveContacts();

    if (this.selectedContact?._id === contactId) {
      this.selectedContact = null;
      this.messages = [];
    }
  }

  // 🔹 Sauvegarder la liste des contacts dans localStorage
  saveContacts() {
    localStorage.setItem(`contacts_${this.userId}`, JSON.stringify(this.contacts));
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

  // 🔹 Réinitialiser la liste des contacts à la déconnexion
  logout() {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem(`contacts_${this.userId}`);
    // Ici tu peux rediriger vers la page de login
  }
}
