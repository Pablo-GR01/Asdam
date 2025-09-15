import { Component } from '@angular/core';
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
export class CreerMatchC {
  // ✅ Données du match avec champ supplémentaire "categorie"
  match: Match & { categorie: string } = { 
    equipeA: 'ASDAM',   // équipe par défaut
    equipeB: '', 
    date: '', 
    lieu: '',
    categorie: ''       
  };

  // ✅ Catégories disponibles
  categories: string[] = [
    'U6','U7','U8','U9','U10','U11','U12',
    'U13','U14','U15','U16','U17','U18','U23','Senior'
  ];

  // ✅ Champs dynamiques pour éviter répétition dans le HTML
  champs: { label: string; icon: string; model: keyof (Match & { categorie: string }); readonly?: boolean; type?: string }[] = [
    { label: 'Équipe A', icon: 'users', model: 'equipeA', readonly: true },
    { label: 'Équipe B', icon: 'users', model: 'equipeB' },
    { label: 'Date et heure', icon: 'calendar', model: 'date', type: 'datetime-local' },
    { label: 'Lieu', icon: 'map-pin', model: 'lieu' }
  ];
  
  // ✅ États du formulaire
  loading = false;
  successMsg = '';
  errorMsg = '';
  showModal = false;

  constructor(private matchService: MatchService) {}

  // ✅ Ouvrir et fermer la modal
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // ✅ Création du match
  creerMatch(): void {
    if (!this.match.equipeA || !this.match.equipeB || !this.match.date || !this.match.lieu || !this.match.categorie) {
      this.errorMsg = 'Tous les champs sont obligatoires';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    // ✅ Convertir date en ISO
    const matchToSend = { ...this.match, date: new Date(this.match.date).toISOString() };

    this.matchService.creerMatch(matchToSend).subscribe({
      next: () => {
        this.successMsg = 'Match créé avec succès !';
        this.loading = false;
        // ✅ Reset du formulaire
        this.match = { equipeA: 'ASDAM', equipeB: '', date: '', lieu: '', categorie: '' };
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur lors de la création du match';
        this.loading = false;
      }
    });
  }
}
