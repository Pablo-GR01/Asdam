import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer-c',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './footer-c.html',
  styleUrls: ['./footer-c.css']
})
export class FooterC {
  currentYear: number = new Date().getFullYear();

  navLinks = [
    { path: '/accueilC', label: 'Accueil' },
    { path: '/actualiteC', label: 'Actualités' },
    { path: '/absentC', label: 'Absents' },
    { path: '/message', label: 'Message' }
  ];

  ressources = [
    { path: '/planningC', label: 'Planning' },
    { path: '/dashboardC', label: 'Convocations' },
    { path: '/dashboardC', label: 'Liste Joueurs' },
    { path: '/matchC', label: 'Match' }
  ];

  socialIcons = [
    { name: 'Facebook', url: 'https://facebook.com', icon: faFacebookF },
    { name: 'Instagram', url: 'https://instagram.com', icon: faInstagram },
    { name: 'Twitter', url: 'https://twitter.com', icon: faTwitter }
  ];

  faShieldHalved = faShieldHalved;
  faArrowRight = faArrowRight;

  user = {
    nom: '',
    prenom: ''
  };

  constructor() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      this.user.nom = userObj.nom || '';
      this.user.prenom = userObj.prenom || '';
    }
  }
}
