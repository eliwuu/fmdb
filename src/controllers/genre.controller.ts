import { Router } from 'express';
import { dataSource } from '../app';

const genreController = Router();

genreController.get('/', async (_req, res) => {
  const genres = (await dataSource?.getData())?.genres;

  if (genres === undefined) {
    res.status(500).send('Internal server error');
  }
  res.status(200).json(genres);
});

export default genreController;
