import { Component } from '@angular/core';
import { MenuHamburger1 } from '../menu-Hamburger/menu-hamburger1/menu-hamburger1';
import { MenuHamburger2 } from '../menu-Hamburger/menu-hamburger2/menu-hamburger2';
import { Icon } from "../icon/icon";


@Component({
  selector: 'app-header',
  imports: [MenuHamburger1, MenuHamburger2, Icon],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
