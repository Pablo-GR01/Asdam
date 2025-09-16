import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { MMSC } from "../../../component/Coach/mmsc/mmsc";

@Component({
  selector: 'app-message-c',
  imports: [HeaderC, MMSC],
  templateUrl: './message-c.html',
  styleUrl: './message-c.css'
})
export class MessageC {

}
