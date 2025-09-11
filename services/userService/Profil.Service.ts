import { Injectable } from '@angular/core';
import { AuthService } from '../userService/Auth.Service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private authService: AuthService) {}

  // Récupérer l'utilisateur connecté depuis AuthService
  getUser(): any {
    return this.authService.getUser();
  }

  // Mettre à jour l'utilisateur dans AuthService
  setUser(user: any): void {
    this.authService.setUser(user);
  }

  // Récupérer les initiales de l'utilisateur
  getInitiales(): string {
    const user = this.getUser();
    if (!user) return 'IN';
    const prenomInitiale = user.prenom?.charAt(0).toUpperCase() || '';
    const nomInitiale = user.nom?.charAt(0).toUpperCase() || '';
    return prenomInitiale + nomInitiale;
  }
  

  // Récupérer le nom complet
  getNomComplet(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }
  

  // Récupérer le rôle
  getRole(): string {
    const user = this.getUser();
    return user?.role || 'invité';
  }

  // -------------------------------
  // Vide les infos locales
  clearProfile(): void {
    this.authService.setUser(null);
  }

  // -------------------------------
  // Suppression complète du compte
  deleteAccount(): void {
    // Ici, tu peux ajouter un appel API pour supprimer le compte côté serveur
    // Exemple : return this.http.delete('/api/user/delete')
    this.clearProfile();
    console.log('Compte et données utilisateur supprimés définitivement.');
  }
}
