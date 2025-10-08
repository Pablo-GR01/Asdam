import { Component } from '@angular/core';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { JourJ } from '../../../component/Joueur/jour-j/jour-j';
import { JourC } from "../../../component/Coach/page-planning/jour-c/jour-c";
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";



@Component({
  selector: 'app-planning-j',
  imports: [HeaderJ, JourJ, JourC, FooterJ],
  templateUrl: './planning-j.html',
  styleUrl: './planning-j.css'
})
export class PlanningJ {

}
