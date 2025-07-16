import { Routes } from '@angular/router';
import { Accueil } from '../page-User/accueil/accueil';
import { Connexion } from '../page/connexion/connexion';


export const routes: Routes = [
    {path: '', component: Connexion},
    {path: 'accueil', component: Accueil}
];
