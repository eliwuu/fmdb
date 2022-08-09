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
  {
    id: 3,
    title: 'abdcdasd',
    director: 'Jafbfbcek bfbf',
    actors: 'Barbbara Santana',
    year: '1984',
    runtime: '10',
    genres: ['Not', 'B', 'Comedy'],
    plot: 'Generic plot',
    posterUrl:
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 4,
    title: '2342',
    director: 'Jacek dd',
    actors: 'Barbara dd',
    year: '1984',
    runtime: '10',
    genres: ['Z', 'B', 'Comedy'],
    plot: 'Generic plot',
    posterUrl:
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 5,
    title: 'vdsfvvf',
    director: 'dd Kawalec',
    actors: 'adda Santana',
    year: '1984',
    runtime: '10',
    genres: ['Z', 'B', 'Not'],
    plot: 'Generic plot',
    posterUrl:
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 6,
    title: 'zxcvxzvesdfg',
    director: 'Jacek asdfas',
    actors: 'Barbara Santana',
    year: '1984',
    runtime: '10',
    genres: ['Z', 'B', 'gh'],
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

test('get movies by any genres', async () => {
  const filteredMovies = movies.filter((x) =>
    x.genres.map((y) => {
      const status = ['Not', 'A', 'Comedy'].map((z) => {
        console.log('cat list ' + z);
        if (z === y) console.log('mapped ' + y);
        return z === y;
      });

      return status.includes(true);
    })
  );

  console.log(filteredMovies);
});
