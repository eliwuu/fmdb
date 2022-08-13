export type Genre = Readonly<string>;
export type Genres = ReadonlySet<Genre>;

/**
 *
 * @param genre genre to check if exists in genres set
 * @param genres genres set to check if genre exists in
 * @returns true if genre exists in genres set, false otherwise
 */
export const genreExist = (genre: Genre, genres: Genres): boolean => {
  return genres.has(genre);
};

/**
 *
 * @param onAddMovieGenres genres defined on add movie
 * @param genres genres set to check if genres defined on add movie exist in
 * @returns true if all genres defined on add movie exist in genres set, false otherwise
 */
export const genresExist = (
  onAddMovieGenres: Genres,
  genres: Genres
): boolean => {
  return [...onAddMovieGenres].every((genre) => genreExist(genre, genres));
};
