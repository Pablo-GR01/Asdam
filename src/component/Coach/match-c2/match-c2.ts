import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-match-c2',
  standalone: true,
  templateUrl: './match-c2.html',
  styleUrls: ['./match-c2.css'],
  imports: [CommonModule, HttpClientModule],
})
export class MatchC2 implements OnInit {
  matches: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMatches();
  }

  getMatches() {
    this.http.get<any[]>('http://localhost:3000/api/matches')
      .subscribe({
        next: (data) => {
          this.matches = data;
        },
        error: (err) => {
          console.error('Erreur récupération matchs:', err);
        }
      });
  }
}
