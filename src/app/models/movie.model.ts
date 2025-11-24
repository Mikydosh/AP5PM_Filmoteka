// Základní struktura filmu (pro karty)
export interface Movie{
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
}

// API odpověď
export interface MovieResponse{
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

// Detail filmu -> po rozkliknutí filmu
export interface MovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}