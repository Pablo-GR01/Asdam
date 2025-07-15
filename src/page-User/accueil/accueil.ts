import { Component } from '@angular/core';
import { Header } from "../../component-User/header/header";
import { Section1 } from "../../Section-User/section1/section1";


@Component({
  selector: 'app-accueil',
  imports: [Header, Section1],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil {

}
