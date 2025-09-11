import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { JourC } from '../../../component/Coach/jour-c/jour-c';


@Component({
  selector: 'app-planning-c',
  imports: [HeaderC, JourC],
  templateUrl: './planning-c.html',
  styleUrl: './planning-c.css'
})
export class PlanningC {

}
