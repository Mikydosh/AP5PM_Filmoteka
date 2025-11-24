// HLAVNI STRANKA
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

// DETAIL FILMU
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
  credits?: Credits;
}

export interface Genre {
  id: number;
  name: string;
}

// Credits (herci a štáb)
export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}