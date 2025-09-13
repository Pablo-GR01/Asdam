import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../../services/userService/Profil.Service';
import { Icon } from '../../icon/icon';

interface MenuItem {
  title: string;
  link: string;
}

interface MobileMenu {
  title: string;
  icon: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-header-c',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './header-c.html',
  styleUrls: ['./header-c.css']
})
export class HeaderC {
  mobileMenuOpen = false;
  notifCount = 1;
  messageCount = 2;
  activeDropdown: string | null = null;
  isDarkMode = false;

  // Menu mobile dynamique
  mobileMenus: MobileMenu[] = [
    {
      title: 'Actualité',
      icon: 'fas fa-newspaper',
      items: [
        { title: 'Dernières news', link: '/actualite/news' },
        { title: 'Communiqués', link: '/actualite/communiques' }
      ]
    },
    {
      title: 'Match',
      icon: 'fas fa-futbol',
      items: [
        { title: 'Convocations', link: '/match/convocations' },
        { title: 'Résultats', link: '/match/resultats' },
        { title: 'Calendrier', link: '/match/calendrier' }
      ]
    },
    {
      title: 'Planning',
      icon: 'fas fa-calendar-alt',
      items: [
        { title: 'Entraînements', link: '/planning/entrainements' },
        { title: 'Événements', link: '/planning/evenements' }
      ]
    },
    {
      title: 'Notifications',
      icon: 'fas fa-bell',
      items: [
        { title: 'Messages', link: '/notifications/messages' },
        { title: 'Alertes', link: '/notifications/alertes' }
      ]
    },
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      items: [
        { title: 'Mon Profil', link: '/dashboard/profile' },
        { title: 'Paramètres', link: '/dashboard/settings' },
        { title: 'Déconnexion', link: '/logout' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private userprofile: ProfileService
  ) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeDropdown(id: string): void {
    if (this.activeDropdown === id) this.activeDropdown = null;
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('nav')) {
      this.activeDropdown = null;
    }
  }

  deconnecter(): void {
    localStorage.removeItem('token');
    this.userprofile.clearProfile();
    this.router.navigate(['/connexion']);
  }
}
