import { Component } from '@angular/core';
import { BarreJ } from '../../../component/Joueur/barre-j/barre-j';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { Sections2 } from "../../../component/Coach/page-Accueil/sections2/sections2";
import { FooterJ } from '../../../component/footer-j/footer-j';
import { Sections1 } from '../../../component/Joueur/sections1/sections1';


@Component({
  selector: 'app-acceuil-j',
  imports: [BarreJ, HttpClientModule, CommonModule, Sections1, Sections2,FooterJ],
  standalone: true,
  templateUrl: './acceuil-j.html',
  styleUrl: './acceuil-j.css'
})
export class AcceuilJ {

}
