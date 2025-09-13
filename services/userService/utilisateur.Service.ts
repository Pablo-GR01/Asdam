import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  prenom: string;
  nom: string;
  role: string;
  initiale: string;
  email: string;
  club: string;
  joueurs: any[];          // tableau de joueurs
  membreDepuis: Date;       // date d'inscription
  equipe: string;           // équipe de l'utilisateur
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor() {}

  // Récupère l'utilisateur actuellement connecté depuis localStorage
  getCurrentUser(): Observable<User | null> {
    const userStr = localStorage.getItem('user');
    if (!userStr) return of(null);

    const userObj = JSON.parse(userStr);

    // Calculer les initiales si elles ne sont pas présentes
    const initiale = userObj.initiale ??
      ((userObj.prenom?.[0] ?? '') + (userObj.nom?.[0] ?? '')).toUpperCase();

    const user: User = {
      prenom: userObj.prenom,
      nom: userObj.nom,
      role: userObj.role,
      initiale: initiale,
      email: userObj.email ?? '',
      club: userObj.club ?? '',
      joueurs: userObj.joueurs ?? [],
      membreDepuis: userObj.membreDepuis ? new Date(userObj.membreDepuis) : new Date(),
      equipe: userObj.equipe ?? ''  // récupéré depuis la base ou vide si non défini
    };

    return of(user);
  }
}
