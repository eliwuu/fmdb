import { Router } from 'express';
import { dataSource } from '../app';
import { Movie } from '../model/movie';

import MovieService from '../services/movie.service';

const movieController = Router();

movieController.get('/', async (req, res) => {
  const { runtime } = req.query;
  //   const runtime = req.query.runtime;
  //   const genres = req.params.genres;

  console.log(runtime);

  const parsedRuntime = runtime ? parseInt(runtime as string) : undefined;

  const data = await dataSource?.getData();

  if (data === undefined || data === null) {
    res.status(500).send('Internal server error');
  }
  if (runtime !== undefined) {
    const movies = MovieService.get(data!)({
      runtime: parsedRuntime,
    });

    console.table(movies);

    const randomMovie = Math.floor(Math.random() * movies.length);

    res.status(200).json(movies[randomMovie]);
  }

  //   res
  //     .status(200)
  //     .json(data!.movies[Math.floor(Math.random() * data!.movies.length)]);
});

movieController.post('/add', async (req, res) => {
  const movie = req.body as Movie;

  const validate = MovieService.validate(movie);

  if (validate.error) {
    res.status(400).json(validate.error);
  }

  const data = await dataSource?.getData();

  const newMovie = MovieService.add(data!)(movie);
  const updateStatus = dataSource?.updateDataSource(newMovie);
  dataSource?.invalidateCache();
  await dataSource?.refreshCache();

  if (newMovie instanceof Error) {
    res.status(500).send(newMovie.message);
  }
  res.status(200).json(newMovie);
});

export default movieController;
