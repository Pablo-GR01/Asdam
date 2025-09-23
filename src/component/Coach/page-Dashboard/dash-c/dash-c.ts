import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';
import { JoueurService } from '../../../../../services/joueur.service';
import { ListJoueur } from "../list-joueur/list-joueur";

@Component({
  standalone: true,
  selector: 'app-dash-c',
  imports: [CommonModule, ListJoueur],
  templateUrl: './dash-c.html',
  styleUrls: ['./dash-c.css']
})
export class DashC implements OnInit {

  user: User = {
    id: '',
    prenom: '',
    nom: '',
    initiale: '',
    role: '',
    email: '',
    club: '',
    equipe: '',
    joueurs: [],
    membreDepuis: new Date()
  };

  joueurs: User[] = []; // tous les joueurs

  constructor(
    private utilisateurService: UtilisateurService,
    private joueurService: JoueurService
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté
    this.utilisateurService.getCurrentUser().subscribe(current => {
      if (current) {
        this.user = current;
        this.user.initiale = current.initiale || this.getInitials(current.nom, current.prenom);
      }
    });

    // Récupérer uniquement les joueurs
    this.joueurService.getJoueurs().subscribe(joueurs => {
      this.joueurs = joueurs;
    });
  }

  private getInitials(nom: string, prenom: string): string {
    const first = nom ? nom.charAt(0).toUpperCase() : '';
    const second = prenom ? prenom.charAt(0).toUpperCase() : '';
    return first + second;
  }
}
