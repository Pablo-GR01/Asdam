import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Modèle User
export interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email?: string;
  equipe?: string;
  role?: string; // ⚡ rôle ajouté pour filtrer
  initiale?: string;
}

// Modèle Convocation
export interface Convocation {
  match: string;
  equipe: string;
  joueurs: User[];
  date: Date | string;
  lieu: string;
  statut?: 'en attente' | 'confirmé' | 'annulé';
  initiale?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConvocationService {
  private apiUrl = 'http://localhost:3000/api/convocations';
  private usersUrl = 'http://localhost:3000/api/users'; // ⚡ endpoint utilisateurs

  constructor(private http: HttpClient) {}

  // Créer une convocation
  creerConvocation(convocation: Convocation): Observable<Convocation> {
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

  // Récupérer toutes les convocations
  getConvocations(): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(this.apiUrl);
  }

  // Récupérer les convocations d’un utilisateur
  getConvocationsByUser(username: string): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(`${this.apiUrl}/user/${username}`);
  }

  // Récupérer le nombre de convocations d’un utilisateur
  getConvocationCountByUser(username: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${username}/count`);
  }

  // ⚡ Nouvelle méthode : récupérer uniquement les joueurs
  getJoueurs(): Observable<User[]> {
  return this.http.get<User[]>('http://localhost:3000/api/utilisateurs')  // ⚡ URL exacte du backend
    .pipe(
      map(users => users.filter(u => u.role === 'joueur'))
    );
}

}
