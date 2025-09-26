import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, map, catchError } from 'rxjs';

// Interface Contact
export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
}

// Interface Message
export interface Message {
  id?: string;              // <-- ajouté
  senderId: string;
  receiverId: string;
  text: string;
  senderName?: string;
  receiverName?: string;
  senderInitiales?: string;
  timestamp?: string | Date;
}


@Injectable({ providedIn: 'root' })
export class ChatService {
  private newMessageSubject = new Subject<Message>();
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) { }

  // Récupère tous les utilisateurs
  getContacts(): Observable<Contact[]> {
    return this.http.get<any[]>('http://localhost:3000/api/users/contacts').pipe(
      map(users =>
        users.map(u => ({
          _id: u._id || u.id,
          firstName: u.firstName || u.firstname || u.prenom || u.name || 'Utilisateur',
          lastName: u.lastName || u.lastname || u.nom || ''
        }))
      ),
      catchError(this.handleError)
    );
  }

  // Recherche côté serveur
  searchContacts(text: string): Observable<Contact[]> {
    return this.getContacts().pipe(
      map(users =>
        users.filter(u =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(text.toLowerCase())
        )
      )
    );
  }

  // Récupère la conversation entre 2 utilisateurs
  getConversation(user1Id: string, user2Id: string): Observable<Message[]> {
    return this.http.get<{ messages: Message[] }>(`${this.apiUrl}/conversation/${user1Id}/${user2Id}`)
      .pipe(
        map(res => res.messages || []),
        catchError(this.handleError)
      );
  }

  // Envoie un message
  sendMessage(msg: Message): Observable<Message> {
    if (!msg.senderId || !msg.receiverId || !msg.text?.trim()) {
      return throwError(() => new Error('Impossible d’envoyer le message : champs manquants'));
    }

    const payload = {
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.text.trim(),
      senderName: msg.senderName || '' // on ajoute senderName pour le composant
    };

    return this.http.post<Message>(this.apiUrl, payload).pipe(
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

  // Émettre un nouveau message
  emitNewMessage(msg: Message) {
    this.newMessageSubject.next(msg);
  }

  // Gestion des erreurs génériques
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API messages :', error);
    return throwError(() => new Error('Erreur lors de la récupération des données'));
  }
}
