import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { Inscription } from '../page/inscription/inscription';
import { AcceuilJ } from '../page/Joueur/acceuil-j/acceuil-j';



export const routes: Routes = [
    {path: '', component: Connexion},
    {path: 'connexion', component:Connexion},
    {path: 'inscription', component: Inscription},

    //Joueur
    {path:'accueilJ', component:AcceuilJ}



    //Coach



    //Inviter
];
