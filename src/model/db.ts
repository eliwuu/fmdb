import { Movie } from './movie';

export interface DataSource {
  genres: string[];
  movies: Movie[];
}
