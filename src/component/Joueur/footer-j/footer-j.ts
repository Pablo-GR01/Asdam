import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-j',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer-j.html',
  styleUrls: ['./footer-j.css']
})
export class FooterJ {
  currentYear = new Date().getFullYear();
}
