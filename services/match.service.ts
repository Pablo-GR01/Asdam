import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interface complète d'un match
export interface Match {
  equipeA: string;
  equipeB: string;
  date: string;       // ISO string pour HTTP
  lieu: string;
  categorie: string;  // obligatoire pour MongoDB
  scoreA?: number;
  scoreB?: number;
  logoA?: string;     // logo équipe A
  logoB?: string;     // logo équipe B
  duree?: number;     // durée du match en minutes
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient) {}

  // ✅ Créer un match
  creerMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  // ✅ Récupérer tous les matchs
  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  // ✅ Récupérer un match par ID (optionnel)
  getMatchById(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }
}
