// src/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs'; // <--- ajouté 'map'

export interface Contact {
  _id: string;          // correspond à MongoDB
  firstName: string;
  lastName: string;
  role?: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: Date;
  senderName?: string;
  receiverName?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://localhost:3000/api'; // ton backend
  private newMessageSubject = new Subject<Message>();

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getContacts(): Observable<Contact[]> {
    // On suppose que le backend renvoie un tableau directement : User.find()
    return this.http.get<Contact[]>(`${this.baseUrl}/users`);
  }

  // Rechercher les utilisateurs par texte
  searchContacts(query: string): Observable<Contact[]> {
    // On ajoute la recherche côté backend via query param 'search'
    return this.http.get<Contact[]>(`${this.baseUrl}/users?search=${query}`);
  }

  // Récupérer les messages entre deux utilisateurs
  getMessages(userId: string, contactId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/conversation/${userId}/${contactId}`);
  }

  // Envoyer un message
  sendMessage(msg: Message): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/messages/send`, msg);
  }

  // Observable pour recevoir les messages en temps réel
  onNewMessage(): Observable<Message> {
    return this.newMessageSubject.asObservable();
  }

  // Pour simuler la réception d'un message
  receiveMessage(msg: Message) {
    this.newMessageSubject.next(msg);
  }
}
