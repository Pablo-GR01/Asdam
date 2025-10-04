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
  joueurs: User[] = [];                    // Tous les joueurs filtrés
  utilisateurConnecte: User | null = null; // Coach connecté
  loading = true;

  // Pagination
  currentPage = 1;
  pageSize = 3;
  totalPages = 1;
  paginatedJoueurs: User[] = [];

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    // 1️⃣ Récupérer l'utilisateur connecté depuis le localStorage
    const userLocal = localStorage.getItem('utilisateur');
    if (userLocal) {
      this.utilisateurConnecte = JSON.parse(userLocal) as User;
    }

    // 2️⃣ Récupérer tous les utilisateurs
    this.userService.getJoueurs().subscribe({
      next: (data: User[]) => {

        if (this.utilisateurConnecte) {
          const equipeCoach = this.utilisateurConnecte.equipe; // ex: 'U23'

          // 3️⃣ Filtrer uniquement les joueurs avec la même équipe
          this.joueurs = data.filter(u =>
            u.role?.toLowerCase() === 'joueur' &&
            u.equipe === equipeCoach
          );
        } else {
          // Si aucun utilisateur connecté, afficher tous les joueurs
          this.joueurs = data.filter(u => u.role?.toLowerCase() === 'joueur');
        }

        // 4️⃣ Pagination
        this.totalPages = Math.ceil(this.joueurs.length / this.pageSize);
        this.setPage(this.currentPage);

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération joueurs', err);
        this.loading = false;
      }
    });
  }

  // Pagination
  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedJoueurs = this.joueurs.slice(start, end);
  }

  prevPage() {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }
}
