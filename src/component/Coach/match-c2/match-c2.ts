import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-c2',
  templateUrl: './match-c2.html',
  styleUrls: ['./match-c2.css'],
  imports: [FormsModule, CommonModule],
})
export class MatchC2 implements OnInit {

  showFormMatch = false;
  showFormConvocation = false;
  showPopupJoueurs = false;

  equipes = ["ASDAM", "Bavillier", "PSG", "Real Madrid"];
  categories = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18',
    'SeniorA','SeniorB','U23','SeniorC','SeniorD'
  ];

  match = { nom: '', date: '', equipePrincipale: 'ASDAM', equipeAdverse: '' };
  convocation = { equipe: 'ASDAM', categorie: '', matchNom: '', joueursStr: '', date: '', description: '' };

  joueursDisponibles: any[] = []; // {prenom, nom, _id, selected}
  joueursSelectionnes: any[] = [];

  private BACKEND_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadJoueurs();
  }

  // ---------------- Toggle formulaires ----------------
  ouvrirFormMatch() { this.showFormMatch = !this.showFormMatch; }
  ouvrirFormConvocation() { 
    this.showFormConvocation = !this.showFormConvocation; 
    if (this.showFormConvocation) this.loadJoueurs();
  }

  // ---------------- Création Match ----------------
  creerMatch() {
    if (!this.match.equipeAdverse || !this.match.date) { 
      alert("Veuillez remplir toutes les informations du match."); 
      return; 
    }

    const payload = {
      nom: `${this.match.equipePrincipale} vs ${this.match.equipeAdverse}`,
      date: this.match.date,
      equipe: this.match.equipePrincipale
    };

    this.http.post(`${this.BACKEND_URL}/match`, payload).subscribe({
      next: () => { 
        alert('Match créé !'); 
        this.match = { nom: '', date: '', equipePrincipale: 'ASDAM', equipeAdverse: '' };
      },
      error: err => { console.error(err); alert('Erreur lors de la création du match'); }
    });
  }

  // ---------------- Gestion équipes/catégories ----------------
  onEquipeChange() { this.loadJoueurs(); }
  onCategorieChange() { this.loadJoueurs(); }

  // ---------------- Charger les joueurs filtrés ----------------
  loadJoueurs() {
    if (!this.convocation.equipe || !this.convocation.categorie) {
      this.joueursDisponibles = [];
      return;
    }

    this.http.get<any[]>(`${this.BACKEND_URL}/utilisateurs`).subscribe({
      next: res => {
        this.joueursDisponibles = res
          .filter(u => u.role === 'joueur' &&
                       u.equipe === this.convocation.equipe &&
                       u.categorie === this.convocation.categorie)
          .map(u => ({
            ...u,
            selected: this.joueursSelectionnes.some(js => js._id === u._id)
          }));
      },
      error: err => console.error('Erreur récupération joueurs :', err)
    });
  }

  // ---------------- Popup joueurs ----------------
  ouvrirPopupJoueurs() { this.showPopupJoueurs = true; }
  fermerPopup() { this.showPopupJoueurs = false; }

  ajouterJoueur(joueur: any) {
    if (!this.joueursSelectionnes.some(j => j._id === joueur._id)) {
      this.joueursSelectionnes.push(joueur);
      joueur.selected = true;
      this.updateJoueursStr();
    }
  }

  retirerJoueur(joueur: any) {
    this.joueursSelectionnes = this.joueursSelectionnes.filter(j => j._id !== joueur._id);
    joueur.selected = false;
    this.updateJoueursStr();
  }

  updateJoueursStr() {
    this.convocation.joueursStr = this.joueursSelectionnes.map(j => j.prenom + ' ' + j.nom).join(', ');
  }

  // ---------------- Création Convocation ----------------
  creerConvocation() {
    if (!this.convocation.categorie || !this.convocation.matchNom || !this.convocation.date || !this.convocation.joueursStr) {
      alert("Veuillez remplir toutes les informations de la convocation.");
      return;
    }

    const joueursArray = this.joueursSelectionnes.map(j => j._id);

    const payload = {
      equipe: this.convocation.equipe,
      categorie: this.convocation.categorie,
      matchNom: this.convocation.matchNom,
      joueurs: joueursArray,
      date: this.convocation.date,
      description: this.convocation.description
    };

    this.http.post(`${this.BACKEND_URL}/convocation`, payload).subscribe({
      next: () => { 
        alert('Convocation créée !'); 
        this.convocation = { equipe: 'ASDAM', categorie: '', matchNom: '', joueursStr: '', date: '', description: '' };
        this.joueursSelectionnes = [];
        this.joueursDisponibles = [];
      },
      error: err => { console.error(err); alert('Erreur lors de la création de la convocation'); }
    });
  }
}
