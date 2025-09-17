import { Component } from '@angular/core';
import { ActusC } from '../../../component/Coach/actus-c/actus-c';
import { HeaderC } from "../../../component/Coach/header-c/header-c";

@Component({
  selector: 'app-actualite-c',
  imports: [ActusC, HeaderC],
  templateUrl: './actualite-c.html',
  styleUrl: './actualite-c.css'
})
export class ActualiteC {

}
