import { Movie } from '../../src/model/movie';
import { DataService } from '../../src/services/data.service';
import MovieService from '../../src/services/movie.service';
import { Logger } from '../../src/services/logger.service';
import path from 'path';

const replaceDirectory = 'test/unit';
const filePath = path.join(
  __dirname.replace(replaceDirectory, 'src'),
  'data',
  'db_test.json'
);
const dataService = new DataService(filePath, Logger);

test('Create movie with correct genre', async () => {
  await dataService.init();
  const data = await dataService.getData();

  const movie: Omit<Movie, 'id'> = {
    title: 'Donnie Darko',
    director: 'Richard Kelly',
    actors: 'Jake Gyllenhaal',
    year: '2001',
    runtime: '110',
    genres: ['Adventure'],
    plot: 'Generic plot',
  };
  const validate = MovieService.validate(movie);
  const genresExist = MovieService.genresExist(data!)(movie.genres);
  const isDuplicate = MovieService.isDuplicate(data!)(movie.title);

  expect(validate.error).toBe(undefined);
  expect(genresExist).toBe(true);
  expect(isDuplicate).toBe(false);
});

test('Create movie with incorrect genre - fail', async () => {
  await dataService.init();
  const data = await dataService.getData();

  const movie: Omit<Movie, 'id'> = {
    title: 'Donnie Darko',
    director: 'Richard Kelly',
    actors: 'Jake Gyllenhaal',
    year: '2001',
    runtime: '110',
    genres: ['This is not correct genre'],
    plot: 'Generic plot',
  };
  const validate = MovieService.validate(movie);
  const genresExist = MovieService.genresExist(data!)(movie.genres);
  const isDuplicate = MovieService.isDuplicate(data!)(movie.title);

  expect(validate.error).toBe(undefined);
  expect(genresExist).toBe(false);
  expect(isDuplicate).toBe(false);
});

test('Create duplicate movie - fail', async () => {
  await dataService.init();
  const data = await dataService.getData();

  const movie: Omit<Movie, 'id'> = {
    title: 'Beetlejuice',
    director: 'Richard Kelly',
    actors: 'Jake Gyllenhaal',
    year: '2001',
    runtime: '110',
    genres: ['This is not correct genre'],
    plot: 'Generic plot',
  };
  const validate = MovieService.validate(movie);
  const genresExist = MovieService.genresExist(data!)(movie.genres);
  const isDuplicate = MovieService.isDuplicate(data!)(movie.title);

  expect(validate.error).toBe(undefined);
  expect(genresExist).toBe(false);
  expect(isDuplicate).toBe(true);
});

test('Create invalid movie - fail', async () => {
  await dataService.init();
  const data = await dataService.getData();

  const movie: Omit<Movie, 'id'> = {
    title: 'Beetlejuice' + ''.padStart(1000, 'a'),
    director: 'Richard Kelly',
    actors: 'Jake Gyllenhaal',
    year: '2001',
    runtime: '110',
    genres: ['This is not correct genre'],
    plot: 'Generic plot',
  };
  const validate = MovieService.validate(movie);
  const genresExist = MovieService.genresExist(data!)(movie.genres);
  const isDuplicate = MovieService.isDuplicate(data!)(movie.title);

  expect(validate.error?.message).toBe(
    `"title" length must be less than or equal to 255 characters long`
  );
  expect(genresExist).toBe(false);
  expect(isDuplicate).toBe(false);
});

test('Add movie with correct genre', async () => {
  await dataService.init();
  const data = await dataService.getData();

  const movie: Omit<Movie, 'id'> = {
    title: 'Donnie Darko',
    director: 'Richard Kelly',
    actors: 'Jake Gyllenhaal',
    year: '2001',
    runtime: '110',
    genres: ['Adventure'],
    plot: 'Generic plot',
  };

  const validate = MovieService.validate(movie);
  const genresExist = MovieService.genresExist(data!)(movie.genres);
  const isDuplicate = MovieService.isDuplicate(data!)(movie.title);

  expect(validate.error).toBe(undefined);
  expect(genresExist).toBe(true);
  expect(isDuplicate).toBe(false);

  const result = MovieService.add(data!)(movie);

  expect(result.movies.map((x) => x.title)).toContain(movie.title);
});
