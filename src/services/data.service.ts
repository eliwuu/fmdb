import fs from 'fs/promises';

import { DataSource } from '../model/dataSource';
import { Logger } from 'winston';
import { Movie } from '../model/movie';

export class DataService {
  private dataSource: DataSource | undefined;
  private isInitialized = false;

  /**
   *
   * @param filePath Database file path and filename
   * @param logger Instance of winston Logger
   */
  constructor(
    private readonly filePath: string,
    private readonly logger: Logger
  ) {}

  /**
   *
   * @returns Initialize data source from filePath defined in constructor
   */
  public async init(): Promise<{ status: 'ok' | 'error'; msg?: string }> {
    if (this.isInitialized) {
      const error = new Error('Data source was already initialized');
      this.logger.error(error);

      return { status: 'error', msg: error.message };
    }

    const dataSource = await this.loadDataSource();

    if (dataSource === undefined) {
      const error = new Error('Unable to initialize data source');
      this.logger.error({ error: error, message: error.message });

      return { status: 'error', msg: error.message };
    }

    return { status: 'ok' };
  }

  /**
   * Invalidates cached data source
   * use after any changes to database file
   */
  public invalidateCache() {
    this.dataSource = undefined;
  }

  /**
   * Refreshes cache on data source
   * use after any changes to database file
   */
  public async refreshCache(): Promise<void> {
    if (this.dataSource === undefined) {
      this.dataSource = await this.loadDataSource();
    }
  }

  /**
   *
   * @returns Data source containing Genres and Movies { DS interface}
   */
  public async getData() {
    return this.dataSource;
  }

  private async loadDataSource(): Promise<DataSource | undefined> {
    try {
      const loadFile = await fs.readFile(this.filePath, {
        encoding: 'utf-8',
      });
      const dataSource = JSON.parse(loadFile) as DataSource;
      return dataSource;
    } catch (err: unknown) {
      this.logger.error(err);
      return undefined;
    }
  }
  public async updateDataSource(
    dataSource: DataSource
  ): Promise<{ status: 'ok' | 'error'; msg?: string }> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(dataSource), {
        encoding: 'utf-8',
      });
      return { status: 'ok' };
    } catch (err: unknown) {
      this.logger.error(err);

      return { status: 'error', msg: (err as Error).message };
    }
  }
}