import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvocationService, Convocation, User } from '../../../../../services/convocation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-convoque-j',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './convoque-j.html',
  styleUrls: ['./convoque-j.css']
})
export class ConvoqueJ implements OnInit {

  convocations: Convocation[] = [];           // Toutes les convocations
  userInConvocations: Convocation[] = [];     // Convocations filtrées pour l'utilisateur
  loading: boolean = false;
  error: string = '';
  userConnecte: User | null = null;           // Utilisateur connecté
  backendUrl = 'http://localhost:3000';       // <-- Met ici l'URL de ton backend

  constructor(
    private convocationService: ConvocationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('--- ngOnInit ---');
    this.recupererUtilisateur();
    this.chargerConvocations();
  }

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
    } else {
      console.warn('Pas d\'utilisateur trouvé dans localStorage');
    }
  }

  private chargerConvocations(): void {
    this.loading = true;
    console.log('Chargement des convocations...');
    this.convocationService.getConvocations().subscribe({
      next: (data: Convocation[]) => {
        this.convocations = data;
        console.log('Toutes les convocations :', this.convocations);

        if (this.userConnecte) {
          if (this.userConnecte.role === 'coach') {
            this.userInConvocations = this.convocations.filter(conv =>
              conv.equipe === this.userConnecte!.equipe
            );
          } else {
            this.userInConvocations = this.convocations.filter(conv =>
              conv.joueurs.some(j => j.nom === this.userConnecte!.nom && j.prenom === this.userConnecte!.prenom)
            );
          }
        } else {
          this.userInConvocations = [];
        }

        this.loading = false;
        console.log('Convocations filtrées pour l’utilisateur :', this.userInConvocations);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des convocations', err);
        this.error = 'Impossible de récupérer les convocations.';
        this.loading = false;
      }
    });
  }

  isUserInConvocation(conv: Convocation): boolean {
    if (!this.userConnecte) return false;

    if (this.userConnecte.role === 'coach') {
      return conv.equipe === this.userConnecte.equipe;
    }

    return conv.joueurs.some(j => j.nom === this.userConnecte!.nom && j.prenom === this.userConnecte!.prenom);
  }

  getJoueursStr(conv: Convocation): string {
    return conv.joueurs?.map(j => `${j.prenom} ${j.nom}`).join(', ') || '';
  }

  getInitiales(conv: Convocation): string {
    const joueur = conv.joueurs[0];
    if (!joueur) return '';
    return ((joueur.prenom?.charAt(0) || '') + (joueur.nom?.charAt(0) || '')).toUpperCase();
  }

  updatePresence(conv: Convocation, joueur: User, present: boolean) {
    console.log('--- updatePresence appelé ---');
    console.log('Convocation :', conv);
    console.log('Joueur :', joueur);
    console.log('Présent :', present);

    if (!conv._id || !joueur._id) {
      console.warn('ID manquant, sortie');
      return;
    }

    // 1️⃣ Mise à jour de la présence dans la DB
    this.convocationService.updatePresence(conv._id, joueur._id, present).subscribe({
      next: (res) => {
        console.log('Mise à jour DB réussie', res);

        const targetIndex = conv.joueurs.findIndex(j => j._id === joueur._id);
        if (targetIndex !== -1) {
          const updatedJoueur: User = {
            ...conv.joueurs[targetIndex],
            etatPresence: present ? 'present' : 'absent'
          };
          conv.joueurs = [
            ...conv.joueurs.slice(0, targetIndex),
            updatedJoueur,
            ...conv.joueurs.slice(targetIndex + 1)
          ];
          console.log('Joueur mis à jour localement :', updatedJoueur);
        }

        // 2️⃣ Envoi du mail au coach
        if (conv.mailCoach) {
          console.log('Envoi du mail au coach à :', conv.mailCoach);
          this.http.post(`${this.backendUrl}/api/confirmation`, {
            prenom: joueur.prenom,
            nom: joueur.nom,
            mailCoach: conv.mailCoach,
            match: conv.match,
            date: conv.date,
            lieu: conv.lieu,
            present: present
          }).subscribe({
            next: (mailRes) => console.log('Mail envoyé au coach ✅', mailRes),
            error: (err) => console.error('Erreur envoi mail au coach', err)
          });
        } else {
          console.warn('Pas d\'email coach dans la convocation');
        }
      },
      error: (err) => console.error('Erreur mise à jour présence', err)
    });
  }

}
