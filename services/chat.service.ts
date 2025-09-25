import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, map, catchError } from 'rxjs';

// Interface Contact : vérifie que les champs correspondent à ton backend
export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  senderName?: string;
  receiverName?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private newMessageSubject = new Subject<Message>();
  private apiUrl = 'http://localhost:3000/api/messages'; // ajout de apiUrl

  constructor(private http: HttpClient) { }

  // Récupère tous les utilisateurs et map si nécessaire pour correspondre à l'interface Contact
  getContacts(): Observable<Contact[]> {
    return this.http.get<any[]>('http://localhost:3000/api/users/contacts').pipe(
      map(users =>
        users.map(u => ({
          _id: u._id || u.id,
          firstName: u.firstName || u.firstname || u.prenom || u.name || 'Utilisateur',
          lastName: u.lastName || u.lastname || u.nom || ''
        }))
      )
    );
  }

  // Recherche d'utilisateurs côté serveur
  searchContacts(text: string): Observable<Contact[]> {
    return this.getContacts().pipe(
      map(users =>
        users.filter(u =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(text.toLowerCase())
        )
      )
    );
  }

  // Récupère les messages entre user1 et user2
  getConversation(user1Id: string, user2Id: string): Observable<Message[]> {
    return this.http.get<{ messages: Message[] }>(`http://localhost:3000/api/messages/conversation/${user1Id}/${user2Id}`)
      .pipe(
        map(res => res.messages || []),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API messages :', error);
    return throwError(() => new Error('Erreur lors de la récupération des messages'));
  }

  // Envoie un message
  sendMessage(msg: Message): Observable<Message> {
    // Vérifie les champs
    if (!msg.senderId || !msg.receiverId || !msg.text?.trim()) {
      throw new Error('Impossible d’envoyer le message : champs manquants');
    }
  
    // Définir l'URL complète
    const url = 'http://localhost:3000/api/messages';
  
    // POST vers le backend
    return this.http.post<Message>(url, {
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.text.trim()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur envoi message :', error);
        return throwError(() => new Error('Erreur lors de l’envoi du message'));
      })
    );
  }
  

  // Observable pour les nouveaux messages
  onNewMessage(): Observable<Message> {
    return this.newMessageSubject.asObservable();
  }

  emitNewMessage(msg: Message) {
    this.newMessageSubject.next(msg);
  }
}
