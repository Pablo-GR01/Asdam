import { Routes } from '@angular/router';

/* ---- TOUT LE MONDE ----*/
import { Inscription } from '../page/inscription/inscription';
import { Connexion } from '../page/connexion/connexion';

/* ---- TOUT LE JOUEUR ----*/
import { AcceuilJ } from '../page/Joueur/acceuil-j/acceuil-j';
import { NotifJ } from '../page/Joueur/notif-j/notif-j';
import { MessageJ } from '../page/Joueur/message-j/message-j';
import { PlanningJ } from '../page/Joueur/planning-j/planning-j';
import { AbsentsJ } from '../page/Joueur/absents-j/absents-j';
import { ConvocationJ } from '../page/Joueur/convocation-j/convocation-j';


/* ---- TOUT LE COACH ----*/
import { AcceuilC } from '../page/Coach/acceuil-c/acceuil-c';
import { PlanningC } from '../page/Coach/planning-c/planning-c';
import { DashboardC } from '../page/Coach/dashboard-c/dashboard-c';
import { MatchC } from '../page/Coach/match-c/match-c';
import { ProfilC } from '../page/Coach/profil-c/profil-c';
import { NotifC } from '../page/Coach/notif-c/notif-c';
import { MessageC } from '../page/Coach/message-c/message-c';
import { AbsentsC } from '../page/Coach/absents-c/absents-c';
import { ActualiteC } from '../page/Coach/actualite-c/actualite-c';
import { ParametresC } from '../page/Coach/parametres-c/parametres-c';

/* ---- TOUT LE INVITÉ ----*/


export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },

    // Joueur
    { path: 'accueilJ', component: AcceuilJ },
    { path: 'notificationsJ', component: NotifJ },
    { path: 'notificationsJ/messagesJ', component: MessageJ },
    { path: 'PlanningJ', component: PlanningJ },
    { path: 'absentsJ', component: AbsentsJ },
    { path: 'matchJ/convocationsJ', component: ConvocationJ }, // ✅ Pas de slash au début
    
    // Coach
    { path: 'accueilC', component: AcceuilC },
    { path: 'PlanningC', component: PlanningC },
    { path: 'dashboardC', component: DashboardC },
    { path: 'matchC', component: MatchC },
    { path: 'notificationsC', component: NotifC },
    { path: 'dashboardC/profileC', component: ProfilC },
    { path: 'dashboardC/settingsC', component: ParametresC },
    { path: 'messagesC', component: MessageC },
    { path: 'absentsC', component: AbsentsC },
    { path: 'actualiteC', component: ActualiteC },

    // Inviter
];
