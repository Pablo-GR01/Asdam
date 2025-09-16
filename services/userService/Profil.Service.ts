import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './Auth.Service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  // 🔹 Récupérer l’utilisateur connecté depuis AuthService
  getUser(): any {
    return this.authService.getUser();
  }

  setUser(user: any): void {
    this.authService.setUser(user);
  }

  getInitiales(): string {
    const user = this.getUser();
    if (!user) return 'IN';
    const prenomInitiale = user.prenom?.charAt(0).toUpperCase() || '';
    const nomInitiale = user.nom?.charAt(0).toUpperCase() || '';
    return prenomInitiale + nomInitiale;
  }

  getNomComplet(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || 'invité';
  }

  clearProfile(): void {
    this.authService.setUser(null);
  }

  getUsername(): string | null {
    const user = this.getUser();
    return user?.nom || null;
  }

  deleteAccount(): void {
    this.clearProfile();
    console.log('Compte et données utilisateur supprimés définitivement.');
  }

  getAllJoueurs(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/users'); 
  }
  
}
