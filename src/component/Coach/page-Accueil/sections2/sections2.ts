import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sections2',
  templateUrl: './sections2.html',
  styleUrls: ['./sections2.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class Sections2 implements OnInit {

  // Gère quelle carte est ouverte
  activeFeatureIndex: number | null = null;

  features = [
    { 
      title: 'Convocations simplifiées', 
      description: 'Envoyez des convocations aux joueurs rapidement et suivez leur réponse. Plus de détails sur le processus, modèles, rappels automatiques et statistiques d’acceptation.',
      icon: 'fa-solid fa-envelope'  // ✉️ Exemple
    },
    { 
      title: 'Gestion des événements', 
      description: 'Créez, planifiez et gérez vos événements internes ou externes. Vous pouvez gérer la liste des participants, envoyer des notifications et visualiser la participation en temps réel.',
      icon: 'fa-solid fa-calendar-days'  // 📅 Exemple
    },
    { 
      title: 'Suivi des joueurs', 
      description: 'Visualisez les performances et la disponibilité de vos joueurs. Historique des matchs, statistiques individuelles et suivi des absences pour optimiser vos entraînements.',
      icon: 'fa-solid fa-users'  // 👥 Exemple
    },
    { 
      title: 'Discussion Privée', 
      description: 'Envoyez des messages privés à vos joueurs ou collègues du staff. Suivez les conversations et restez connecté avec votre équipe en toute simplicité.',
      icon: 'fa-solid fa-comments'  // 💬 Icône adaptée aux messages
    }    
  ];

  currentUser: any = null;

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  openFeature(index: number) {
    this.activeFeatureIndex = index;
  }

  closeFeature() {
    this.activeFeatureIndex = null;
  }
}
