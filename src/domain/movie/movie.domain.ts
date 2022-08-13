import Joi from 'joi';
import { Genres, genresExist } from '../genre/genre.domain';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Movie = Readonly<{
  id: number;
  title: string;
  year: string;
  runtime: string;
  genres: Genres;
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
  deleted?: boolean;
}>;

export type Movies = ReadonlySet<Movie>;

export type NewMovie = Omit<Mutable<Movie>, 'id'>;
export type NewMovies = Set<NewMovie>;

export type OnMovieAction = typeof onMovieActionFunc;

export type AddMovie = typeof addMovie;

export const exist = (movie: Movie, movies: Movies): boolean => {
  return movies.has(movie);
};

export const getLastId = (movies: Movies): number => {
  const lastMovie = [...movies].pop();
  return lastMovie ? lastMovie.id : -1;
};

export const getIdByTitle = (title: string, movies: Movies): number => {
  const movie = [...movies].find((movie) => movie.title === title);
  return movie ? movie.id : -1;
};

export const isValid = (movie: Movie): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.number().integer().min(0).required(),
    year: Joi.string().required().max(4),
    runtime: Joi.string().required().min(1),
    genres: Joi.array().items(Joi.string().required()).required(),
    director: Joi.string().required().max(255),
    actors: Joi.string().optional(),
    plot: Joi.string().optional(),
    posterUrl: Joi.string().optional(),
    deleted: Joi.boolean(),
  });

  return schema.validate(movie);
};

export const onMovieActionFunc = {
  exist,
  genresExist,
  isValid,
  getLastId,
  getIdByTitle,
  createMovie,
  validate,
};

export const addMovie = (
  movieToAdd: NewMovie,
  movies: Movies,
  genres: Genres,
  onAddMovie: OnMovieAction
): Movies | Error => {
  const createdMovie = onAddMovie.createMovie(onAddMovie, movies, movieToAdd);
  const status = onAddMovie.validate(onAddMovie, createdMovie, genres, movies);
  if (!status.exist && status.genresExist && status.isValid) {
    return new Set([...movies, createdMovie]);
  }

  return new Error(
    'Add movie failed, movie already exists or genres do not exist\n' +
      JSON.stringify(status)
  );
};

export const addMovies = (
  moviesToAdd: NewMovies,
  movies: Movies,
  genres: Genres,
  onMovieAction: OnMovieAction
): Movies => {
  const createdMovies = [...moviesToAdd].map((movie) => {
    const createdMovie = onMovieAction.createMovie(
      onMovieAction,
      movies,
      movie
    );
    const status = onMovieAction.validate(
      onMovieAction,
      createdMovie,
      genres,
      movies
    );
    if (!status.exist && status.genresExist && status.isValid) {
      return createdMovie;
    }
  });

  const validMovies = createdMovies.filter(
    (movie) => movie !== undefined
  ) as Movie[];

  const union = new Set([...movies, ...validMovies]);

  return union;
};

function createMovie(
  onMovieAction: OnMovieAction,
  movies: Movies,
  newMovie: NewMovie
) {
  const newId = onMovieAction.getLastId(movies) + 1;
  const createdMovie: Movie = { ...newMovie, id: newId };
  return createdMovie;
}

function validate(
  onMovieAction: OnMovieAction,
  newMovie: Movie,
  genres: Genres,
  movies: Movies
) {
  return {
    exist: onMovieAction.exist(newMovie, movies),
    genresExist: onMovieAction.genresExist(newMovie.genres, genres),
    isValid: onMovieAction.isValid(newMovie),
  };
}
export const updateMovie = (
  movieToUpdate: Movie,
  movies: Movies,
  genres: Genres,
  onMovieAction: OnMovieAction
): Movies | Error => {
  const status = onMovieAction.validate(
    onMovieAction,
    movieToUpdate,
    genres,
    movies
  );

  if (status.genresExist && status.isValid) {
    return new Set(
      [...movies].map((m) => (m.id === movieToUpdate.id ? movieToUpdate : m))
    );
  }

  return new Error(
    'Update movie failed, genres do not exist or is invalid\n' +
      JSON.stringify(status)
  );
};
