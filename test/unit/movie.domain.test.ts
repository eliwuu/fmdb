import {
  Movie,
  exist,
  getLastId,
  getIdByTitle,
} from '../../src/domain/movie/movie.domain';
import { movies } from '../filterData';

const movieSet = new Set([...movies]) as ReadonlySet<Movie>;
const notExistingMovie: Movie = {
  id: getLastId(movieSet) + 1,
  title: 'Not Existing Movie',
  director: 'Not Existing Director',
  year: 'Not Existing Year',
  runtime: 'Not Existing Runtime',
  genres: new Set(['Not Existing Genre']),
  actors: 'Not Existing Actors',
  plot: 'Not Existing Plot',
  posterUrl: 'Not Existing Poster Url',
  deleted: false,
};

test('movieExist (true)', () => {
  expect(exist(movieSet.values().next().value(), movieSet)).toBe(true);
});

test('movieExist (false)', () => {
  expect(exist(notExistingMovie, movieSet)).toBe(false);
});

test('getLastId (true)', () => {
  expect(getLastId(movieSet)).toBe(movies[movies.length - 1].id);
});

test('getLastId (false)', () => {
  expect(getLastId(new Set())).toBe(-1);
});

test('getIdByTitle (true)', () => {
  expect(getIdByTitle('Abcde', movieSet)).toBe(movies[0].id);
});

test('getIdByTitle (false)', () => {
  expect(getIdByTitle('Not Existing Movie', movieSet)).toBe(-1);
});
