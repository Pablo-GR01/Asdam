import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sections2',
  templateUrl: './sections2.html',
  styleUrls: ['./sections2.css'],
  imports:[FormsModule,CommonModule],
})
export class Sections2 {
  showModal = false; // contrôle l'ouverture/fermeture du modal

  features = [
    { title: 'Créer un match', description: 'Planifiez et gérez facilement vos matchs.' },
    { title: 'Créer une convocation', description: 'Envoyez des convocations aux joueurs en quelques clics.' },
    { title: 'Créer un événement', description: 'Organisez vos événements et suivez la participation.' },
    { title: 'Discussion privée', description: 'Communiquez directement avec vos joueurs ou staff.' }
  ];
}
