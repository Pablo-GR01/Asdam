import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { TableauC } from "../../../component/Coach/tableau-c/tableau-c";

@Component({
  selector: 'app-absents-c',
  imports: [HeaderC, TableauC],
  templateUrl: './absents-c.html',
  styleUrl: './absents-c.css'
})
export class AbsentsC {

}
