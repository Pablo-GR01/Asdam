import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  initiale: string;
  club: string;
  equipe: string;
  membreDepuis: Date;
  role: string;
  photoURL?: string;
  joueurs?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://localhost:3000/api/users'; // ton endpoint backend

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User | null> {
    const userStr = localStorage.getItem('user');
    if (!userStr) return of(null);

    const userObj = JSON.parse(userStr);

    const initiale = userObj.initiale ??
      ((userObj.prenom?.[0] ?? '') + (userObj.nom?.[0] ?? '')).toUpperCase();

    const user: User = {
      id: userObj.id ?? '',
      prenom: userObj.prenom,
      nom: userObj.nom,
      role: userObj.role,
      initiale: initiale,
      email: userObj.email ?? '',
      club: userObj.club ?? '',
      joueurs: userObj.joueurs ?? [],
      membreDepuis: userObj.membreDepuis ? new Date(userObj.membreDepuis) : new Date(),
      equipe: userObj.equipe ?? '',
      photoURL: userObj.photoURL ?? ''
    };

    return of(user);
  }

  // ⚡ récupère tous les utilisateurs avec role = 'joueur'
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(u => u.role === 'joueur')) // filtre seulement les joueurs
    );
  }
}
