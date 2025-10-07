import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
  minute: number; // minute actuelle du match
}

@Component({
  selector: 'app-match-vue-c',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DatePipe],
  templateUrl: './match-vue-c.html',
  styleUrls: ['./match-vue-c.css']
})
export class MatchVueC implements OnInit {
  matches: Match[] = [];
  loading = true; // ✅ État de chargement pour contrôler l’affichage

  logos: Record<string, string> = {
    'ASDAM': 'assets/ASDAM.png',
    'FCSM': 'assets/FCSM.png',
    'PSG': 'assets/PSG.png',
    'OM': 'assets/OM.png',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMatches();
  }

  getMatches(): void {
    this.http.get<Match[]>('http://localhost:3000/api/matches').subscribe({
      next: (data) => {
        this.matches = data.map(match => ({
          ...match,
          logoA: this.logos[match.equipeA] || 'assets/default.png',
          logoB: this.logos[match.equipeB] || 'assets/default.png',
          duree: match.duree || 90
        }));
        this.loading = false; // ✅ Dès qu’on a les données, on affiche tout
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des matchs :', err);
        this.loading = false;
      }
    });
  }

  getTimeLeft(match: Match): string {
    if (!match.date || !match.duree) return '';
    const start = new Date(match.date).getTime();
    const end = start + match.duree * 60 * 1000;
    const now = Date.now();
    const diff = end - now;

    if (diff <= 0) return 'Match terminé';
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return `${min} min ${sec} restantes`;
  }
}
