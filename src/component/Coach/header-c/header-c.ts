// src/app/component/Coach/header-c/header-c.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../../services/userService/Profil.Service';
import { Icon } from '../../icon/icon';
import { EnteteC } from '../../Coach/page-Accueil/entete-c/entete-c';
import { MessageService } from '../../../../services/message.service';
import { UtilisateurService } from '../../../../services/userService/utilisateur.service';

interface MenuItem {
  title: string;
  link: string;
  icon: string;
}

interface MobileMenu {
  title: string;
  icon: string;
  link?: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-header-c',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon, EnteteC],
  templateUrl: './header-c.html',
  styleUrls: ['./header-c.css']
})
export class HeaderC {
  private _mobileMenuOpen = false;
  activeDropdown: string | null = null;
  isDarkMode = false;
  unreadMessages = 0; // compteur de messages non lus
  connectedUser: any = null; // informations complètes de l'utilisateur

  mobileMenus: MobileMenu[] = [
    {
      title: 'Actualité',
      icon: 'fas fa-newspaper',
      link: '/actualiteC',
      items: [
        { title: 'Communiqués', link: '/actualiteC/communiquesC', icon: 'fas fa-bullhorn' },
        { title: 'Archives', link: '/actualiteC/archivesC', icon: 'fas fa-archive' }
      ]
    },
    {
      title: 'Match',
      icon: 'fas fa-futbol',
      link: '/matchC',
      items: [
        { title: 'Convocations', link: '/matchC/convocationsC', icon: 'fas fa-users' },
        { title: 'Résultats', link: '/matchC/resultatsC', icon: 'fas fa-trophy' },
        { title: 'Calendrier', link: '/matchC/calendrierC', icon: 'fas fa-calendar-check' }
      ]
    },
    {
      title: 'Planning',
      icon: 'fas fa-calendar-alt',
      link: '/PlanningC',
      items: [
        { title: 'Entraînements', link: '/planningC/entrainementsC', icon: 'fas fa-dumbbell' },
        { title: 'Événements', link: '/planningC/evenementsC', icon: 'fas fa-star' },
        { title: 'Stages', link: '/planningC/stagesC', icon: 'fas fa-graduation-cap' }
      ]
    },
    {
      title: 'Messages',
      icon: 'fas fa-envelope',
      link: '/messagesC',
      items: []
    },
    {
      title: 'Absents',
      icon: 'fas fa-user-slash',
      link: '/absentsC',
      items: [],
    },
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      link: '/dashboardC',
      items: [
        { title: 'Mon Profil', link: '/dashboardC/profileC', icon: 'fas fa-user' },
        { title: 'Paramètres', link: '/dashboardC/settingsC', icon: 'fas fa-cog' },
        { title: 'Déconnexion', link: '/connexion', icon: 'fas fa-sign-out-alt' }
      ]
    },
    {
      title: 'Déconnexion',
      icon: 'fas fa-sign-out-alt',
      link: '/connexion',
      items: [],
    }
  ];

  constructor(
    private router: Router,
    private userService: UtilisateurService,
    private messageService: MessageService,
    private userProfileService: ProfileService,
  ) {
    // Dark mode
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();

    // Initialiser le compteur de messages non lus
    this.messageService.unreadCount$.subscribe(count => {
      this.unreadMessages = count;
    });

    // Récupérer l'utilisateur connecté depuis le localStorage
    const utilisateurStorage = localStorage.getItem('utilisateur');
    if (utilisateurStorage) {
      const utilisateur = JSON.parse(utilisateurStorage); // parser le JSON
      this.connectedUser = utilisateur; // récupérer directement les infos locales

      // Si tu veux aussi récupérer des infos depuis l'API avec l'id
      this.userService.getUserById(utilisateur._id).subscribe({
        next: user => {
          this.connectedUser = user; // mise à jour avec les infos à jour
          this.messageService.getUnreadCount(utilisateur._id);
        },
        error: err => console.error('Erreur récupération utilisateur :', err)
      });
    }

  }

  // Getter/Setter pour mobile menu
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
}
