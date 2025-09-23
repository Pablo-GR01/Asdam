import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';

@Component({
  standalone: true,
  selector: 'app-list-joueur',
  imports: [CommonModule],
  templateUrl: './list-joueur.html',
  styleUrls: ['./list-joueur.css']
})
export class ListJoueur implements OnInit {
  joueurs: User[] = [];
  loading = true;

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    this.userService.getJoueurs().subscribe({
      next: (data) => {
        // 🔹 Filtrer uniquement les utilisateurs avec role 'joueur'
        this.joueurs = data.filter(user => user.role?.toLowerCase() === 'joueur');
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération joueurs', err);
        this.loading = false;
      }
    });
  }
}
