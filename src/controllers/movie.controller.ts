import { Router } from 'express';
import { dataSource } from '../app';
import { Movie } from '../model/movie';

import MovieService from '../services/movie.service';

const movieController = Router();

movieController.get('/', async (req, res) => {
  const { runtime, genres } = req.query;

  const parsedRuntime = runtime ? parseInt(runtime as string) : undefined;

  const data = await dataSource?.getData();

  if (data === undefined || data === null) {
    return res.status(500).send('Internal server error');
  }

  const movies = MovieService.get(data!)({
    runtime: parsedRuntime,
    genres: genres as string[],
  });

  if (genres === undefined) {
    const randomMovie = Math.floor(Math.random() * movies.length);

    return res.status(200).json(movies[randomMovie]);
  }
  res.status(200).json(movies);
});

movieController.post('/add', async (req, res) => {
  const movie = req.body as Movie;

  const validate = MovieService.validate(movie);

  if (validate.error) {
    return res.status(400).json(validate.error);
  }

  const data = await dataSource?.getData();

  if (data === undefined || data === null) {
    return res.status(500).send('Internal server error');
  }

  const genresExist = MovieService.genresExist(data!)(movie.genres);
  const isDuplicate = MovieService.isDuplicate(data!)(movie.title);

  if (!genresExist) {
    return res.status(400).json('You can only use genres from the list');
  }

  if (isDuplicate) {
    return res.status(400).json('Movie already exists');
  }

  const newMovie = MovieService.add(data!)(movie);

  const updateStatus = dataSource?.updateDataSource(newMovie);
  dataSource?.invalidateCache();
  await dataSource?.refreshCache();

  if (newMovie instanceof Error) {
    return res.status(500).send(newMovie.message);
  }
  if (updateStatus instanceof Error) {
    return res.status(500).send(updateStatus.message);
  }

  res.status(200).json(newMovie);
});

export default movieController;
