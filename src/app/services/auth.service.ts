import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    // Poslouchej změny přihlášení
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Registrace
  async register(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  // Přihlášení
  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  // Odhlášení
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // Aktuální uživatel
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Je přihlášený?
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}