export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  backdrop_path: string | null;
  overview: string;
  tagline: string;
  runtime: number | null;
  genres: Genre[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
