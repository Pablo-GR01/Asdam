import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProfileService } from '../../../../services/userService/Profil.Service';

interface Joueur {
  id: string;
  nom: string;
  prenom?: string;
  statut: 'présent' | 'absent';
  date: string; // yyyy-mm-dd
  categorie: 'U23' | 'SeniorA' | 'SeniorB' | 'SeniorC' | 'SeniorD';
}

@Component({
  selector: 'app-tableau-c',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './tableau-c.html',
  styleUrls: ['./tableau-c.css']
})
export class TableauC implements OnInit {
  joueurs: Joueur[] = [];
  joursSemaine = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

  // Attribution des jours d'entraînement par catégorie
  entrainementParCategorie: Record<string, string[]> = {
    U23: ['Mercredi','Vendredi'],
    SeniorA: ['Mardi','Jeudi'],
    SeniorB: ['Mercredi','Vendredi'],
    SeniorC: ['Mercredi','Vendredi'],
    SeniorD: ['Mercredi','Vendredi']
  };

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    const data = localStorage.getItem('joueursAbsents');
    if (data) {
      this.joueurs = JSON.parse(data);
      this.verifierDates();
    } else {
      this.profileService.getAllJoueurs().subscribe({
        next: (users) => {
          this.joueurs = users.map((user) => {
            // Déterminer la catégorie selon l'équipe
            let categorie: Joueur['categorie'] = 'U23';
            if (user.equipe === 'SeniorA') categorie = 'SeniorA';
            else if (user.equipe === 'SeniorB') categorie = 'SeniorB';
            else if (user.equipe === 'SeniorC') categorie = 'SeniorC';
            else if (user.equipe === 'SeniorD') categorie = 'SeniorD';

            return {
              id: user._id,
              nom: user.nom,
              prenom: user.prenom,
              statut: 'présent', // par défaut
              date: this.getToday(),
              categorie
            };
          });
          this.sauvegarder();
        },
        error: (err) => console.error('Erreur récupération joueurs', err)
      });
    }
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  changerStatut(joueur: Joueur) {
    // On ne filtre plus selon le jour, on peut changer n'importe quand
    joueur.statut = joueur.statut === 'présent' ? 'absent' : 'présent';
    joueur.date = this.getToday();
    this.sauvegarder();
  }

  sauvegarder() {
    localStorage.setItem('joueursAbsents', JSON.stringify(this.joueurs));
  }

  verifierDates() {
    const today = this.getToday();
    let updated = false;
    this.joueurs.forEach(j => {
      if (j.date < today) {
        j.statut = 'présent';
        j.date = today;
        updated = true;
      }
    });
    if (updated) this.sauvegarder();
  }
}
