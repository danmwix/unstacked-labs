// src/app/services/backend.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:3000/chat';

  constructor(private http: HttpClient) {}  // ✅ HttpClient injected

  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { userId: '123', message });
  }
}
