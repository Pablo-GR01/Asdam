import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { EnteteC } from "../../../component/Coach/page-Accueil/entete-c/entete-c";

@Component({
  selector: 'app-acceuil-c',
  imports: [HeaderC, EnteteC],
  templateUrl: './acceuil-c.html',
  styleUrl: './acceuil-c.css'
})
export class AcceuilC {

}
