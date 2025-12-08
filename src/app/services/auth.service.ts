import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updatePassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // Načítání před zobrazením UI, aby neblikla obrazovky filmy->login->filmy
  private authInitialized = new BehaviorSubject<boolean>(false); // v základu false, až se načte user, tak true
  public authInitialized$ = this.authInitialized.asObservable();

  constructor(private auth: Auth) {
    // Poslouchej změny přihlášení
    onAuthStateChanged(this.auth, (user) => { // zavolá firebase auomaticky, hledá token v local storage. Dekóduje ho a vrací usera nebo null
      this.currentUserSubject.next(user); // uložení usera do BehaviorSubjectu
      this.authInitialized.next(true);  // označení, že inicializace proběhla -> AppComponent může pokračovat
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

  // Změnit heslo
  async changePassword(newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not logged in');
    
    await updatePassword(user, newPassword);
  }

  // Reset hesla
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }
}