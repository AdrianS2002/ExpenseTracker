// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAG0p3cIuFKvviUfmOAk6CvcdMIW-4IsPE",
  authDomain: "expensetracker-caf73.firebaseapp.com",
  projectId: "expensetracker-caf73",
  storageBucket: "expensetracker-caf73.firebasestorage.app",
  messagingSenderId: "368356005784",
  appId: "1:368356005784:web:d0af1cdeb1e686ba557ded",
  measurementId: "G-9PLEK3E5EQ"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ]
}).catch(err => console.error(err));
