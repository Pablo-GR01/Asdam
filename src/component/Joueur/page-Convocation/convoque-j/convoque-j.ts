import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvocationService, Convocation, User } from '../../../../../services/convocation.service';

@Component({
  selector: 'app-convoque-j',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convoque-j.html',
  styleUrls: ['./convoque-j.css']
})
export class ConvoqueJ implements OnInit {

  convocations: Convocation[] = [];           // Toutes les convocations
  userInConvocations: Convocation[] = [];     // Convocations filtrées pour l'utilisateur
  loading: boolean = false;
  error: string = '';
  userConnecte: User | null = null;          // Utilisateur connecté

  constructor(private convocationService: ConvocationService) {}

  ngOnInit(): void {
    this.recupererUtilisateur();
    this.chargerConvocations();
  }

  // Récupère l'utilisateur connecté depuis le localStorage
  private recupererUtilisateur(): void {
    const userJson = localStorage.getItem('utilisateur');
    if (userJson) {
      try {
        this.userConnecte = JSON.parse(userJson) as User;
        console.log('Utilisateur connecté :', this.userConnecte);
      } catch (e) {
        console.error('Erreur parsing utilisateur depuis localStorage', e);
        this.userConnecte = null;
      }
    }
  }

  // Charge toutes les convocations et filtre celles de l'utilisateur
  private chargerConvocations(): void {
    this.loading = true;
    this.convocationService.getConvocations().subscribe({
      next: (data: Convocation[]) => {
        this.convocations = data;

        if (this.userConnecte) {
          this.userInConvocations = this.convocations.filter(conv =>
            conv.joueurs.some(j => j.nom === this.userConnecte!.nom && j.prenom === this.userConnecte!.prenom)
          );
        } else {
          this.userInConvocations = [];
        }

        this.loading = false;
        console.log('Convocations de l’utilisateur :', this.userInConvocations);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des convocations', err);
        this.error = 'Impossible de récupérer les convocations.';
        this.loading = false;
      }
    });
  }

  // Vérifie si l'utilisateur connecté est dans la convocation
  isUserInConvocation(conv: Convocation): boolean {
    if (!this.userConnecte) return false;
    return conv.joueurs.some(j => j.nom === this.userConnecte!.nom && j.prenom === this.userConnecte!.prenom);
  }

  // Transforme la liste des joueurs en tableau de chaînes "Prénom Nom"
  getJoueursStr(conv: Convocation): string {
    return conv.joueurs?.map(j => `${j.prenom} ${j.nom}`).join(', ') || '';
  }

  // Initiales du premier joueur (ou de l'utilisateur connecté si premier)
  getInitiales(conv: Convocation): string {
    const joueur = conv.joueurs[0];
    if (!joueur) return '';
    return ((joueur.prenom?.charAt(0) || '') + (joueur.nom?.charAt(0) || '')).toUpperCase();
  }
}
