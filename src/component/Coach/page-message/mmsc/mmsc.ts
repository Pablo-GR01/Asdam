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
  userNom = '';
  userPrenom = '';
  userInitiales = '';

  isSending = false;
  isTyping = false;

  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  showSuggestions = false;
  messages: Message[] = [];

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  userStatus: 'En ligne' | 'Absent' | 'Ne pas déranger' = 'En ligne';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadUser();
    this.loadContacts();
    this.setupSearch();
    this.listenNewMessages();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUser() {
    const storedUser = localStorage.getItem('utilisateur');
    if (!storedUser) return console.error('Utilisateur non connecté !');

    const user = JSON.parse(storedUser);
    if (!user._id) return console.error('Utilisateur invalide ou ID manquant !');

    this.userId = user._id;
    this.userPrenom = user.prenom || '';
    this.userNom = user.nom || '';
    this.userInitiales = user.initiale || `${this.userPrenom[0] || ''}${this.userNom[0] || ''}`.toUpperCase();
  }

  private loadContacts() {
    const savedContacts = localStorage.getItem(`contacts_${this.userId}`);
    if (savedContacts) this.contacts = JSON.parse(savedContacts);
  }

  private setupSearch() {
    this.subscriptions.push(
      this.searchSubject.pipe(debounceTime(200)).subscribe(text => this.filterContacts(text))
    );
  }

  private listenNewMessages() {
    this.subscriptions.push(
      this.chatService.onNewMessage().subscribe(msg => this.handleIncomingMessage(msg))
    );
  }

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
      next: data => {
        this.filteredContacts = data
          .filter(c => c._id !== this.userId && `${c.firstName} ${c.lastName}`.toLowerCase().includes(text.toLowerCase()));
      },
      error: err => console.error('Erreur récupération contacts:', err)
    });
  }

  selectSuggestion(contact: Contact) {
    this.showSuggestions = false;
    this.searchText = `${contact.firstName} ${contact.lastName}`;
    this.selectContact(contact);

    if (!this.contacts.find(c => c._id === contact._id)) {
      this.contacts.unshift(contact);
      this.saveContacts();
    }
  }

  selectContact(contact: Contact | null) {
    if (!contact) return;
    this.selectedContact = contact;
    this.loadConversation(contact);
  }

  private loadConversation(contact: Contact) {
    this.chatService.getConversation(this.userId, contact._id).subscribe({
      next: msgs => {
        this.messages = msgs.map(m => ({
          ...m,
          senderName: m.senderId === this.userId ? `${this.userPrenom} ${this.userNom}` : `${contact.firstName} ${contact.lastName}`,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
        }));
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: err => {
        console.error('Erreur récupération conversation:', err);
        alert('Impossible de récupérer la conversation. Vérifie que le serveur est actif.');
      }
    });
  }

  sendMessage() {
    if (!this.newMessage?.trim() || !this.selectedContact || this.isSending) return;
    this.isSending = true;
  
    const msg: Message = {
      senderId: this.userId,
      receiverId: this.selectedContact._id,
      text: this.newMessage.trim(),
      senderName: `${this.userPrenom} ${this.userNom}`,
      timestamp: new Date()
    };
  
    this.chatService.sendMessage(msg).subscribe({
      next: sent => {
        this.newMessage = '';
        this.addMessage(sent);
        this.chatService.emitNewMessage(sent);
  
        // 🚀 Envoi email de notification (sécurisé)
        if (this.selectedContact?.email) {
          const subject = `Nouveau message de ${this.userPrenom} ${this.userNom}`;
          const text = `
            Bonjour ${this.selectedContact.firstName},
  
            Vous avez reçu un nouveau message dans l'application :
  
            "${msg.text}"
  
            Connectez-vous pour y répondre.
          `;
  
          this.chatService.sendEmailNotification(this.selectedContact.email, subject, text)
            .subscribe({
              next: () => console.log("✅ Notification email envoyée"),
              error: err => console.error("❌ Erreur envoi mail", err)
            });
        }
  
        this.isSending = false;
      },
      error: err => {
        console.error('Erreur envoi message :', err);
        alert('Impossible d’envoyer le message.');
        this.isSending = false;
      }
    });
  }
  

  private handleIncomingMessage(msg: Message) {
    const exists = this.messages.some(m =>
      m.senderId === msg.senderId &&
      m.receiverId === msg.receiverId &&
      m.text === msg.text &&
      new Date(m.timestamp ?? new Date()).getTime() === new Date(msg.timestamp ?? new Date()).getTime()
    );

    if (!exists && (
      (msg.senderId === this.selectedContact?._id && msg.receiverId === this.userId) ||
      (msg.senderId === this.userId && msg.receiverId === this.selectedContact?._id)
    )) {
      if (!msg.timestamp) msg.timestamp = new Date();
      this.addMessage(msg);
    }
  }

  private addMessage(msg: Message) {
    this.messages.push(msg);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  removeContact(contactId: string) {
    this.contacts = this.contacts.filter(c => c._id !== contactId);
    this.saveContacts();
    if (this.selectedContact?._id === contactId) {
      this.selectedContact = null;
      this.messages = [];
    }
  }

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

  getInitiales(fullName?: string): string {
    if (!fullName) return '';
    const parts = fullName.split(' ');
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  }

  logout() {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem(`contacts_${this.userId}`);
  }

  trackByMsgId(_: number, msg: Message) {
    return msg.timestamp?.toString() || msg.text;
  }

  trackByContactId(_: number, contact: Contact) {
    return contact._id;
  }

  deleteContact(contact: Contact) {
    const confirmed = confirm(`Voulez-vous vraiment supprimer ${contact.firstName} ${contact.lastName} ?`);
    if (confirmed) this.removeContact(contact._id);
  }

  setStatus(status: 'En ligne' | 'Absent' | 'Ne pas déranger') {
    this.userStatus = status;
  }

  getFilteredContacts() {
    if (!this.filteredContacts) return [];
    if (!this.searchText || this.searchText.length === 0) return this.filteredContacts;

    const firstLetter = this.searchText[0].toUpperCase();
    return this.filteredContacts.filter(contact =>
      contact.firstName.toUpperCase().startsWith(firstLetter)
    );
  }
}
