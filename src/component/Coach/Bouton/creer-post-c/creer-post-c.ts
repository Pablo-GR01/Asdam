import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creer-post-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-post-c.html'
})
export class CreerPostC {
  showCreateModal = false;
  newPostContent = '';

  openCreatePostModal() {
    this.showCreateModal = true;
  }

  closeCreatePostModal() {
    this.showCreateModal = false;
    this.newPostContent = '';
  }

  createPost() {
    if (!this.newPostContent.trim()) return;
    console.log('Nouveau post :', this.newPostContent);

    // 👉 Ici tu pourras connecter ton API plus tard
    this.closeCreatePostModal();
  }
}
