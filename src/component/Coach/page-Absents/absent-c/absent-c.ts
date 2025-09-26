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
  utilisateurConnecte?: any;

  // Jours d'entraînement par équipe
  joursEntrainement: { [equipe: string]: string[] } = {
    U23: ['Mercredi', 'Vendredi'],
    U18: ['Mardi', 'Jeudi'],
  };

  // Présence par joueur et par jour
  presenceParJour: { [joueurId: string]: { [jour: string]: boolean } } = {};

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.loadUtilisateurConnecte();
    this.loadJoueurs();
  }

  loadUtilisateurConnecte() {
    const session = localStorage.getItem('utilisateur');
    if (session) {
      this.utilisateurConnecte = JSON.parse(session);
      console.log('Utilisateur connecté :', this.utilisateurConnecte);
    }
  }

  loadJoueurs() {
    this.utilisateurService.getJoueurs().subscribe({
      next: (data) => {
        if (this.utilisateurConnecte?.equipe) {
          // Filtrer uniquement les joueurs de la même équipe
          this.joueurs = data.filter(j => j.equipe === this.utilisateurConnecte.equipe);
        } else {
          this.joueurs = [];
        }

        // Charger les présences sauvegardées si elles existent
        const savedPresence = localStorage.getItem('presenceParJour');
        if (savedPresence) {
          this.presenceParJour = JSON.parse(savedPresence);
        }

        // Initialiser la présence si pas encore définie
        this.joueurs.forEach(j => {
          const jours = this.joursEntrainement[j.equipe] || [];
          if (!this.presenceParJour[j.id]) {
            this.presenceParJour[j.id] = {};
          }
          jours.forEach(jour => {
            if (this.presenceParJour[j.id][jour] === undefined) {
              // Par défaut : présent
              this.presenceParJour[j.id][jour] = true;
            }
          });
        });

        console.log('Joueurs filtrés :', this.joueurs);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des joueurs', err);
      }
    });
  }

  getJours(equipe: string): string[] {
    return this.joursEntrainement[equipe] || [];
  }

  // Toggle présence pour un joueur spécifique et un jour spécifique
  togglePresence(joueurId: string, jour: string) {
    const role = this.utilisateurConnecte?.role;

    // Joueur peut modifier uniquement sa propre présence
    if (role === 'joueur' && joueurId !== this.utilisateurConnecte._id) {
      return; // interdit
    }

    // Coach/admin peuvent modifier tous les joueurs
    if (['coach', 'admin', 'superadmin'].includes(role) || joueurId === this.utilisateurConnecte._id) {
      this.presenceParJour[joueurId][jour] = !this.presenceParJour[joueurId][jour];
      this.savePresence(); // Sauvegarde après modification
    }
  }

  // Sauvegarde des présences
  savePresence() {
    localStorage.setItem('presenceParJour', JSON.stringify(this.presenceParJour));
  }

  // Compteur présents/absents pour un joueur
  getPresenceCount(joueurId: string) {
    const jours = this.presenceParJour[joueurId] || {};
    let present = 0;
    let absent = 0;
    Object.values(jours).forEach(val => {
      if (val) present++;
      else absent++;
    });
    return { present, absent };
  }

  // Groupement des joueurs par équipe
  getJoueursParEquipe(): { equipe: string, joueurs: User[] }[] {
    const groupes: { [key: string]: User[] } = {};
    this.joueurs.forEach(j => {
      const equipe = j.equipe || 'Non défini';
      if (!groupes[equipe]) groupes[equipe] = [];
      groupes[equipe].push(j);
    });
    return Object.keys(groupes).map(eq => ({ equipe: eq, joueurs: groupes[eq] }));
  }
}
