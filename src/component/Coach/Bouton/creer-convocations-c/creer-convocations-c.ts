import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvocationService, Convocation, User } from '../../../../../services/convocation.service';
import { UtilisateurService } from '../../../../../services/userService/utilisateur.service';

@Component({
  selector: 'app-creer-convocations-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-convocations-c.html',
  styleUrls: ['./creer-convocations-c.css']
})
export class CreerConvocationsC implements OnInit {
  equipes: string[] = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23'];

  convocation: Convocation = {
    match: '',
    equipe: '',
    joueurs: [],
    date: new Date(),
    lieu: '',
  };

  allJoueurs: User[] = [];
  joueursEquipe: (User & { action?: string })[] = [];
  composeJoueurs: (User & { action?: string })[] = [];

  showModal = false;
  showComposeModal = false;
  hideMainBtn = false;
  hideComposeBtn = false;

  loading = false;
  successMsg = '';
  errorMsg = '';

  maxJoueurs = 5;

  compositionEnCours = false;
  compositionFinalisee = false;

  constructor(
    private convocationService: ConvocationService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.utilisateurService.getUsers().subscribe(users => {
      this.allJoueurs = users.filter(u => u.role === 'joueur');
    });
  }

  // --- Modal principale ---
  openModal(): void {
    this.showModal = true;
    this.hideMainBtn = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showComposeModal = false;
    this.hideMainBtn = false;
    this.hideComposeBtn = false;
    this.composeJoueurs = [];
    this.joueursEquipe.forEach(j => j.action = undefined);
  }

  onEquipeChange(): void {
    if (this.convocation.equipe) {
      this.joueursEquipe = this.allJoueurs
        .filter(u => u.equipe === this.convocation.equipe)
        .map(j => ({ ...j, action: undefined }));
      this.composeJoueurs = [];
      this.convocation.joueurs = [];
    } else {
      this.joueursEquipe = [];
      this.composeJoueurs = [];
    }
  }

  // --- Modal sélection joueurs ---
  openComposeModal(): void {
    this.showComposeModal = true;
    this.hideComposeBtn = true;
    this.composeJoueurs = [...this.convocation.joueurs];
    // Marque les joueurs déjà sélectionnés
    this.joueursEquipe.forEach(j => {
      j.action = this.composeJoueurs.find(u => u._id === j._id) ? 'ajoute' : undefined;
    });
  }

  closeComposeModal(): void {
    this.showComposeModal = false;
    this.hideComposeBtn = false;
    this.compositionEnCours = false;
    this.compositionFinalisee = false;
  }

  // --- Gestion joueurs ---
  ajouterJoueur(user: User & { action?: string }): void {
    if (this.composeJoueurs.find(u => u._id === user._id)) return;
    if (this.composeJoueurs.length >= this.maxJoueurs) return;
    user.action = 'ajoute';
    this.composeJoueurs.push(user);
  }

  retirerJoueur(user: User & { action?: string }): void {
    user.action = 'retire';
    this.composeJoueurs = this.composeJoueurs.filter(u => u._id !== user._id);
  }

  isJoueurCompose(joueur: User & { action?: string }): boolean {
    return !!this.composeJoueurs.find(j => j._id === joueur._id);
  }

  // --- Validation composition ---
  validerCompose(): void {
    if (this.composeJoueurs.length === 0) return;
    if (this.composeJoueurs.length > this.maxJoueurs) return;

    this.compositionEnCours = true;
    setTimeout(() => {
      this.convocation.joueurs = [...this.composeJoueurs];
      this.compositionFinalisee = true;
      this.closeComposeModal();
    }, 600);
  }

  // --- Création convocation ---
  creerConvocation(): void {
    if (this.convocation.joueurs.length === 0) {
      this.errorMsg = 'Veuillez sélectionner au moins un joueur';
      setTimeout(() => this.errorMsg = '', 3000);
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.convocationService.creerConvocation(this.convocation).subscribe({
      next: () => {
        this.successMsg = 'Convocation créée avec succès !';
        this.loading = false;
        this.convocation = { match: '', equipe: '', joueurs: [], date: new Date(), lieu: '' };
        this.joueursEquipe = [];
        this.composeJoueurs = [];
        this.closeModal();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {
        this.errorMsg = 'Erreur lors de la création';
        this.loading = false;
        setTimeout(() => this.errorMsg = '', 3000);
      }
    });
  }

  // ----- Helpers -----
  getInitiale(user: User): string {
    return (user.prenom?.charAt(0) + user.nom?.charAt(0)).toUpperCase();
  }
}
