import path from 'path';
import fs from 'fs/promises';
import { DataSource } from '../model/db';

export default class DB {
  private readonly filename = 'db.json';
  private dataSource: DataSource | null = null;

  public async loadDataSource() {
    const filePath = path.resolve(__dirname, 'src', 'data');
    const loadFile = await fs.readFile(path.join(filePath, this.filename), {
      encoding: 'utf-8',
    });

    const dataSource = JSON.parse(loadFile) as DataSource;
    this.dataSource = dataSource;
  }

  public invalidateCache() {
    this.dataSource = null;
  }
  public getGenres(): string[] {
    if (this.dataSource === null) {
      this.dataSource = this.refreshCache();
    }
    return this.dataSource!.genres.map((x) => x.normalize());
  }
  //   public getMovies(filter: Filter): Movie[] {
  //     if ()
  //   }

  private async refreshCache(): DataSource {
    if (this.dataSource === null) {
      this.dataSource = await this.loadDataSource();
    }
  }
}
