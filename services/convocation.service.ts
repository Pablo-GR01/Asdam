import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Convocation {
  match: string;
  joueurs: string[];       // tableau des joueurs
  equipe: string;
  date: Date | string;     // accepte Date ou string ISO
  lieu: string;
  joueursString?: string;  // utilisé pour le formulaire
}

@Injectable({ providedIn: 'root' })
export class ConvocationService {
  private apiUrl = 'http://localhost:3000/api/convocations';

  constructor(private http: HttpClient) {}

  creerConvocation(convocation: Convocation): Observable<Convocation> {
    // Crée une copie pour ne pas muter l'objet original
    const payload: Convocation = {
      ...convocation,
      joueurs: convocation.joueursString
        ? convocation.joueursString.split(',').map(j => j.trim())
        : convocation.joueurs,
      date: convocation.date instanceof Date
        ? convocation.date.toISOString()
        : convocation.date
    };

    return this.http.post<Convocation>(this.apiUrl, payload);
  }
}
