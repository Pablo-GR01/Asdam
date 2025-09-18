import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
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

  private apiUrl = 'http://localhost:3000/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());

  constructor(private http: HttpClient) {}

  // 🔹 Récupère l'utilisateur depuis localStorage
  private getUserFromLocalStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    const userObj = JSON.parse(userStr);
    const initiale = userObj.initiale ??
      ((userObj.prenom?.[0] ?? '') + (userObj.nom?.[0] ?? '')).toUpperCase();

    return {
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
  }

  // 🔹 Observable pour suivre l'utilisateur connecté
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // 🔹 Retourne une fois l'utilisateur (comme avant)
  getCurrentUser(): Observable<User | null> {
    return of(this.currentUserSubject.value);
  }

  // 🔹 Met à jour l'utilisateur connecté
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // 🔹 Déconnexion
  clearCurrentUser() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // ⚡ récupère tous les utilisateurs avec role = 'joueur'
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(u => u.role === 'joueur'))
    );
  }
}
