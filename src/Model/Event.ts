export interface EventItem {
    _id?: string;   // ID généré par Mongo
    day: string;
    hour: string;
    title: string;
    coach: string;
    category: string;
    imageUrl?: string;
}