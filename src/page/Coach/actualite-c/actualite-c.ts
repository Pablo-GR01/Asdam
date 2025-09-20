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

  

  onScroll(event: any) {
    const element = event.target as HTMLElement;

    const atTop = element.scrollTop <= 0;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight;

    if (atTop) {
      element.scrollTop = 0; // bloque en haut
    }

    if (atBottom) {
      element.scrollTop = element.scrollHeight - element.clientHeight; // bloque en bas
    }
  }
}
