import { Movie } from '../../src/model/movie';
import { movies } from '../filterData';
import { filterData } from '../../src/services/filter.service';

test('Get movie by title', async () => {
  const title = 'Abcde';
  const result = filterData<Movie>(movies, {
    title: { $eq: 'Abcde' },
  });

  expect(result.length).toBe(1);
  expect(result[0].title).toBe(title);
});

test('Get movie by title and runtime - fail', async () => {
  const result = filterData<Movie>(movies, {
    title: { $eq: 'Oemgie' },
    runtime: { $gt: 10 },
  });

  expect(result.length).toBe(0);
});

test('Get movie by title and runtime - success', async () => {
  const title = 'Oemgie';
  const result = filterData<Movie>(movies, {
    title: { $eq: 'Oemgie' },
    runtime: { $get: 10 },
  });

  expect(result.length).toBe(1);
  expect(result[0].title).toBe(title);
});

test('Get movies by genres', async () => {
  const result = filterData<Movie>(movies, {
    genres: { $collection: ['Not', 'A', 'Comedy'] },
  });

  expect(result[1].title).toBe('zxcvxzvesdfg');
});

test('Get movies by genres and runtime', async () => {
  const result = filterData<Movie>(movies, {
    genres: { $collection: ['Not', 'A', 'Comedy'] },
    runtime: { $get: 110 },
  });

  expect(result.length).toBe(2);
});
