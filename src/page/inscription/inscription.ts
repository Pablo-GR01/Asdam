import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from '../../component/icon/icon';
import { AuthService } from '../../../services/userService/Auth.Service';

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  codeCoach?: string;
  codeJoueur?: string;
  equipe: string;
  role: 'joueur' | 'coach' | 'inviter' | 'admin';
  initiale?: string;
  cguValide: boolean;
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Icon, RouterLink],
  templateUrl: './inscription.html',
})
export class Inscription implements OnInit, OnDestroy {
  actif: 'joueur' | 'coach' | 'inviter' | 'admin' = 'joueur';
  etape: 1 | 2 = 1;
  readonly CODE_COACH = 'COACH2025';
  readonly CODE_JOUEUR = 'JOUEUR2025';

  equipes: string[] = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23',
    'SeniorA','SeniorB','SeniorC','SeniorD'
  ];

  inscriptionData: InscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    codeCoach: '',
    codeJoueur: '',
    equipe: '',
    role: 'joueur',
    initiale: '',
    cguValide: false,
  };

  passwordVisible = false;
  formSubmitted = false;
  message: string | null = null;
  cguAccepte = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void { document.body.style.overflow = 'hidden'; }
  ngOnDestroy(): void { document.body.style.overflow = 'auto'; }

  // 🔹 Gestion profils
  activerJoueur(): void {
    this.actif = 'joueur';
    this.inscriptionData.role = 'joueur';
    this.inscriptionData.codeCoach = '';
    if (!this.inscriptionData.equipe) this.inscriptionData.equipe = this.equipes[0];
  }

  activerCoach(): void {
    this.actif = 'coach';
    this.inscriptionData.role = 'coach';
    this.inscriptionData.codeJoueur = '';
    if (!this.inscriptionData.equipe) this.inscriptionData.equipe = this.equipes[0];
  }

  activerInviter(): void {
    this.actif = 'inviter';
    this.inscriptionData.role = 'inviter';
    this.inscriptionData.codeCoach = '';
    this.inscriptionData.codeJoueur = '';
    this.inscriptionData.equipe = '';
  }

  togglePasswordVisibility(): void { this.passwordVisible = !this.passwordVisible; }

  // 🔹 Validation email
  isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // 🔹 Validation étape 1
  etape1Valide(): boolean {
    return !!this.inscriptionData.nom &&
           !!this.inscriptionData.prenom &&
           this.isEmailValid(this.inscriptionData.email) &&
           !!this.inscriptionData.password &&
           this.inscriptionData.password.length >= 6;
  }

  // 🔹 Validation étape 2
  etape2Valide(): boolean {
    if ((this.actif === 'coach' && this.inscriptionData.codeCoach !== this.CODE_COACH) ||
        (this.actif === 'joueur' && this.inscriptionData.codeJoueur !== this.CODE_JOUEUR)) {
      return false;
    }
    if ((this.actif === 'coach' || this.actif === 'joueur') && !this.inscriptionData.equipe) {
      return false;
    }
    return this.cguAccepte;
  }

  // 🔹 Navigation étapes
  etapeSuivante(): void {
    if (this.etape1Valide()) {
      this.etape = 2;
    } else {
      alert('Veuillez remplir correctement tous les champs obligatoires.');
    }
  }

  etapePrecedente(): void { this.etape = 1; }

  // 🔹 Soumission formulaire
  valider(): void {
    if (!this.etape2Valide()) {
      alert('Veuillez remplir correctement tous les champs obligatoires et accepter les CGU.');
      return;
    }

    const initiale =
      (this.inscriptionData.prenom[0] ?? '').toUpperCase() +
      (this.inscriptionData.nom[0] ?? '').toUpperCase();

    const payload: InscriptionData = {
      ...this.inscriptionData,
      initiale,
      cguValide: this.cguAccepte,
    };

    if (payload.role !== 'coach') delete payload.codeCoach;
    if (payload.role !== 'joueur') delete payload.codeJoueur;

    this.http.post('http://localhost:3000/api/users', payload).subscribe({
      next: (res: any) => {
        this.message = `Bienvenue sur Asdam !`;
        this.authService.setUser(res);

        const redirection =
          payload.role === 'coach'   ? '/accueilC' :
          payload.role === 'admin'   ? '/accueilA' :
          payload.role === 'joueur'  ? '/accueilJ' :
          payload.role === 'inviter' ? '/accueilI' :
          '/';

        setTimeout(() => this.router.navigate([redirection]), 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        this.message = '⚠️ Erreur lors de la création du compte.';
      }
    });
  }
}
