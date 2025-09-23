// src/app/component/Coach/page-Absents/absent-c.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';
@Component({
  selector: 'app-absent-c',
  templateUrl: './absent-c.html',
  styleUrls: ['./absent-c.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class AbsentC implements OnInit {
  joueurs: User[] = [];

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.loadJoueurs();
  }

  loadJoueurs() {
    this.utilisateurService.getJoueurs().subscribe({
      next: (data) => {
        this.joueurs = data;
        console.log('Joueurs récupérés :', this.joueurs);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des joueurs', err);
      }
    });
  }
}
