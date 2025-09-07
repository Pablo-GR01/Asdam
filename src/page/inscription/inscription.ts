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
  equipe?: string;
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
  readonly CODE_COACH = 'COACH2025';
  readonly CODE_JOUEUR = 'JOUEUR2025';

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

  equipes: string[] = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18',
    'SeniorA','SeniorB','U23','SeniorC','SeniorD'
  ];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  activerJoueur(): void {
    this.actif = 'joueur';
    this.inscriptionData.role = 'joueur';
    this.inscriptionData.codeCoach = '';
  }

  activerCoach(): void {
    this.actif = 'coach';
    this.inscriptionData.role = 'coach';
    this.inscriptionData.codeJoueur = '';
  }

  activerInviter(): void {
    this.actif = 'inviter';
    this.inscriptionData.role = 'inviter';
    this.inscriptionData.codeCoach = '';
    this.inscriptionData.codeJoueur = '';
    this.inscriptionData.equipe = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  formulaireValide(): boolean {
    const { nom, prenom, email, password, role, codeCoach, codeJoueur, equipe } = this.inscriptionData;

    if (!nom || !prenom) return false;
    if (!this.isEmailValid(email)) return false;
    if (!password || password.length < 6) return false;

    if (role === 'coach' && codeCoach !== this.CODE_COACH) return false;
    if (role === 'joueur' && codeJoueur !== this.CODE_JOUEUR) return false;

    if ((role === 'coach' || role === 'joueur') && !equipe) return false;

    if (!this.cguAccepte) return false;

    return true;
  }

  onCguChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.cguAccepte = checkbox.checked;
    this.inscriptionData.cguValide = checkbox.checked;
  }

  valider(): void {
    this.formSubmitted = true;
  
    if (!this.formulaireValide()) return;
  
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
  
    console.log('Payload envoyé à l’API :', payload);
  
    this.http.post('http://localhost:3000/api/users', payload).subscribe({
      next: (res: any) => {
        this.message = `Bienvenue sur Asdam !`;
        this.authService.setUser(res);
  
        // 🔄 Redirection selon le rôle
        const redirection =
          payload.role === 'coach'   ? '/accueilC' :
          payload.role === 'admin'   ? '/accueilA' :
          payload.role === 'joueur'  ? '/accueilJ' :
          payload.role === 'inviter' ? '/accueilI' :
          '/'; // fallback par défaut (par ex. page d’accueil)
  
        setTimeout(() => this.router.navigate([redirection]), 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        this.message = '⚠️ Erreur lors de la création du compte.';
      }
    });
  }
  
}
