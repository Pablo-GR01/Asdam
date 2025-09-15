import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';


@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [CommonModule],
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
          // Calcul automatique des initiales si absentes
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

  deleteProfile(): void {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !'
    );
    if (confirmed) {
      alert('Suppression du compte (à implémenter côté backend).');
    }
  }
}
