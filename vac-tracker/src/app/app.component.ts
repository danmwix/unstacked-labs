// src/app/app.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirestoreInitService } from './services/firestore-init.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    private firestoreInit: FirestoreInitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('🌍 AppComponent initialized — running Firestore setup...');
      this.firestoreInit.initializeVaccines();
    }
  }
}
