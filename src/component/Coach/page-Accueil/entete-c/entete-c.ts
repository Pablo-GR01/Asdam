import { Component, OnInit } from '@angular/core';
import { User, UtilisateurService } from '../../../../../services/userService/utilisateur.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';

// ⚡️ Enregistrer la locale française ici, en dehors de la classe
registerLocaleData(localeFr);

@Component({
  selector: 'app-entete-c',
  templateUrl: './entete-c.html',
  styleUrls: ['./entete-c.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class EnteteC implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;
  clubName: string = 'ASDAM'; // tu peux remplacer par une valeur dynamique si besoin

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
        } else {
          this.error = 'Aucun utilisateur connecté';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Erreur :", err);
        this.loading = false;
      }
    });
  }

  getInitials(): string {
    if (!this.user) return '';
    return this.user.initiale;
  }
}
