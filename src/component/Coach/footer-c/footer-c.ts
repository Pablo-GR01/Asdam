import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer-c',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './footer-c.html',
  styleUrls: ['./footer-c.css']
})
export class FooterC {
  currentYear = new Date().getFullYear();

  navLinks = [
    { path: '/accueilC', label: 'Accueil' },
    { path: '/actualiteC', label: 'Actualités' },
    { path: '/absentC', label: 'Absents' },
    { path: '/message', label: 'Message' }
  ];

  // Icônes Font Awesome
  socialIcons = [
    { name: 'Facebook', url: '#', icon: faFacebookF },
    { name: 'Instagram', url: '#', icon: faInstagram },
    { name: 'Twitter', url: '#', icon: faTwitter }
  ];
}
