importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBNNODoi_rSqLMR1p064yQ3tgiiz5atNT0",
  authDomain: "vac-tracker-app-eac07.firebaseapp.com",
  projectId: "vac-tracker-app-eac07",
  storageBucket: "vac-tracker-app-eac07.firebasestorage.app",
  messagingSenderId: "152309028335",
  appId: "1:152309028335:web:114fd0d7337caa3b60521a",
  measurementId: "G-L19G4S9YLG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
});
