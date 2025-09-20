import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../../../services/userService/Auth.Service';

interface EventItem {
  _id?: string;
  day: string;
  hour: string;
  endHour: string;
  title: string;
  coach: string;
  category: string;
  level: string;
  duration: number;
  color?: string;
  image?: string;
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
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ----- Variables calendrier -----
  hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
  eventTypes = ['Match', 'Entraînement', 'Stage', 'Tournoi', 'Fête', 'Réunion'];
  categories = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23',
    'SeniorA','SeniorB','SeniorC','SeniorD'
  ];

  events: EventItem[] = [];
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);
  viewMode: ViewMode = 'month';
  monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  monthDays: string[] = [];
  weekDays: string[] = [];

  // ----- Popup -----
  showPopup = false;
  popupEvent: EventItem | null = null;
  isEditing = false;
  isLoading = false;
  showSuccessMessage = false;
  successMessage = '';

  // ----- Formulaire création -----
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDuration = 1;

  // ----- Filtres -----
  selectedCategory = '';
  selectedCoach = '';
  searchTerm = '';

  // ----- Permissions -----
  userRole: string = '';  
  private apiUrl = 'http://localhost:3000/api/events';

  ngOnInit(): void {
    this.updateDays();
    this.loadEvents();
    this.userRole = this.authService.getUserRole();
  }

  canEdit(): boolean {
    const role = this.authService.getUserRole();
    return ['coach','admin','super admin'].includes(role);
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
      out.push(this.formatDate(d));
    }
    return out;
  }

  buildMonthDays(): string[] {
    const days: string[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDayOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = 0; i < startDayOffset; i++) days.push('');
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(this.formatDate(new Date(this.currentYear, this.currentMonth, i)));
    }
    while (days.length % 7 !== 0) days.push('');
    return days;
  }

  daysInMonth(): number { return new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); }
  monthLabel(): string { return `${this.monthNames[this.currentMonth]} ${this.currentYear}`; }
  weekLabel(): string {
    const mon = this.currentWeekStart;
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    return `Semaine du ${mon.getDate()} ${this.monthNames[mon.getMonth()]} au ${sun.getDate()} ${this.monthNames[sun.getMonth()]}`;
  }

  prevMonth(): void { 
    if(this.currentMonth === 0){ this.currentMonth = 11; this.currentYear--; } else this.currentMonth--;
    this.updateDays(); 
  }
  nextMonth(): void { 
    if(this.currentMonth === 11){ this.currentMonth = 0; this.currentYear++; } else this.currentMonth++;
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

  formatDate(d: Date): string { 
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  }

  isToday(day: string): boolean { return day === this.formatDate(new Date()); }
  dayName(day: string): string { 
    const names = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']; 
    return day ? names[new Date(day + 'T00:00:00').getDay()] : '';
  }
  dayNum(day: string): number { return day ? parseInt(day.split('-')[2], 10) : 0; }

  async loadEvents(): Promise<void> {
    this.isLoading = true;
    try { 
      this.events = await lastValueFrom(this.http.get<EventItem[]>(this.apiUrl)); 
    } catch (e) { 
      console.error('Erreur chargement événements', e); 
      this.showNotification('Erreur lors du chargement des événements');
    } finally {
      this.isLoading = false;
    }
  }

  async createEvent(evt: EventItem): Promise<void> {
    try { 
      const newEvent = await lastValueFrom(this.http.post<EventItem>(this.apiUrl, evt));
      this.events.push(newEvent);
      this.showNotification('Événement créé avec succès');
    } catch (e) { 
      console.error('Erreur création', e); 
      this.showNotification('Erreur lors de la création');
    }
  }

  async updateEvent(evt: EventItem): Promise<void> {
    if (!evt._id) return;
    try {
      const updated = await lastValueFrom(this.http.put<EventItem>(`${this.apiUrl}/${evt._id}`, evt));
      this.events = this.events.map(e => e._id === evt._id ? updated : e);
      this.showNotification('Événement modifié avec succès');
    } catch (e) {
      console.error('Erreur modification', e);
      this.showNotification('Erreur lors de la modification');
    }
  }

  async removeEvent(evt: EventItem): Promise<void> {
    if (!evt._id || !this.canEdit()) return;
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${evt._id}`));
      this.events = this.events.filter(e => e._id !== evt._id);
      this.showNotification('Événement supprimé avec succès');
    } catch (e) { 
      console.error('Erreur suppression', e); 
      this.showNotification('Erreur lors de la suppression');
    }
  }

  async deleteEvent(event: EventItem): Promise<void> { 
    await this.removeEvent(event); 
    this.closePopup(); 
  }

  editEvent(evt: EventItem): void {
    this.popupEvent = { ...evt };
    this.isEditing = true;
    this.newEventDate = evt.day;
    this.newEventHour = evt.hour;
    this.newEventEndHour = evt.endHour;
    this.newEventTitle = evt.title;
    this.newEventCoach = evt.coach;
    this.newEventCategory = evt.category;
    this.newEventLevel = evt.level;
    this.newEventDuration = evt.duration;
    this.showPopup = true;
  }

  async saveEvent(): Promise<void> {
    if (!this.popupEvent) return;
    const updatedEvent: EventItem = {
      ...this.popupEvent,
      day: this.newEventDate,
      hour: this.newEventHour,
      endHour: this.newEventEndHour,
      title: this.newEventTitle,
      coach: this.newEventCoach,
      category: this.newEventCategory,
      level: this.newEventLevel,
      duration: this.newEventDuration
    };
    await this.updateEvent(updatedEvent);
    this.isEditing = false;
    this.closePopup();
  }

  getEventsByDay(day: string | Date): EventItem[] {
    const dayStr = typeof day === 'string' ? day : this.formatDate(day);
    let events = this.events.filter(evt => evt.day === dayStr);
    if (this.selectedCategory) events = events.filter(evt => evt.category === this.selectedCategory);
    if (this.selectedCoach) events = events.filter(evt => evt.coach.toLowerCase().includes(this.selectedCoach.toLowerCase()));
    if (this.searchTerm) events = events.filter(evt => evt.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || evt.coach.toLowerCase().includes(this.searchTerm.toLowerCase()));
    return events;
  }

  getEventsByHour(day: string, hour: string): EventItem[] {
    return this.getEventsByDay(day).filter(evt => {
      const evtStartH = parseInt(evt.hour.split(':')[0],10);
      const evtEndH = parseInt(evt.endHour.split(':')[0],10);
      const h = parseInt(hour.split(':')[0],10);
      return h >= evtStartH && h < evtEndH;
    });
  }

  getEventCountByDay(day: string): number { return this.getEventsByDay(day).length; }
  getEventHeight(evt: EventItem): string { return `${evt.duration * 60}px`; }

  openPopup(): void {
    this.isEditing = false;
    this.popupEvent = null;
    const d = this.viewMode === 'week' ? this.currentWeekStart : new Date(this.currentYear, this.currentMonth, 1);
    this.newEventDate = this.formatDate(d);
    this.newEventHour = '09:00';
    this.newEventEndHour = '10:00';
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.newEventLevel = '';
    this.newEventDuration = 1;
    this.showPopup = true;
  }

  openEventPopup(evt: EventItem): void { this.popupEvent = evt; this.showPopup = true; }
  closePopup(): void { this.showPopup = false; this.popupEvent = null; }

  async addEvent(): Promise<void> {
    if (!this.newEventTitle.trim()) return;
    const [startH, startM] = this.newEventHour.split(':').map(Number);
    const [endH, endM] = this.newEventEndHour.split(':').map(Number);
    let duration = (endH*60+endM - (startH*60+startM))/60;
    if (duration <= 0) duration = 1;

    const newEvent: EventItem = {
      day: this.newEventDate,
      hour: this.newEventHour,
      endHour: this.newEventEndHour,
      title: this.newEventTitle.trim(),
      coach: this.newEventCoach.trim(),
      category: this.newEventCategory,
      level: this.newEventLevel,
      duration
    };

    await this.createEvent(newEvent);
    this.closePopup();
  }

  quickAddEvent(day: string | Date, hour: string): void {
    this.openPopup();
    const dayDate = typeof day === 'string' ? day : this.formatDate(day);
    this.newEventDate = dayDate;
    const [h, m] = hour.split(':').map(Number);
    this.newEventHour = hour;
    const endH = h + 1;
    this.newEventEndHour = `${String(endH).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    this.newEventDuration = 1;
  }

  getEventIcon(evt: EventItem): string {
    switch(evt.category) {
      case 'Entraînement': return 'fa-solid fa-futbol';
      case 'Fête': return 'fa-solid fa-champagne-glasses';
      case 'Réunion': return 'fa-solid fa-bullhorn';
      case 'Match': return 'fa-solid fa-trophy';
      case 'Tournoi': return 'fa-solid fa-medal';
      default: return 'fa-solid fa-circle';
    }
  }

  getEventClass(evt: EventItem): string {
    switch(evt.category) {
      case 'Entraînement': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Fête': return 'bg-gradient-to-r from-pink-500 to-pink-600';
      case 'Réunion': return 'bg-gradient-to-r from-blue-600 to-blue-700';
      case 'Match': return 'bg-gradient-to-r from-yellow-600 to-yellow-700';
      case 'Tournoi': return 'bg-gradient-to-r from-orange-600 to-orange-700';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  }

  showNotification(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => { this.showSuccessMessage = false; }, 3000);
  }

  clearFilters(): void { this.selectedCategory = ''; this.selectedCoach = ''; this.searchTerm = ''; }
  getUniqueCoaches(): string[] { return [...new Set(this.events.map(evt => evt.coach))].filter(Boolean).sort(); }

  
}
