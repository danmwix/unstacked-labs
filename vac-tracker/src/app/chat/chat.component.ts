import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // ✅ Include HttpClientModule here
  templateUrl: './chat.component.html',
})
export class ChatComponent {
  userMessage = '';
  messages: any[] = [];

  constructor(private backend: BackendService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.messages.push({ sender: 'user', text: this.userMessage });

    this.backend.sendMessage(this.userMessage).subscribe({
      next: (res: any) => this.messages.push({ sender: 'bot', text: res.reply }),
      error: (err) => console.error(err),
    });

    this.userMessage = '';
  }
}
