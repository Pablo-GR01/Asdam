import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { AbsentJ } from '../../../component/Joueur/page-Absent/absent-j/absent-j';
import { AbsentC } from '../../../component/Coach/page-Absents/absent-c/absent-c';

@Component({
  selector: 'app-absents-j',
  imports: [HeaderJ,AbsentC],
  templateUrl: './absents-j.html',
  styleUrl: './absents-j.css'
})
export class AbsentsJ {

}
