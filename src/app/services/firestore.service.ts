import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { MediaList, MediaItem } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  // Získej ID přihlášeného uživatele
  private getUserId(): string {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not logged in');
    return user.uid;
  }

  // Vytvoř výchozí seznamy pro nového uživatele
  async createDefaultLists(): Promise<void> {
    const userId = this.getUserId();
    
    const defaultLists: MediaList[] = [
      {
        id: 'watched',
        name: 'Zhlédnuto',
        items: [],
        createdAt: new Date(),
        isDefault: true
      },
      {
        id: 'watchlist',
        name: 'Chci vidět',
        items: [],
        createdAt: new Date(),
        isDefault: true
      }
    ];

    for (const list of defaultLists) {
      await this.saveList(list);
    }
  }

  // Uložit seznam
  async saveList(list: MediaList): Promise<void> {
    const userId = this.getUserId();
    const listRef = doc(this.firestore, `users/${userId}/lists/${list.id}`);
    
    await setDoc(listRef, {
      ...list,
      createdAt: Timestamp.fromDate(list.createdAt),
      items: list.items.map(item => ({
        ...item,
        addedAt: Timestamp.fromDate(item.addedAt)
      }))
    });
  }

  // Načíst všechny seznamy
  async getAllLists(): Promise<MediaList[]> {
    const userId = this.getUserId();
    const listsRef = collection(this.firestore, `users/${userId}/lists`);
    const snapshot = await getDocs(listsRef);
    
    if (snapshot.empty) {
      // Pokud uživatel nemá žádné seznamy, vytvoř výchozí
      await this.createDefaultLists();
      return this.getAllLists();
    }

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data['createdAt'].toDate(),
        items: data['items'].map((item: any) => ({
          ...item,
          addedAt: item.addedAt.toDate()
        }))
      } as MediaList;
    });
  }

  // Načíst jeden seznam
  async getList(listId: string): Promise<MediaList | null> {
    const userId = this.getUserId();
    const listRef = doc(this.firestore, `users/${userId}/lists/${listId}`);
    const snapshot = await getDoc(listRef);
    
    if (!snapshot.exists()) return null;
    
    const data = snapshot.data();
    return {
      ...data,
      createdAt: data['createdAt'].toDate(),
      items: data['items'].map((item: any) => ({
        ...item,
        addedAt: item.addedAt.toDate()
      }))
    } as MediaList;
  }

  // Vytvořit nový seznam
  async createList(name: string): Promise<MediaList> {
    const newList: MediaList = {
      id: this.generateId(),
      name,
      items: [],
      createdAt: new Date(),
      isDefault: false
    };
    
    await this.saveList(newList);
    return newList;
  }

  // Přidat položku do seznamu
  async addToList(listId: string, item: MediaItem): Promise<void> {
    const list = await this.getList(listId);
    if (!list) throw new Error('List not found');
    
    // Zkontroluj jestli už tam není
    const exists = list.items.some(i => i.id === item.id && i.type === item.type);
    if (!exists) {
      list.items.push({ ...item, addedAt: new Date() });
      await this.saveList(list);
    }
  }

  // Odebrat položku ze seznamu
  async removeFromList(listId: string, itemId: number, itemType: 'movie' | 'series'): Promise<void> {
    const list = await this.getList(listId);
    if (!list) throw new Error('List not found');
    
    list.items = list.items.filter(i => !(i.id === itemId && i.type === itemType));
    await this.saveList(list);
  }

  // Zkontrolovat jestli je položka v seznamu
  async isInList(listId: string, itemId: number, itemType: 'movie' | 'series'): Promise<boolean> {
    const list = await this.getList(listId);
    if (!list) return false;
    return list.items.some(i => i.id === itemId && i.type === itemType);
  }

  // Smazat seznam
  async deleteList(listId: string): Promise<void> {
    const userId = this.getUserId();
    const listRef = doc(this.firestore, `users/${userId}/lists/${listId}`);
    await deleteDoc(listRef);
  }

  // Generovat ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}