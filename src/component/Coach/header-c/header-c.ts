// src/app/component/Coach/header-c/header-c.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../../services/userService/Profil.Service';
import { Icon } from '../../icon/icon';
import { EnteteC } from '../../Coach/page-Accueil/entete-c/entete-c';
import { MessageService } from '../../../../services/message.service';
import { UtilisateurService } from '../../../../services/userService/utilisateur.service';

// On autorise les initiales dans MenuItem
interface MenuItem {
  title: string;
  link: string;
  icon?: string;
  initiales?: string;
}

interface MobileMenu {
  title: string;
  icon?: string;
  link?: string;
  items: MenuItem[];
  initiales?: string;
}

@Component({
  selector: 'app-header-c',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon, EnteteC],
  templateUrl: './header-c.html',
  styleUrls: ['./header-c.css']
})
export class HeaderC implements OnInit {
  private _mobileMenuOpen = false;
  activeDropdown: string | null = null;
  isDarkMode = false;
  unreadMessages = 0;
  connectedUser: any = null;

  mobileMenus: MobileMenu[] = [];

  constructor(
    private router: Router,
    private userService: UtilisateurService,
    private messageService: MessageService,
    private userProfileService: ProfileService
  ) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    this.messageService.unreadCount$.subscribe(count => {
      this.unreadMessages = count;
    });
  }

  ngOnInit(): void {
    this.loadConnectedUser();
  }

  private loadConnectedUser(): void {
    const utilisateurStorage = localStorage.getItem('utilisateur');
    let initiales = '';
    if (!utilisateurStorage) {
      console.warn('Aucun utilisateur trouvé en localStorage.');
      this.buildMobileMenus(initiales);
      return;
    }

    const utilisateur = JSON.parse(utilisateurStorage);
    utilisateur.initiales = this.getInitiales(utilisateur.nom, utilisateur.prenom);
    this.connectedUser = utilisateur;
    initiales = utilisateur.initiales;

    const userId = utilisateur._id || utilisateur.id;
    if (!userId) {
      console.warn('⚠ Aucun ID trouvé pour l’utilisateur.');
      this.buildMobileMenus(initiales);
      return;
    }

    // Récupération utilisateur depuis l’API
    this.userService.getUserById(userId).subscribe({
      next: user => {
        this.connectedUser = user || utilisateur;
        this.connectedUser.initiales = this.getInitiales(this.connectedUser.nom, this.connectedUser.prenom);
        initiales = this.connectedUser.initiales;
        this.messageService.getUnreadCount(userId);
        this.buildMobileMenus(initiales);
      },
      error: err => {
        console.warn(`Impossible de charger l’utilisateur ${userId}`, err);
        this.connectedUser = utilisateur;
        this.messageService.getUnreadCount(userId);
        this.buildMobileMenus(initiales);
      }
    });
  }

  private buildMobileMenus(initiales: string): void {
    this.mobileMenus = [
      { title: 'Actualité', icon: 'fas fa-newspaper', link: '/actualiteC', items: [
        { title: 'Communiqués', link: '/actualiteC/communiquesC', icon: 'fas fa-bullhorn' },
        { title: 'Archives', link: '/actualiteC/archivesC', icon: 'fas fa-archive' }
      ] },
      { title: 'Match', icon: 'fas fa-futbol', link: '/matchC', items: [
        { title: 'Convocations', link: '/matchC/convocationsC', icon: 'fas fa-users' },
        { title: 'Résultats', link: '/matchC/resultatsC', icon: 'fas fa-trophy' },
      ] },
      { title: 'Planning', icon: 'fas fa-calendar-alt', link: '/PlanningC', items: [
        { title: 'Entraînements', link: '/planningC/entrainementsC', icon: 'fas fa-dumbbell' },
        { title: 'Événements', link: '/planningC/evenementsC', icon: 'fas fa-star' },
        { title: 'Stages', link: '/planningC/stagesC', icon: 'fas fa-graduation-cap' }
      ] },
      { title: 'Messages', icon: 'fas fa-envelope', link: '/messagesC', items: [] },
      { title: 'Absents', icon: 'fas fa-user-slash', link: '/absentsC', items: [] },
      { title: 'Dashboard', icon: 'fas fa-tachometer-alt', link: '/dashboardC', items: [
        { title: 'Mon Profil', link: '/dashboardC/profileC', initiales: initiales },
        { title: 'Paramètres', link: '/dashboardC/settingsC', icon: 'fas fa-cog' },
        { title: 'Déconnexion', link: '/connexion', icon: 'fas fa-sign-out-alt' }
      ] },
      { title: 'Déconnexion', icon: 'fas fa-sign-out-alt', link: '/connexion', items: [] }
    ];
  }

  get mobileMenuOpen(): boolean {
    return this._mobileMenuOpen;
  }

  set mobileMenuOpen(value: boolean) {
    this._mobileMenuOpen = value;
    document.body.style.overflow = value ? 'hidden' : '';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeDropdown(id: string): void {
    if (this.activeDropdown === id) this.activeDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('nav')) {
      this.activeDropdown = null;
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme(): void {
    const html = document.documentElement;
    if (this.isDarkMode) html.classList.add('dark');
    else html.classList.remove('dark');
  }

  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.userProfileService.clearProfile();
    this.router.navigate(['/connexion']);
  }

  private getInitiales(nom: string, prenom: string): string {
    const n = nom?.charAt(0) || '';
    const p = prenom?.charAt(0) || '';
    return (p + n).toUpperCase();
  }
}
