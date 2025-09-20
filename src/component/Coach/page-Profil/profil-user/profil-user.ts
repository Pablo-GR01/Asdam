import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';
import { CreerConvocationsC } from "../../Bouton/creer-convocations-c/creer-convocations-c";
import { CreerMatchC } from "../../Bouton/creer-match-c/creer-match-c";

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CreerConvocationsC, CreerMatchC],
  templateUrl: './profil-user.html',
  styleUrls: ['./profil-user.css']
})
export class ProfilUser implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';
  club = 'ASDAM';

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: User | null) => {
        if (data) {
          if (!data.initiale) {
            data.initiale = ((data.prenom?.[0] ?? '') + (data.nom?.[0] ?? '')).toUpperCase();
          }
          this.user = data;
        } else {
          this.error = 'Aucun utilisateur connecté';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Impossible de récupérer les informations';
        this.loading = false;
      }
    });
  }

  editProfile(): void {
    alert('Fonction de modification du profil à implémenter.');
  }

  openMessages(): void {
    alert('Ouvrir la messagerie (à implémenter).');
  }

  logout(): void {
    alert('Déconnexion (à implémenter).');
  }

  deleteProfile(): void {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !'
    );
    if (confirmed) {
      alert('Suppression du compte (à implémenter côté backend).');
    }
  }
}