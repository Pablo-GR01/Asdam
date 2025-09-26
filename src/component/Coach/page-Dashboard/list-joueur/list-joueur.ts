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
  utilisateurConnecte: User | null = null;
  loading = true;

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    // 🔹 Récupérer l'id de l'utilisateur connecté depuis le localStorage
    const userLocal = localStorage.getItem('utilisateur');
    const userId = userLocal ? JSON.parse(userLocal).id : null;

    // 🔹 Récupérer tous les joueurs
    this.userService.getJoueurs().subscribe({
      next: (data) => {
        this.joueurs = data.filter(user => user.role?.toLowerCase() === 'joueur');

        // 🔹 Trouver l'utilisateur connecté dans la liste
        if (userId) {
          this.utilisateurConnecte = this.joueurs.find(user => user.id === userId) || null;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération joueurs', err);
        this.loading = false;
      }
    });
  }
}
