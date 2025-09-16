import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Ton modèle User (à adapter si besoin)
export interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email?: string;
  equipe?: string;
  initiale?: string;
}

export interface Convocation {
  match: string;
  equipe: string;
  joueurs: User[];   // ⚡ tableau d’objets User
  date: Date | string;
  lieu: string;
  initiale?: string;
}

@Injectable({ providedIn: 'root' })
export class ConvocationService {
  private apiUrl = 'http://localhost:3000/api/convocations';

  constructor(private http: HttpClient) {}

  creerConvocation(convocation: Convocation): Observable<Convocation> {
    // Adapter le payload pour l’API : on envoie seulement les ID ou les noms
    const payload = {
      ...convocation,
      joueurs: convocation.joueurs.map(j => ({
        _id: j._id,
        nom: j.nom,
        prenom: j.prenom
      })),
      date: convocation.date instanceof Date
        ? convocation.date.toISOString()
        : convocation.date
    };

    return this.http.post<Convocation>(this.apiUrl, payload);
  }

  // Récupérer toutes les convocations d’un utilisateur
  getConvocationsByUser(username: string): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(`${this.apiUrl}/user/${username}`);
  }

  // Récupérer le nombre de convocations d’un utilisateur
  getConvocationCountByUser(username: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${username}/count`);
  }
}
