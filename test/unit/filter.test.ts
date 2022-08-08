// import { QuerySelector } from '../../src/';
import { Movie } from '../../src/model/movie';
import { Query, filterData } from '../../src/services/filter.service';

const movies: Movie[] = [
  {
    id: 1,
    title: 'Abcde',
    director: 'Tadeusz Drozda',
    actors: 'Irena Szewińska, Marty McFly',
    year: '2023',
    runtime: '230',
    genres: ['Not', 'A', 'Comedy'],
    plot: 'Generic plot',
    posterUrl:
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 2,
    title: 'Oemgie',
    director: 'Jacek Kawalec',
    actors: 'Barbara Santana',
    year: '1984',
    runtime: '10',
    genres: ['EGO', 'A', 'Comedy'],
    plot: 'Generic plot',
    posterUrl:
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
];

test('Get movie by title', async () => {
  const query: Query = {
    title: { $eq: 'Abcde' },
  };

  const result = filterData<Movie>(movies, query);

  expect(result.length).toBe(1);
  expect(result[0].title).toBe(query.title?.$eq);
});
test('Get movie by title and runtime (fail)', async () => {
  const query: Query = {
    title: { $eq: 'Oemgie' },
    runtime: { $gt: 10 },
  };

  const result = filterData<Movie>(movies, query);

  expect(result.length).toBe(0);
});
test('Get movie by title and runtime (ok)', async () => {
  const query: Query = {
    title: { $eq: 'Oemgie' },
    runtime: { $get: 10 },
  };

  const result = filterData<Movie>(movies, query);

  expect(result.length).toBe(1);
  expect(result[0].title).toBe(query.title?.$eq);
});

test('Get movies by genres', async () => {
  const query: Query = {
    genres: { $collection: ['Not', 'A', 'Comedy'] },
  };

  // let tempMovies: Movie[];
  const getByGenres = query.genres?.$collection?.filter((x) => {
    return movies.filter((y) => y.genres.map((z) => z === x));
  });
  console.log(getByGenres);
});
