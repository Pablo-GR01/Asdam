export interface User {
    _id: string;
    nom: string;
    prenom: string;
    role: string;
    equipe?: string;
    poste?: string; // <- ajouté
}
  