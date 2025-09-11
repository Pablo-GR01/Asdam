import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventItem {
  id?: string;
  day: string;
  hour: string;
  title: string;
  coach: string;
  category: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  // ⚡ Maintenant on accepte FormData pour upload d'image
  addEvent(event: FormData): Observable<EventItem> {
    return this.http.post<EventItem>(this.apiUrl, event);
  }

  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(this.apiUrl);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
