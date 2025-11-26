// Seznam filmů/seriálů
export interface MediaList {
  id: string;  // UUID
  name: string;  // název seznamu
  items: MediaItem[];  // filmy/seriály v seznamu
  createdAt: Date;
  isDefault: boolean;  // true pro "Zhlédnuto" a "Chci vidět"
}

// Položka v seznamu (film nebo seriál)
export interface MediaItem {
  id: number;  // TMDB ID
  title: string;  // název filmu/seriálu
  poster_path: string | null;
  type: 'movie' | 'series';  // typ
  vote_average: number;
  release_date: string;
  addedAt: Date;
}