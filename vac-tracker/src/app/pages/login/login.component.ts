import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, RecaptchaVerifier, signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../../environments/environment';

// Extend global window
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  phoneNumber = '';
  otp = '';
  confirmationResult: any;
  appVerifier!: RecaptchaVerifier;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private messaging: Messaging,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Initialize reCAPTCHA safely
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          this.auth, // ✅ Auth instance first
          'recaptcha-container', // then container ID
          {
            size: 'invisible',
            callback: (response: any) => console.log('✅ reCAPTCHA solved:', response),
            'expired-callback': () => alert('reCAPTCHA expired. Please try again.'),
          }
        );
      }

      this.appVerifier = window.recaptchaVerifier;

      // ✅ Handle push messages
      onMessage(this.messaging, (payload) => {
        console.log('📩 New FCM Message:', payload);
        if (payload?.notification?.body) {
          alert(`🔔 Reminder: ${payload.notification.body}`);
        }
      });

      // ✅ Request FCM token
      getToken(this.messaging, { vapidKey: environment.firebaseConfig.vapidKey })
        .then((token) => {
          if (token) {
            console.log('✅ FCM Token:', token);
          } else {
            console.warn('⚠️ No registration token available.');
          }
        })
        .catch((err) => console.error('❌ Error retrieving token:', err));
    }
  }

  async sendOTP() {
    if (!this.phoneNumber.startsWith('+')) {
      alert('Phone number must start with + (e.g., +1234567890)');
      return;
    }

    try {
      await this.appVerifier.render();
      this.confirmationResult = await signInWithPhoneNumber(
        this.auth,
        this.phoneNumber,
        this.appVerifier
      );
      alert('✅ OTP sent successfully! (Use 123456 for testing)');
    } catch (error: any) {
      console.error('❌ Error sending OTP:', error);
      if (error.code === 'auth/operation-not-allowed') {
        alert('Enable Phone Authentication in Firebase Console.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  }

  async verifyOTP() {
    try {
      await this.confirmationResult.confirm(this.otp);
      alert('✅ Login successful!');
      await this.navigateToChildDetails();
    } catch (error: any) {
      console.error('❌ Error verifying OTP:', error);
      alert('❌ Invalid OTP: ' + error.message);
    }
  }

  async navigateToChildDetails() {
    try {
      const childrenRef = collection(this.firestore, 'children');
      const q = query(childrenRef, where('parentPhone', '==', this.phoneNumber));
      const snapshot = await getDocs(q);

      if (snapshot.docs.length > 0) {
        const latestChild = snapshot.docs[0];
        this.router.navigate(['/child-details', latestChild.id]);
      } else {
        alert('No child registered for this phone. Redirecting to registration.');
        this.router.navigate(['/register-child']);
      }
    } catch (error: any) {
      console.error('❌ Error fetching child:', error);
      alert('Failed to fetch child details.');
      this.router.navigate(['/register-child']);
    }
  }
}
