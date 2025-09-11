import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface EventItem {
  id?: string;
  day: string;
  hour: string;
  title: string;
  coach: string;
  category: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-jour-c',
  templateUrl: './jour-c.html',
  styleUrls: ['./jour-c.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class JourC {
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  hours: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00','19:00','20:00','21:00'];
  categories: string[] = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23',
    'SeniorA','SeniorB','SeniorC','SeniorD'
  ];
  
  events: EventItem[] = [];

  // Popup
  showPopup = false;
  selectedDay: string | null = null;
  selectedHour: string | null = null;

  // Form
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  selectedFile: File | null = null;

  openForm(day: string, hour: string) {
    this.selectedDay = day;
    this.selectedHour = hour;
    this.showPopup = true;
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.selectedFile = null;
  }

  closePopup() {
    this.showPopup = false;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  addEvent() {
    if (!this.selectedDay || !this.selectedHour || !this.newEventTitle.trim()) return;

    const newEvent: EventItem = {
      day: this.selectedDay,
      hour: this.selectedHour,
      title: this.newEventTitle,
      coach: this.newEventCoach,
      category: this.newEventCategory,
      imageUrl: this.selectedFile ? URL.createObjectURL(this.selectedFile) : undefined
    };

    this.events.push(newEvent);
    this.closePopup();
  }

  deleteEvent(event: EventItem) {
    this.events = this.events.filter(e => e !== event);
  }

  getEventsByDayHour(day: string, hour: string) {
    return this.events.filter(e => e.day === day && e.hour === hour);
  }
}
