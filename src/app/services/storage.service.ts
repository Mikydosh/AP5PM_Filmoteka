import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { MediaList, MediaItem } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly LISTS_KEY = 'media_lists';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    
    // Vytvoř výchozí seznamy, pokud neexistují
    const lists = await this.getAllLists();
    if (lists.length === 0) {
      await this.createDefaultLists();
    }
  }

  // Výchozí seznamy
  private async createDefaultLists() {
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
    
    await this._storage?.set(this.LISTS_KEY, defaultLists);
  }

  // Získání všech seznamů
  async getAllLists(): Promise<MediaList[]> {
    return (await this._storage?.get(this.LISTS_KEY)) || [];
  }

  // Získání seznamu podle ID
  async getList(listId: string): Promise<MediaList | null> {
    const lists = await this.getAllLists();
    return lists.find(list => list.id === listId) || null;
  }

  // Vytvořit nový seznam
  async createList(name: string): Promise<MediaList> {
    const lists = await this.getAllLists();
    const newList: MediaList = {
      id: this.generateId(),
      name,
      items: [],
      createdAt: new Date(),
      isDefault: false
    };
    
    lists.push(newList);
    await this._storage?.set(this.LISTS_KEY, lists);
    return newList;
  }

  // Přidat položku do seznamu
  async addToList(listId: string, item: MediaItem): Promise<void> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);
    
    if (list) {
      // Zkontroluj jestli už tam není
      const exists = list.items.some(i => i.id === item.id && i.type === item.type);
      if (!exists) {
        list.items.push({ ...item, addedAt: new Date() });
        await this._storage?.set(this.LISTS_KEY, lists);
      }
    }
  }

  // Odeber položku ze seznamu
  async removeFromList(listId: string, itemId: number, itemType: 'movie' | 'series'): Promise<void> {
    const lists = await this.getAllLists();
    const list = lists.find(l => l.id === listId);
    
    if (list) {
      list.items = list.items.filter(i => !(i.id === itemId && i.type === itemType));
      await this._storage?.set(this.LISTS_KEY, lists);
    }
  }

  // Zkontroluj jestli je položka v seznamu
  async isInList(listId: string, itemId: number, itemType: 'movie' | 'series'): Promise<boolean> {
    const list = await this.getList(listId);
    if (!list) return false;
    return list.items.some(i => i.id === itemId && i.type === itemType);
  }

  // Smaž seznam (jen vlastní, ne výchozí)
  async deleteList(listId: string): Promise<void> {
    const lists = await this.getAllLists();
    const filteredLists = lists.filter(l => l.id !== listId || l.isDefault);
    await this._storage?.set(this.LISTS_KEY, filteredLists);
  }

  // Generuj UUID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}