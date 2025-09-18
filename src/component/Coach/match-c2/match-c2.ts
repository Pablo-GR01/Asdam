import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Match {
  equipeA: string;
  equipeB: string;
  date: string;
  lieu: string;
  categorie: string;
  scoreA?: number;
  scoreB?: number;
  logoA?: string;
  logoB?: string;
  duree?: number;
}

@Component({
  selector: 'app-match-c2',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './match-c2.html',
  styleUrls: ['./match-c2.css'],
})
export class MatchC2 implements OnInit {
  matches: Match[] = [];
  logos: Record<string, string> = {
    'ASDAM': 'assets/ASDAM.png',
    'FCSM': 'assets/FCSM.png',
    // Ajouter ici les autres équipes et logos
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMatches();
  }

  getMatches() {
    this.http.get<Match[]>('http://localhost:3000/api/matches')
      .subscribe({
        next: (data) => {
          this.matches = data.map(match => ({
            ...match,
            logoA: this.logos[match.equipeA] || 'assets/default.png',
            logoB: this.logos[match.equipeB] || '',
            duree: match.duree || 90
          }));
        },
        error: (err) => console.error('Erreur récupération matchs:', err)
      });
  }

  // Fonction pour calculer le temps restant
  getTimeLeft(match: Match): string {
    if (!match.date || !match.duree) return '';
    const start = new Date(match.date).getTime();
    const end = start + (match.duree * 60 * 1000);
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return 'Match terminé';
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return `${min} min ${sec} sec restantes`;
  }
}
