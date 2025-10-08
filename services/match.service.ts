import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  equipeA: string;
  equipeB: string;
  date: string;
  lieu: string;
  categorie: string;
  scoreA?: number;
  scoreB?: number;
  logoA?: string;
  logoB?: string;
  duree?: number;  // durée totale
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient) {}

  creerMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatchById(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  // Mise à jour des scores (optionnel backend)
  updateScore(id: string, scoreA: number, scoreB: number): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}`, { scoreA, scoreB });
  }
}
