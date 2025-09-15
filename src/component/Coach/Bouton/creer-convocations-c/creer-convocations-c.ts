import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvocationService, Convocation } from '../../../../../services/convocation.service';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';

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
    lieu: ''
  };

  allJoueurs: User[] = [];       // tous les joueurs
  joueursEquipe: User[] = [];    // joueurs filtrés par équipe

  loading = false;
  successMsg = '';
  errorMsg = '';
  showModal = false;

  constructor(
    private convocationService: ConvocationService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    // Récupérer tous les joueurs de la base
    this.utilisateurService.getUsers().subscribe(users => {
      this.allJoueurs = users.filter(u => u.role === 'joueur');
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onEquipeChange(): void {
    if (this.convocation.equipe) {
      // Filtrer les joueurs selon l'équipe sélectionnée
      this.joueursEquipe = this.allJoueurs.filter(u => u.equipe === this.convocation.equipe);
      this.convocation.joueurs = []; // réinitialiser la sélection
    } else {
      this.joueursEquipe = [];
    }
  }

  creerConvocation(): void {
    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.convocationService.creerConvocation(this.convocation).subscribe({
      next: () => {
        this.successMsg = 'Convocation créée avec succès !';
        this.loading = false;
        this.convocation = { match: '', equipe: '', joueurs: [], date: new Date(), lieu: '' };
        this.joueursEquipe = [];
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
