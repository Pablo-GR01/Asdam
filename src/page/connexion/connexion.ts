import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']
})
export class Connexion{
  selectedRole: 'Joueur' | 'Coach' | 'Admin' = 'Joueur';

  form = {
    email: '',
    password: '',
    code: ''
  };

  selectRole(role: 'Joueur' | 'Coach' | 'Admin') {
    this.selectedRole = role;
    if (role === 'Joueur') {
      this.form.code = '';
    }
  }

  onSubmit() {
    const dataToSend = {
      ...this.form,
      role: this.selectedRole
    };
    console.log('📤 Données soumises :', dataToSend);
  }
}
