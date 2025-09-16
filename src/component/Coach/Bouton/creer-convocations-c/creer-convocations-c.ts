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
    joueurs: [], // ⚡ tableau d'objets User
    date: new Date(),
    lieu: ''
  };

  allJoueurs: User[] = [];
  joueursEquipe: User[] = [];
  composeJoueurs: User[] = [];

  showModal = false;
  showComposeModal = false;
  hideMainBtn = false;
  hideComposeBtn = false;

  loading = false;
  successMsg = '';
  errorMsg = '';

  maxJoueurs = 5;

  constructor(
    private convocationService: ConvocationService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.utilisateurService.getUsers().subscribe(users => {
      this.allJoueurs = users.filter(u => u.role === 'joueur');
    });
  }

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
  }

  onEquipeChange(): void {
    if (this.convocation.equipe) {
      this.joueursEquipe = this.allJoueurs.filter(u => u.equipe === this.convocation.equipe);
      this.composeJoueurs = [];
      this.convocation.joueurs = [];
    } else {
      this.joueursEquipe = [];
      this.composeJoueurs = [];
    }
  }

  openComposeModal(): void {
    this.showComposeModal = true;
    this.hideComposeBtn = true;
    this.composeJoueurs = [...this.convocation.joueurs];
  }

  closeComposeModal(): void {
    this.showComposeModal = false;
    this.hideComposeBtn = false;
  }

  ajouterJoueur(user: User): void {
    if (this.composeJoueurs.find(u => u._id === user._id)) return;
    if (this.composeJoueurs.length >= this.maxJoueurs) {
      alert(`Vous ne pouvez sélectionner que ${this.maxJoueurs} joueurs`);
      return;
    }
    this.composeJoueurs.push(user);
  }

  retirerJoueur(user: User): void {
    this.composeJoueurs = this.composeJoueurs.filter(u => u._id !== user._id);
  }

  validerCompose(): void {
    if (this.composeJoueurs.length === 0) {
      alert('Vous devez sélectionner au moins un joueur');
      return;
    }
    if (this.composeJoueurs.length > this.maxJoueurs) {
      alert(`Vous ne pouvez sélectionner que ${this.maxJoueurs} joueurs`);
      return;
    }
    this.convocation.joueurs = [...this.composeJoueurs]; // ✅ garder les objets User
    this.closeComposeModal();
  }

  creerConvocation(): void {
    if (this.convocation.joueurs.length === 0) {
      alert('Vous devez convoquer au moins un joueur');
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
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur lors de la création de la convocation';
        this.loading = false;
      }
    });
  }
}
