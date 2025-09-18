import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilisateur: any = null;

  constructor() {
    const data = localStorage.getItem('utilisateur');
    if (data) {
      this.utilisateur = JSON.parse(data);
    }
  }

  // 🔹 Sauvegarder l'utilisateur connecté
  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  // 🔹 Supprimer l'utilisateur
  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  // 🔹 Accès à l'utilisateur complet
  getUser() {
    return this.utilisateur;
  }

  // 🔹 Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.utilisateur;
  }

  // 🔹 Récupérer le rôle utilisateur
  getUserRole(): string {
    return this.utilisateur?.role?.trim().toLowerCase() || '';
  }
}
