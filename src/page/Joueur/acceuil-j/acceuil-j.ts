import { Component } from '@angular/core';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { BarreJ } from '../../../component/Joueur/barre-j/barre-j';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Section1 } from "../../../component/Joueur/section1/section1";

@Component({
  selector: 'app-acceuil-j',
  imports: [HeaderJ, BarreJ, HttpClientModule, CommonModule, Section1],
  standalone: true,
  templateUrl: './acceuil-j.html',
  styleUrl: './acceuil-j.css'
})
export class AcceuilJ {

}
