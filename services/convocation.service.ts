import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/userService/Auth.Service'; 

export interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email?: string;
  equipe?: string;
  role?: string;
}

export interface Convocation {
  match: string;
  equipe: string;
  joueurs: User[];
  date: Date | string;
  lieu: string;
  statut?: 'en attente' | 'confirmé' | 'annulé';
  mailCoach?: string; // <-- ajout du mail du coach
}



@Injectable({
  providedIn: 'root'
})
export class ConvocationService {
  private apiUrl = 'http://localhost:3000/api/convocations';
  private usersUrl = 'http://localhost:3000/api/utilisateurs';

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {}

  creerConvocation(convocation: Convocation): Observable<Convocation> {
    const mailCoach = this.authService.getUser()?.email; // <-- récupère le mail du coach
    const payload = {
      ...convocation,
      joueurs: convocation.joueurs.map(j => ({ _id: j._id, nom: j.nom, prenom: j.prenom })),
      date: convocation.date instanceof Date ? convocation.date.toISOString() : convocation.date,
      mailCoach // <-- ajout au payload
    };
    return this.http.post<Convocation>(this.apiUrl, payload);
  }
  

  // Récupérer toutes les convocations
  getConvocations(): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(this.apiUrl);
  }

  // Récupérer uniquement les joueurs
  getJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map(users => users.filter(u => u.role === 'joueur'))
    );
  }

  // ✅ Convocation du joueur connecté seulement
  getMaConvocation(): Observable<Convocation | null> {
    return this.http.get<Convocation>(`${this.apiUrl}/moi`);
  }
}
