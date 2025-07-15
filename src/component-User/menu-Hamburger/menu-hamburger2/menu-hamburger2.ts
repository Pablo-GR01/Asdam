import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';          
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-menu-hamburger2',
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './menu-hamburger2.html',
  styleUrl: './menu-hamburger2.css'
})
export class MenuHamburger2 implements OnInit {
  userNom = '';
  userPrenom = '';
  userInitiales = '';
  userColor = '';
  isOpen = false; // ✅ Ajout de la propriété manquante

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{nom: string, prenom: string}>('http://localhost:3000/api/utilisateur-connecte')
      .subscribe({
        next: user => {
          this.userNom = user.nom;
          this.userPrenom = user.prenom;
          this.userInitiales = this.getInitiales(this.userNom, this.userPrenom);

          const savedColor = localStorage.getItem('userColor');
          if (savedColor) {
            this.userColor = savedColor;
          } else {
            this.userColor = this.getRandomColor();
            localStorage.setItem('userColor', this.userColor);
          }
        },
        error: err => {
          console.error('Erreur récupération utilisateur', err);
          this.userNom = 'Inconnu';
          this.userPrenom = '';
          this.userInitiales = '??';
          this.userColor = '#999999';
        }
      });
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.charAt(0).toUpperCase() || '') + (prenom?.charAt(0).toUpperCase() || '');
  }

  getRandomColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}