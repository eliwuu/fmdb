import {
  Genres,
  genreExist,
  genresExist,
} from '../../src/domain/genre/genre.domain';

const genres: Genres = new Set(['action', 'comedy', 'drama']);

test('genreExist (true)', () => {
  expect(genreExist('action', genres)).toBe(true);
});

test('genreExist (false)', () => {
  expect(genreExist('horror', genres)).toBe(false);
});

test('genresExist (true)', () => {
  expect(genresExist(new Set(['action', 'comedy']), genres)).toBe(true);
});

test('genresExist (false)', () => {
  expect(genresExist(new Set(['action', 'horror']), genres)).toBe(false);
});
