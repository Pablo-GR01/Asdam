import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { Inscription } from '../page/inscription/inscription';
import { AcceuilJ } from '../page/Joueur/acceuil-j/acceuil-j';
import { AcceuilC } from '../page/Coach/acceuil-c/acceuil-c';
import { PlanningC } from '../page/Coach/planning-c/planning-c';
import { DashboardC } from '../page/Coach/dashboard-c/dashboard-c';
import { MatchC } from '../page/Coach/match-c/match-c';
import { ProfilC } from '../page/Coach/profil-c/profil-c';
import { NotifC } from '../page/Coach/notif-c/notif-c';
import { NotifJ } from '../page/Joueur/notif-j/notif-j';
import { MessageJ } from '../page/Joueur/message-j/message-j';
import { MessageC } from '../page/Coach/message-c/message-c';
import { AbsentsC } from '../page/Coach/absents-c/absents-c';



export const routes: Routes = [
    {path: '', component: Connexion},
    {path: 'connexion', component:Connexion},
    {path: 'inscription', component: Inscription},

    //Joueur
    {path:'accueilJ', component:AcceuilJ},
    {path:'notificationsJ', component:NotifJ},
    {path:'notificationsJ/messagesJ', component:MessageJ},

    
    //Coach
    {path:'accueilC', component:AcceuilC},
    {path:'PlanningC', component:PlanningC},
    {path:'dashboardC', component:DashboardC},
    {path:'matchC', component:MatchC},
    {path:'notificationsC', component:NotifC},
    {path:'dashboardC/profileC', component:ProfilC},
    {path:'notificationsC/messagesC', component:MessageC},
    {path:'absentsC', component:AbsentsC},
    


    //Inviter
];
