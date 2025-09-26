import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';
import { CreerConvocationsC } from "../../Bouton/creer-convocations-c/creer-convocations-c";
import { CreerMatchC } from "../../Bouton/creer-match-c/creer-match-c";
import { Router } from '@angular/router';

type Toast = { message: string; type: 'success' | 'error' };

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
  toast: Toast | null = null;

  constructor(private userService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUtilisateurConnecte();
    
  }
  



  loadUtilisateurConnecte() {
    const session = localStorage.getItem('utilisateur');
    if (session) {
      this.user = JSON.parse(session) as User;
  
      // Génération des initiales si elles n'existent pas
      if (this.user && !this.user.initiale) {
        this.user.initiale = ((this.user.prenom?.[0] ?? '') + (this.user.nom?.[0] ?? '')).toUpperCase();
      }
  
      // ✅ Affichage dans la console
      console.log('Utilisateur connecté :', this.user.prenom, this.user.nom, this.user);
    } else {
      this.error = 'Aucun utilisateur connecté';
      console.log('Aucun utilisateur connecté');
    }
    this.loading = false;
  }
  

  editProfile(): void {
    this.showToast('Fonction de modification du profil à implémenter.', 'success');
  }

  openMessages(): void {
    this.showToast('Ouverture de la messagerie (à implémenter).', 'success');
  }

  logout(): void {
    localStorage.removeItem('utilisateur');
    this.showToast('Déconnexion effectuée.', 'success');
    this.user = null;
    // Redirige vers la page de connexion
    this.router.navigate(['/connexion']);
  }

  deleteProfile(): void {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !'
    );
    if (confirmed) {
      // Ici tu appelleras ton backend pour supprimer le compte
      this.showToast('Suppression du compte à implémenter côté backend.', 'error');
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }


  
}
