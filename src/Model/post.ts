export interface Post {
    _id?: string;
    content: string;
    user?: string;
    mediaUrl?: string;      // URL de l'image/vidéo
    mediaType?: 'image' | 'video' | null;
    isLiked: boolean;
    likes: number;
    isBookmarked: boolean;
    comments: Comment[];
    shares?: number;
    createdAt?: Date;
}

export interface Comment {
    user: string;
    text: string;
    time: string;
    initiale?: string;
}