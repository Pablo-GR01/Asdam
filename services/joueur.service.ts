import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Joueur {
  id: string;
  nom: string;
  prenom?: string;
  statut: 'présent' | 'absent';
  date: string;
  categorie: 'U23' | 'SeniorA' | 'SeniorB' | 'SeniorC' | 'SeniorD';
}

@Injectable({
  providedIn: 'root'
})
export class JoueurService {
  private apiUrl = 'http://localhost:3000/api/users/joueurs';

  constructor(private http: HttpClient) {}

  // Récupérer tous les joueurs
  getAllJoueurs(): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(this.apiUrl);
  }

  // Mettre à jour le statut d'un joueur
  updateStatut(joueurId: string, statut: 'présent' | 'absent', date: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${joueurId}`, { statut, date });
  }
}
