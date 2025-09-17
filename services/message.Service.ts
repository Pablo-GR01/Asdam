// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';  // <-- Ajout de tap

export interface Message {
  id: string;
  content: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUnreadCount(userId: string): void {
    this.http.get<Message[]>(`/api/messages/unread/${userId}`).subscribe(messages => {
      this.unreadCountSubject.next(messages.length);
    });
  }

  markAsRead(messageId: string): Observable<any> {
    return this.http.post(`/api/messages/read/${messageId}`, {}).pipe(
      // Mettre à jour le compteur après lecture
      tap(() => this.getUnreadCount(localStorage.getItem('userId')!))
    );
  }
}
