import { Component } from '@angular/core';
import { Sections1 } from "../../../component/Joueur/sections1/sections1";
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { EnteteC } from "../../../component/Coach/page-Accueil/entete-c/entete-c";
import { ProfilUser } from "../../../component/Coach/page-Profil/profil-user/profil-user";
import { CreerMatchC } from "../../../component/Coach/Bouton/creer-match-c/creer-match-c";
import { CreerConvocationsC } from "../../../component/Coach/Bouton/creer-convocations-c/creer-convocations-c";

@Component({
  selector: 'app-profil-c',
  imports: [Sections1, HeaderC, ProfilUser, CreerMatchC, CreerConvocationsC],
  templateUrl: './profil-c.html',
  styleUrl: './profil-c.css'
})
export class ProfilC {

}
