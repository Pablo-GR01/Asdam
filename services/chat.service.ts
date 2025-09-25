import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // Récupère tous les utilisateurs et map si nécessaire pour correspondre à l'interface Contact
  getContacts(): Observable<Contact[]> {
    return this.http.get<any[]>('http://localhost:3000/api/users/contacts').pipe(
      map(users => {
        // console.log('Raw users from API:', users); // <-- ajoute ça pour voir les vrais noms des champs
        return users.map(u => ({
          _id: u._id || u.id,
          firstName: u.firstName || u.firstname || u.prenom || u.name || 'Utilisateur',
          lastName: u.lastName || u.lastname || u.nom || ''
        }));
      })
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

  // Récupère les messages entre user et contact
  getConversation(user1Id: string, user2Id: string): Observable<Message[]> {
    return this.http.get<{messages: Message[]}>(`http://localhost:3000/api/messages/conversation/${user1Id}/${user2Id}`)
      .pipe(
        map(res => res.messages),  // transforme {messages: [...] } en Message[]
      );
  }
  
  // Envoie un message
  sendMessage(msg: Message): Observable<Message> {
    // Vérifie que tous les champs existent
    if (!msg.senderId || !msg.receiverId || !msg.text || msg.text.trim() === '') {
      throw new Error('Impossible d’envoyer le message : champs manquants');
    }
  
    // Envoi du message
    return this.http.post<Message>(
      'http://localhost:3000/api/messages/send',
      {
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        text: msg.text.trim()  // on retire les espaces superflus
      }
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
