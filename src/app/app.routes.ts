import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { Inscription } from '../page/inscription/inscription';
import { AcceuilJ } from '../page/Joueur/acceuil-j/acceuil-j';
import { AcceuilC } from '../page/Coach/acceuil-c/acceuil-c';
import { PlanningC } from '../page/Coach/planning-c/planning-c';
import { DashboardC } from '../page/Coach/dashboard-c/dashboard-c';
import { MatchC } from '../page/Coach/match-c/match-c';
import { ProfilC } from '../page/Coach/profil-c/profil-c';



export const routes: Routes = [
    {path: '', component: Connexion},
    {path: 'connexion', component:Connexion},
    {path: 'inscription', component: Inscription},

    //Joueur
    {path:'accueilJ', component:AcceuilJ},



    //Coach
    {path:'accueilC', component:AcceuilC},
    {path:'PlanningC', component:PlanningC},
    {path:'dashboardC', component:DashboardC},
    {path:'matchC', component:MatchC},
    {path:'dashboardC/profileC', component:ProfilC},

    


    //Inviter
];
