import path from 'path';
import process from 'process';

import { DataService } from './services/data.service';
import { Logger } from './services/logger.service';

export let dataSource: DataService | null = null;

const init = async () => {
  const dataSourcePath = path.join(__dirname, 'data', process.env.DS_FILE!);
  dataSource = new DataService(dataSourcePath, Logger);
  await dataSource.init();
};

init();
