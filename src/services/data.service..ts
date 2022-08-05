import { DataSource } from '../model/db';

export default class DB {
  public static getGenres(dataSource: DataSource): string[] {
    return dataSource.genres.map((x) => x.normalize());
  }
  public static getMovies(filter: Filter, search: Search): Movie[] {}
}
