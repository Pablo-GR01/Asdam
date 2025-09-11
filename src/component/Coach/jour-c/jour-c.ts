import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

interface EventItem {
  _id?: string;
  day: string;
  hour: string;
  title: string;
  coach: string;
  category: string;
  imageUrl?: string | null;
  duration: number;
}

type ViewMode = 'month' | 'week';

@Component({
  selector: 'app-jour-c',
  templateUrl: './jour-c.html',
  styleUrls: ['./jour-c.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class JourC implements OnInit {
  constructor(private http: HttpClient) {}

  hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
  categories = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23','SeniorA','SeniorB','SeniorC','SeniorD'];
  events: EventItem[] = [];

  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);
  viewMode: ViewMode = 'month';
  monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  monthDays: string[] = [];
  weekDays: string[] = [];

  showPopup = false;
  popupDay: string = '';
  popupEvents: EventItem[] = [];
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventDate = '';
  newEventHour = '';
  newEventDuration = 1;
  selectedFile: File | null = null;

  private apiUrl = 'http://localhost:3000/api/events';

  ngOnInit(): void {
    this.updateDays();
    this.loadEvents();
  }

  updateDays(): void {
    this.monthDays = this.buildMonthDays();
    this.weekDays = this.buildWeekDays();
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay() || 7;
    date.setDate(date.getDate() - day + 1);
    return date;
  }

  buildWeekDays(): string[] {
    const out: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      out.push(this.dateToStr(d));
    }
    return out;
  }

  buildMonthDays(): string[] {
    const out: string[] = [];
    for (let i = 1; i <= this.daysInMonth; i++) {
      out.push(this.dateToStr(new Date(this.currentYear, this.currentMonth, i)));
    }
    return out;
  }

  get daysInMonth(): number {
    return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  }

  monthLabel(): string {
    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  weekLabel(): string {
    const mon = this.currentWeekStart;
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    return `Semaine ${mon.getDate()} ${this.monthNames[mon.getMonth()]} – ${sun.getDate()} ${this.monthNames[sun.getMonth()]}`;
  }

  prevMonth(): void { 
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; } 
    else { this.currentMonth--; } 
    this.updateDays(); 
  }

  nextMonth(): void { 
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; } 
    else { this.currentMonth++; } 
    this.updateDays(); 
  }

  prevWeek(): void { 
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7); 
    this.updateDays(); 
  }

  nextWeek(): void { 
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7); 
    this.updateDays(); 
  }

  dateToStr(d: Date): string { 
    return d.toISOString().split('T')[0]; 
  }

  isToday(day: string): boolean { 
    return day === this.dateToStr(new Date()); 
  }

  dayName(day: string): string { 
    const names = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']; 
    return names[new Date(day + 'T00:00:00').getDay()]; 
  }

  dayNum(day: string): number { 
    return new Date(day + 'T00:00:00').getDate(); 
  }

  // NOUVELLE méthode pour formater la date
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async loadEvents(): Promise<void> {
    try {
      const data = await lastValueFrom(this.http.get<EventItem[]>(this.apiUrl));
      this.events = data; 
      console.log('Événements chargés:', this.events);
    } catch (e) {
      console.error('Erreur chargement événements', e);
    }
  }

  async createEvent(evt: EventItem): Promise<void> {
    try {
      const created = await lastValueFrom(this.http.post<EventItem>(this.apiUrl, evt));
      this.events.push(created);
    } catch (e) {
      console.error('Erreur création', e);
    }
  }

  async removeEvent(evt: EventItem): Promise<void> {
    if (!evt._id) return;
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${evt._id}`));
      this.events = this.events.filter(e => e._id !== evt._id);
    } catch (e) {
      console.error('Erreur suppression', e);
    }
  }

  getEventsByDayHour(day: string, hour: string): EventItem[] {
    return this.events.filter(e => {
      const eventDay = this.dateToStr(new Date(e.day));
      if (eventDay !== day) return false;
      const normalizeHour = (h: string) => h.slice(0, 5).padStart(5, '0');
      const eventHour = normalizeHour(e.hour);
      const currentHour = normalizeHour(hour);
      const start = this.hours.indexOf(eventHour);
      if (start === -1) return false;
      const end = start + e.duration - 1;
      const curr = this.hours.indexOf(currentHour);
      return curr >= start && curr <= end;
    });
  }

    // Après
    getEventsByDay(day: string | Date) {
      const dayDate = typeof day === 'string' ? new Date(day) : day;
      return this.events.filter(evt => new Date(evt.day).toDateString() === dayDate.toDateString());
    }

  // NOUVELLE méthode corrigée
  getEventsByHour(day: string, hour: string): EventItem[] {
    return this.getEventsByDay(day).filter(evt => {
      const eventHour = evt.hour.slice(0, 5);
      return eventHour === hour;
    });
  }

  openPopup(): void {
    const d = this.viewMode === 'week' ? this.currentWeekStart : new Date(this.currentYear, this.currentMonth, 1);
    this.newEventDate = this.dateToStr(d);
    this.newEventHour = '08:00';
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.newEventDuration = 1;
    this.selectedFile = null;
    this.showPopup = true;
  }

  openDayPopup(day: string): void {
    this.popupDay = day;
    this.popupEvents = this.getEventsByDay(day);
    this.showPopup = true;
  }

  closePopup(): void { 
    this.showPopup = false; 
    this.popupEvents = [];
  }

  onFileSelected(evt: Event): void { 
    const input = evt.target as HTMLInputElement; 
    this.selectedFile = input.files?.[0] ?? null; 
  }

  // NOUVELLE méthode
  quickAddEvent(day: Date, hour: string): void {
    this.openPopup();
    this.newEventDate = this.formatDate(day);
    this.newEventHour = hour;
  }

  async addEvent(): Promise<void> {
    if (!this.newEventTitle.trim()) return;
    const newEvent: EventItem = {
      day: this.newEventDate,
      hour: this.newEventHour,
      title: this.newEventTitle.trim(),
      coach: this.newEventCoach.trim(),
      category: this.newEventCategory,
      duration: this.newEventDuration,
      imageUrl: this.selectedFile ? URL.createObjectURL(this.selectedFile) : null
    };
    await this.createEvent(newEvent);
    this.closePopup();
  }

  async deleteEvent(event: EventItem): Promise<void> { 
    await this.removeEvent(event); 
  }


}