import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../../services/userService/Profil.Service';
import { ConvocationService } from '../../../../services/convocation.service';
import { Icon } from '../../icon/icon';
import { EnteteC } from '../../Coach/page-Accueil/entete-c/entete-c';

interface MenuItem {
  title: string;
  link: string;
  icon: string;
  count?: number; // compteur optionnel
}

interface MobileMenu {
  title: string;
  icon: string;
  link?: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-header-j',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon, EnteteC],
  templateUrl: './header-j.html',
  styleUrls: ['./header-j.css']
})
export class HeaderJ implements OnInit {
  private _mobileMenuOpen = false;
  activeDropdown: string | null = null;
  isDarkMode = false;

  mobileMenus: MobileMenu[] = [
    {
      title: 'Actualité',
      icon: 'fas fa-newspaper',
      link: '/actualiteC',
      items: [
        { title: 'Dernières news', link: '/actualiteC/newsJ', icon: 'fas fa-bolt' },
        { title: 'Communiqués', link: '/actualiteC/communiquesJ', icon: 'fas fa-bullhorn' },
        { title: 'Archives', link: '/actualiteC/archivesJ', icon: 'fas fa-archive' }
      ]
    },
    {
      title: 'Match',
      icon: 'fas fa-futbol',
      link: '/matchC',
      items: [
        { title: 'Convocations', link: '/matchJ/convocationsJ', icon: 'fas fa-users', count: 0 },
        { title: 'Résultats', link: '/matchJ/resultatsJ', icon: 'fas fa-trophy' },
        { title: 'Calendrier', link: '/matchJ/calendrierJ', icon: 'fas fa-calendar-check' }
      ]
    },
    {
      title: 'Planning',
      icon: 'fas fa-calendar-alt',
      link: '/PlanningJ',
      items: [
        { title: 'Entraînements', link: '/planningJ/entrainementsJ', icon: 'fas fa-dumbbell' },
        { title: 'Événements', link: '/planningJ/evenementsJ', icon: 'fas fa-star' },
        { title: 'Stages', link: '/planningJ/stagesJ', icon: 'fas fa-graduation-cap' }
      ]
    },
    {
      title: 'Notifications',
      icon: 'fas fa-bell',
      link: '/notificationsJ',
      items: [
        { title: 'Messages', link: '/notificationsJ/messagesJ', icon: 'fas fa-envelope' },
        { title: 'Alertes', link: '/notificationsJ/alertesJ', icon: 'fas fa-exclamation-triangle' }
      ]
    },
    {
      title: 'Stats',
      icon: 'fas fa-chart-line',
      link: '/statsJ',
      items: [
        { title: 'Joueurs', link: '/statsJ/joueursJ', icon: 'fas fa-user-friends' },
        { title: 'Matchs', link: '/statsJ/matchsJ', icon: 'fas fa-futbol' },
        { title: 'Performances', link: '/statsJ/performancesJ', icon: 'fas fa-bolt' }
      ]
    },
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      link: '/dashboardJ',
      items: [
        { title: 'Mon Profil', link: '/dashboardJ/profileJ', icon: 'fas fa-user' },
        { title: 'Paramètres', link: '/dashboardJ/settingsJ', icon: 'fas fa-cog' },
        { title: 'Déconnexion', link: '/connexion', icon: 'fas fa-sign-out-alt' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private userprofile: ProfileService,
    private convService: ConvocationService
  ) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
  }

  convocationsMenuItem?: MenuItem;

ngOnInit(): void {
  const username = this.userprofile.getUsername(); // récupère le nom de l'utilisateur connecté
  if (username) {
    this.convService.getConvocationsByUser(username).subscribe(convocations => {
      // Trouver l'item Convocations dans le menu Match
      const matchMenu = this.mobileMenus.find(menu => menu.title === 'Match');
      if (matchMenu) {
        const convItem = matchMenu.items.find(item => item.title === 'Convocations');
        if (convItem) {
          // Vérifie si l'utilisateur est dans au moins une convocation
          const userInConv = convocations.some(conv => 
            conv.joueurs.some(j => j.nom === username)
          );
          convItem.count = userInConv ? 1 : 0;
          this.convocationsMenuItem = convItem; // ⚡ pour le template
        }
      }
    });
  }
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
    this.userprofile.clearProfile();
    this.router.navigate(['/connexion']);
  }
}
