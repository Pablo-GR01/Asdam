import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface Comment {
  user: string;
  text: string;
  time?: string;
  initials?: string;
}

interface Post {
  _id?: string;
  content: string;
  user?: string;
  initials?: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
  shares: number;
  media?: string;
  createdAt?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
}

interface LocalUser {
  _id?: string;
  prenom?: string;
  nom?: string;
  role?: string;
  initiale?: string;
}

@Component({
  selector: 'app-actus-c',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actus-c.html',
  styleUrls: ['./actus-c.css']
})
export class ActusC implements OnInit {

  currentUser: LocalUser | null = null;
  newPostContent = '';
  newPostMedia: File | null = null;
  newPostMediaPreview: string | null = null;
  posts: (Post & { newComment?: string; showMenu?: boolean })[] = [];
  loading = false;
  showCreateModal = false;

  editingPost: Post | null = null;
  editingContent = '';
  editingMedia: File | null = null;
  editingMediaPreview: string | null = null;
  showEditModal = false;

  @ViewChild('mediaInput') mediaInput?: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput?: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    this.loadPosts();
  }

  get currentInitiales(): string {
    if (!this.currentUser) return 'UU';
    return this.currentUser.initiale ?? ((this.currentUser.prenom?.[0] ?? '') + (this.currentUser.nom?.[0] ?? '')).toUpperCase();
  }

  get currentFullName(): string {
    if (!this.currentUser) return 'Utilisateur';
    return `${this.currentUser.prenom ?? ''} ${this.currentUser.nom ?? ''}`.trim();
  }

  canCreatePost(): boolean {
    if (!this.currentUser?.role) return false;
    const role = this.currentUser.role.toLowerCase();
    return role === 'coach' || role === 'admin' || role === 'super admin';
  }

  loadPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(
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

  openCreatePostModal() { if(this.canCreatePost()) this.showCreateModal = true; }
  closeCreatePostModal() { this.showCreateModal = false; this.newPostContent = ''; this.removeMedia(); }

  onMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.newPostMedia = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.newPostMediaPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        if (video.duration > 15) {
          alert("La vidéo doit durer moins de 15 secondes !");
          this.removeMedia();
        } else {
          this.newPostMediaPreview = url;
        }
      };
    } else {
      alert("Type de fichier non supporté !");
      this.removeMedia();
    }
  }

  openMediaSelector() { if (this.mediaInput?.nativeElement) this.mediaInput.nativeElement.click(); }

  removeMedia() {
    if (this.newPostMediaPreview && this.newPostMedia?.type.startsWith('video/')) {
      URL.revokeObjectURL(this.newPostMediaPreview);
    }
    this.newPostMedia = null;
    this.newPostMediaPreview = null;
    if (this.mediaInput && this.mediaInput.nativeElement) this.mediaInput.nativeElement.value = '';
  }

  createPost() {
    if (!this.canCreatePost() || !this.currentUser) { alert('Action non autorisée !'); return; }
    if (!this.newPostContent.trim() && !this.newPostMedia) return;
    this.loading = true;

    const newPost: Partial<Post> = {
      content: this.newPostContent,
      user: this.currentFullName,
      initials: this.currentInitiales,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      shares: 0
    };

    const url = this.newPostMedia ? 'http://localhost:3000/api/posts/media' : 'http://localhost:3000/api/posts';

    if (!this.newPostMedia) {
      this.http.post<Post>(url, newPost).subscribe({
        next: post => this.addPostToList(post),
        error: err => { console.error(err); this.loading = false; alert('Erreur serveur'); }
      });
    } else {
      const formData = new FormData();
      formData.append('content', newPost.content || '');
      formData.append('user', newPost.user || '');
      formData.append('initials', newPost.initials || '');
      formData.append('media', this.newPostMedia, this.newPostMedia.name);

      this.http.post<Post>(url, formData).subscribe({
        next: post => this.addPostToList(post),
        error: err => { console.error(err); this.loading = false; alert('Erreur serveur'); }
      });
    }
  }

  addComment(post: Post & { newComment?: string }) {
    if (!this.currentUser || !post._id) return;
  
    const commentText = post.newComment?.trim();
    if (!commentText) return;
  
    const comment: Comment = {
      user: this.currentFullName,
      initials: this.currentInitiales,
      text: commentText,
      time: new Date().toISOString()
    };
  
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/comment`, comment)
      .pipe(
        catchError(err => {
          console.error('Erreur ajout commentaire:', err);
          alert('Impossible d’ajouter le commentaire. Vérifie le serveur.');
          return throwError(() => err);
        })
      )
      .subscribe(updatedPost => {
        post.comments = updatedPost.comments || [];
        post.newComment = '';
      });
  }

  private addPostToList(post: Post) {
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

  toggleLike(post: Post) {
    if (!post._id) return;
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/like`, {}).subscribe({
      next: updatedPost => { post.isLiked = updatedPost.isLiked; post.likes = updatedPost.likes; },
      error: err => console.error(err)
    });
  }

  bookmarkPost(post: Post) {
    post.isBookmarked = !post.isBookmarked;
    if (!post._id) return;
    this.http.put<Post>(`http://localhost:3000/api/posts/${post._id}`, { isBookmarked: post.isBookmarked }).subscribe({
      error: err => { console.error(err); post.isBookmarked = !post.isBookmarked; }
    });
  }

  sharePost(post: Post) {
    if (!post._id) return;
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/share`, {}).subscribe({
      next: updatedPost => {
        post.shares = updatedPost.shares;
        const postUrl = `${window.location.origin}/posts/${post._id}`;
        navigator.clipboard.writeText(postUrl).then(() => alert('Lien copié !'));
      },
      error: err => console.error(err)
    });
  }

  deletePost(post: Post, index: number) {
    if (!post._id || !confirm('Voulez-vous supprimer ce post ?')) return;
    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => this.posts.splice(index, 1),
      error: err => console.error(err)
    });
  }

  formatMediaUrl(url?: string) {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`;
  }

  togglePostMenu(index: number) { this.posts[index].showMenu = !this.posts[index].showMenu; }

  openEditModal(post: Post) {
    this.editingPost = post;
    this.editingContent = post.content;
    this.editingMedia = null;
    this.editingMediaPreview = post.mediaUrl || null;
    this.showEditModal = true;
  }

  onEditMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.editingMedia = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.editingMediaPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        if (video.duration > 30) {
          alert("La vidéo doit durer moins de 15 secondes !");
          this.removeEditMedia();
        } else {
          this.editingMediaPreview = url;
        }
      };
    } else {
      alert("Type de fichier non supporté !");
      this.removeEditMedia();
    }
  }

  removeEditMedia() {
    if (this.editingMediaPreview && this.editingMedia?.type.startsWith('video/')) {
      URL.revokeObjectURL(this.editingMediaPreview);
    }
    this.editingMedia = null;
    this.editingMediaPreview = this.editingPost?.mediaUrl || null;
    if (this.editMediaInput && this.editMediaInput.nativeElement) this.editMediaInput.nativeElement.value = '';
  }

  saveEdit() {
    if (!this.editingPost || !this.editingPost._id) return;
    const updatedContent = this.editingContent.trim();
    if (!updatedContent && !this.editingMedia) return;

    const formData = new FormData();
    formData.append('content', updatedContent);
    formData.append('initials', this.currentInitiales);
    if (this.editingMedia) formData.append('media', this.editingMedia, this.editingMedia.name);

    this.http.put<Post>(`http://localhost:3000/api/posts/${this.editingPost._id}`, formData).subscribe({
      next: updatedPost => {
        const idx = this.posts.findIndex(p => p._id === updatedPost._id);
        if (idx > -1) {
          this.posts[idx] = {
            ...updatedPost,
            newComment: '',
            showMenu: false,
            mediaType: updatedPost.media?.endsWith('.mp4') ? 'video' : updatedPost.media ? 'image' : undefined,
            mediaUrl: updatedPost.media ? this.formatMediaUrl(updatedPost.media) : undefined
          };
        }
        this.showEditModal = false;
        this.editingPost = null;
      },
      error: err => console.error(err)
    });
  }

  cancelEdit() {
    this.showEditModal = false;
    this.editingPost = null;
    this.editingMedia = null;
    this.editingMediaPreview = null;
    this.editingContent = '';
    if (this.editMediaInput && this.editMediaInput.nativeElement) this.editMediaInput.nativeElement.value = '';
  }
}
