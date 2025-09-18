import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Comment {
  user: string;
  text: string;
  time?: string;
}

interface Post {
  _id?: string;
  content: string;
  user: string;
  media?: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
  shares: number;
  createdAt?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
}

@Component({
  selector: 'app-actus-c',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actus-c.html',
  styleUrls: ['./actus-c.css']
})
export class ActusC implements OnInit {
  newPostContent = '';
  newPostMedia: File | null = null;
  newPostMediaPreview: string | null = null;
  posts: (Post & { newComment?: string; showMenu?: boolean })[] = [];
  loading = false;
  showCreateModal = false;

  currentUser: string = 'Utilisateur Test'; // à remplacer par ton système d'authentification
  apiUrl = 'http://localhost:3000/api/posts';

  @ViewChild('mediaInput', { static: false }) mediaInput?: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.http.get<Post[]>(this.apiUrl).pipe(
      catchError(err => { console.error(err); return throwError(() => err); })
    ).subscribe(posts => {
      this.posts = posts.map(p => ({
        ...p,
        newComment: '',
        showMenu: false,
        mediaType: p.media?.endsWith('.mp4') ? 'video' : p.media ? 'image' : undefined,
        mediaUrl: p.media ? this.formatMediaUrl(p.media) : undefined
      }));
    });
  }

  openCreatePostModal() { this.showCreateModal = true; }
  closeCreatePostModal() {
    this.showCreateModal = false;
    this.newPostContent = '';
    this.removeMedia();
  }

  onMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.newPostMedia = file;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.newPostMediaPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      this.newPostMediaPreview = URL.createObjectURL(file);
    } else {
      this.newPostMediaPreview = null;
    }
  }

  openMediaSelector() { this.mediaInput?.nativeElement?.click(); }

  removeMedia() {
    if (this.newPostMediaPreview && this.newPostMedia?.type.startsWith('video/')) {
      URL.revokeObjectURL(this.newPostMediaPreview);
    }
    this.newPostMedia = null;
    this.newPostMediaPreview = null;
    if (this.mediaInput?.nativeElement) this.mediaInput.nativeElement.value = '';
  }

  formatMediaUrl(url?: string) {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`;
  }

  createPost() {
    if (!this.newPostContent.trim() && !this.newPostMedia) return;
    this.loading = true;

    const newPost: Post = {
      content: this.newPostContent,
      user: this.currentUser,
      isLiked: false,
      likes: 0,
      isBookmarked: false,
      comments: [],
      shares: 0
    };

    if (!this.newPostMedia) {
      // POST simple sans média
      this.http.post<Post>(this.apiUrl, newPost).subscribe({
        next: post => this.addPostToList(post),
        error: err => { console.error('Erreur création post:', err); this.loading = false; }
      });
    } else {
      // POST avec média
      const formData = new FormData();
      formData.append('content', newPost.content);
      formData.append('user', newPost.user);
      formData.append('media', this.newPostMedia, this.newPostMedia.name);

      this.http.post<Post>(`${this.apiUrl}/media`, formData).subscribe({
        next: post => this.addPostToList(post),
        error: err => { console.error('Erreur upload média:', err); this.loading = false; }
      });
    }
  }

  addPostToList(post: Post) {
    this.posts.unshift({
      ...post,
      newComment: '',
      showMenu: false,
      mediaType: post.media?.endsWith('.mp4') ? 'video' : post.media ? 'image' : undefined,
      mediaUrl: post.media ? this.formatMediaUrl(post.media) : undefined
    });

    this.newPostContent = '';
    this.removeMedia();
    this.loading = false;
    this.showCreateModal = false;
  }

  addComment(post: Post & { newComment?: string }) {
    if (!post._id || !post.newComment?.trim()) return;
  
    const comment: Comment = { 
      user: this.currentUser, 
      text: post.newComment, 
      time: "À l'instant" 
    };
  
    this.http.post<Post>(`${this.apiUrl}/${post._id}/comment`, comment).subscribe({
      next: updatedPost => { 
        post.comments = updatedPost.comments; 
        post.newComment = ''; 
      },
      error: err => console.error(err)
    });
  }
  
  toggleLike(post: Post) {
    if (!post._id) return;
    this.http.post<Post>(`${this.apiUrl}/${post._id}/like`, {}).subscribe({
      next: updatedPost => { post.isLiked = updatedPost.isLiked; post.likes = updatedPost.likes; },
      error: err => console.error(err)
    });
  }

  bookmarkPost(post: Post) {
    post.isBookmarked = !post.isBookmarked;
    if (!post._id) return;
    this.http.put<Post>(`${this.apiUrl}/${post._id}`, { isBookmarked: post.isBookmarked }).subscribe({
      error: err => { console.error(err); post.isBookmarked = !post.isBookmarked; }
    });
  }

  sharePost(post: Post) {
    if (!post._id) return;
    this.http.post<Post>(`${this.apiUrl}/${post._id}/share`, {}).subscribe({
      next: updatedPost => { post.shares = updatedPost.shares; this.copyShareLink(post._id!); },
      error: err => console.error(err)
    });
  }

  deletePost(post: Post, index: number) {
    if (!post._id || !confirm('Voulez-vous supprimer ce post ?')) return;
    this.http.delete<void>(`${this.apiUrl}/${post._id}`).subscribe({
      next: () => this.posts.splice(index, 1),
      error: err => console.error(err)
    });
  }

  copyShareLink(postId: string) {
    const url = `${window.location.origin}/post/${postId}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => alert('Lien copié !'));
    else console.warn('Clipboard API non supporté');
  }

  getInitials(fullName?: string) {
    if (!fullName) return '?';
    return fullName.split(' ').map(n => n[0].toUpperCase()).slice(0, 2).join('');
  }

  togglePostMenu(index: number) { this.posts[index].showMenu = !this.posts[index].showMenu; }

  focusComment(post: Post & { newComment?: string }) { }

  editPost(post: Post) { alert('Modifier post : fonctionnalité à implémenter'); }
}
