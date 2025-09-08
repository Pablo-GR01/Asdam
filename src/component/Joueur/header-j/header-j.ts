import { Component, HostListener } from '@angular/core';
import { Icon } from "../../icon/icon";

@Component({
  selector: 'app-header-j',
  templateUrl: './header-j.html',
  styleUrls: ['./header-j.css'],
  imports: [Icon]
})
export class HeaderJ {
  mobileMenuOpen: boolean = false;
  notifCount: number = 5;    // notifications
  messageCount: number = 2;  // messages

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDropdown(id: string, event: Event) {
    event.stopPropagation();
    const menu = document.getElementById(id);
    if (!menu) return;

    document.querySelectorAll('[id$="Menu"]').forEach(m => {
      if (m.id !== id) m.classList.add('hidden');
    });

    menu.classList.toggle('hidden');

    // rotation flèche
    document.querySelectorAll('button span').forEach(arrow => arrow.classList.remove('rotate-180'));
    if (!menu.classList.contains('hidden')) {
      const btn = event.currentTarget as HTMLElement;
      btn.querySelector('span')?.classList.add('rotate-180');
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('nav')) {
      document.querySelectorAll('[id$="Menu"]').forEach(menu => menu.classList.add('hidden'));
      document.querySelectorAll('button span').forEach(arrow => arrow.classList.remove('rotate-180'));
    }
  }
}
