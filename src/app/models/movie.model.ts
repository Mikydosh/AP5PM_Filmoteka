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