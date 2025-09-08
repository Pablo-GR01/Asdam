import { Component } from '@angular/core';
import { Section1J } from '../../../component-page/Joueur/page-accueil/section1-j/section1-j';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";

@Component({
  selector: 'app-acceuil-j',
  imports: [Section1J, HeaderJ],
  templateUrl: './acceuil-j.html',
  styleUrl: './acceuil-j.css'
})
export class AcceuilJ {

}
