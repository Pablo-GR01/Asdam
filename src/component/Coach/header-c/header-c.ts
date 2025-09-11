import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../icon/icon';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header-c',
  imports: [Icon, CommonModule, RouterLink],
  templateUrl: './header-c.html',
  styleUrl: './header-c.css'
})
export class HeaderC {
  mobileMenuOpen = false;
  notifCount = 1;
  messageCount = 2;
  activeDropdown: string | null = null;  // ← variable Angular propre

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeDropdown(id: string): void {
    if (this.activeDropdown === id) {
      this.activeDropdown = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('nav')) {
      this.activeDropdown = null;
    }
  }
}
