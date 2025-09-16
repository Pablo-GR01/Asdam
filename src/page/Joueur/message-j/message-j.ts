import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { MMSJ } from '../../../component/Joueur/mmsj/mmsj';

@Component({
  selector: 'app-message-j',
  imports: [HeaderJ,MMSJ],
  templateUrl: './message-j.html',
  styleUrl: './message-j.css'
})
export class MessageJ {

}
