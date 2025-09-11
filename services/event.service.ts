import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:3000/api/events'; // Modifie selon ton backend

  constructor(private http: HttpClient) {}

  // Ajouter un événement
  addEvent(event: EventItem): Observable<EventItem> {
    // Optionnel : définir les headers si ton backend attend du JSON
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<EventItem>(this.apiUrl, event, { headers });
  }

  // Récupérer tous les événements
  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(this.apiUrl);
  }
}
