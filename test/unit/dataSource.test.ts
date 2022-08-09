import path from 'path';

import { DataService } from '../../src/services/data.service';
import { Logger } from '../../src/services/logger.service';

const replaceDirectory =
  process.env.ENV === 'development' ? 'test/unit' : 'test';
const filePath = path.join(
  __dirname.replace(replaceDirectory, 'src'),
  'data',
  'db.json'
);

test('Succesfully initialize data source', async () => {
  console.log(filePath);
  const dataSource = new DataService(filePath, Logger);

  const result = await dataSource.init();

  expect(result.status).toBe('ok');
});
test('Data source is not initalized with wrong path', async () => {
  const filePath = path.join(__dirname, 'data', '');
  const dataSource = new DataService(filePath, Logger);

  const result = await dataSource.init();

  expect(result.status).toBe('error');
});
test('Change to database invalidates cache', async () => {
  const dataSource = new DataService(filePath, Logger);
  await dataSource.init();

  dataSource.invalidateCache();

  const result = await dataSource.getData();

  expect(result).toBe(null);
});
