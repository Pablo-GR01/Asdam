import { Component } from '@angular/core';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { JourJ } from '../../../component/Joueur/jour-j/jour-j';



@Component({
  selector: 'app-planning-j',
  imports: [HeaderJ,JourJ],
  templateUrl: './planning-j.html',
  styleUrl: './planning-j.css'
})
export class PlanningJ {

}
