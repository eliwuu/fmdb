import { Movie } from '../../src/model/movie';
import { Filter } from '../../src/services/filter.service';

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

test('Get movie by title search', async () => {
  const filter: Filter = {
    title: { $eq: 'Abcde' },
    runtime: { $gt: 10, $lt: 300 },
  };

  //   const filterField = Object.keys(filter);
  const setFilter = Object.entries(filter).map((x) => {
    return {
      field: x[0],
      operators: Object.entries(x[1]).map((y) => {
        return JSON.stringify({
          operator: y[0],
          value: y[1],
        });
      }),
      //   value: x[1][1],
    };
  });

  //   const field = setFilter[0];
  //   const operator = setOperator[0];
  //   const value = setOperator[1];

  console.log(JSON.stringify(setFilter));
  console.table(setFilter);

  movies.map((x) => x);

  //   const filteredMovie = movies.filter((x: any) => {
  //     x[field] === value;
  //   });

  //   console.log(filteredMovie);
  //   expect(filteredMovie.).toBe('Abcde');
});
