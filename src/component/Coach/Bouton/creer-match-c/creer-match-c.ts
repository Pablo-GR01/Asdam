import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, MatchService } from '../../../../../services/match.service';

@Component({
  selector: 'app-creer-match-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-match-c.html',
  styleUrls: ['./creer-match-c.css']
})
export class CreerMatchC implements OnInit {

  // Match avec logos et durée
  match: Match & { categorie: string; logoA?: string; logoB?: string; duree?: number } = {
    equipeA: 'ASDAM',
    equipeB: '',
    date: '',
    lieu: '',
    categorie: '',
    logoA: 'assets/ASDAM.png',
    logoB: '',
    duree: 90
  };

  // Catégories
  categories: string[] = [
    'U6','U7','U8','U9','U10','U11','U12',
    'U13','U14','U15','U16','U17','U18','U23','Senior'
  ];

  // Logos de toutes les équipes
  logos: Record<string, string> = {
    'ASDAM': 'assets/ASDAM.png',
    'FCSM': 'assets/FCSM.png',
    'OM': 'assets/OM.png',
    'PSG': 'assets/PSG.png',
    'OL': 'assets/OL.png',
    'MHSC': 'assets/MHSC.png'
    // Ajouter d'autres équipes et logos ici
  };

  // Liste des équipes adverses
  equipesAdverses: string[] = Object.keys(this.logos).filter(club => club !== 'ASDAM');

  // États
  loading = false;
  successMsg = '';
  errorMsg = '';
  showModal = false;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.updateLogos();
  }

  // Ouvre/ferme la modal
  openModal(): void { this.showModal = true; }
  closeModal(): void { this.showModal = false; }

  // Création du match
  creerMatch(): void {
    if (!this.match.equipeA || !this.match.equipeB || !this.match.date || !this.match.lieu || !this.match.categorie) {
      this.errorMsg = 'Tous les champs sont obligatoires';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.updateLogos(); // Met à jour les logos avant envoi

    const matchToSend = {
      ...this.match,
      date: new Date(this.match.date).toISOString(),
      duree: 90,
      logoA: this.match.logoA,
      logoB: this.match.logoB
    };

    this.matchService.creerMatch(matchToSend).subscribe({
      next: () => {
        this.successMsg = 'Match créé avec succès !';
        this.loading = false;

        // Reset formulaire
        this.match = {
          equipeA: 'ASDAM',
          equipeB: '',
          date: '',
          lieu: '',
          categorie: '',
          logoA: 'assets/ASDAM.png',
          logoB: '',
          duree: 90
        };

        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur lors de la création du match';
        this.loading = false;
      }
    });
  }

  // Met à jour les logos des équipes
  updateLogos(): void {
    this.match.logoA = this.logos[this.match.equipeA] || 'assets/ASDAM.png';
    this.match.logoB = this.match.equipeB ? this.logos[this.match.equipeB] || '' : '';
  }
}
