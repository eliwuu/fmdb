import path from 'path';
import process from 'process';
import express from 'express';

import genreController from './controllers/genre.controller';
import movieController from './controllers/movie.controller';

import { DataService } from './services/data.service';
import { Logger } from './services/logger.service';

export let dataSource: DataService | null = null;

const init = async () => {
  const dataSourcePath = path.join(
    __dirname,
    'data',
    process.env.DS_FILE ?? 'db.json'
  );

  dataSource = new DataService(dataSourcePath, Logger);
  const { status, msg } = await dataSource.init();

  if (status === 'error') {
    Logger.error('Data source initialization failed: ' + msg);
    process.exit(1);
  }
  console.log('Data source initialized');
};

const app = express();

app.use('/api/genres', genreController);
app.use('/api/movies', movieController);

app.listen(process.env.PORT || 3000, async () => {
  await init();
  console.log('Server started on port: ' + (process.env.PORT || 3000));
});
