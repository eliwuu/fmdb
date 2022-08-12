import Joi from 'joi';
import { Logger } from 'winston';
import { DataSource } from '../model/dataSource';
import { Movie } from '../model/movie';
import { filterData } from './filter.service';

export default class MovieService {
  /**
   *
   * @param dataSource Pass data source from DataService.getData()
   * @returns DataSource
   */
  public static add =
    (dataSource: DataSource) => (movie: Omit<Movie, 'id'>) => {
      const lastId =
        dataSource.movies.length === 0
          ? 0
          : dataSource.movies[dataSource.movies.length - 1].id;

      dataSource.movies.push({
        ...(movie as Movie),
        id: lastId! + 1,
      });

      return dataSource;
    };

  /**
   *
   * @param dataSource Pass data source from DataService.getData()
   * @param logger Pass winston logger instance
   * @returns DataSource
   */
  public static remove =
    (dataSource: DataSource, logger: Logger) =>
    (options: { id?: number; movie?: Movie }) => {
      try {
        const movieIndex = this.getIndex(
          options.id ?? options.movie!.id,
          dataSource,
          logger
        );

        dataSource.movies[movieIndex as number].deleted = true;

        return dataSource;
      } catch (err) {
        return err;
      }
    };

  /**
   *
   * @param dataSource Pass data source from DataService.getData()
   * @param logger Pass winston logger instance
   * @returns DataSource
   */
  public static update =
    (dataSource: DataSource, logger: Logger) => (data: Movie) => {
      try {
        const movieIndex = this.getIndex(data.id, dataSource, logger);

        dataSource.movies[movieIndex as number] = data;

        return dataSource;
      } catch (err) {
        return err;
      }
    };

  public static getIndex = (
    id: number,
    dataSource: DataSource,
    logger: Logger
  ) => {
    if (id === undefined) {
      logger.error('Id is undefined');
      throw new Error('Id is undefined');
    }
    const movieIndex = dataSource.movies.findIndex((x) => x.id === id);

    if (movieIndex === -1) {
      logger.error('There is no movie with id ' + id);

      return undefined;
    }

    return movieIndex;
  };

  /**
   *
   * @param dataSource Pass data source from DataService.getData()
   * @param options Pass runtime and/or genres to filter data
   * @returns movies or movies filtered by runtime and/or genres
   */
  public static get =
    (dataSource: DataSource) =>
    (options?: { runtime?: number; genres?: string[] }) => {
      let movies = dataSource.movies.filter((x) => !x.deleted);
      if (options?.runtime && !isNaN(options.runtime)) {
        movies = filterData<Movie>(movies, {
          runtime: { $get: +options.runtime - 10, $let: +options.runtime + 10 },
        });
      }
      if (options?.genres) {
        if (typeof options.genres === 'string')
          options.genres = [options.genres];

        movies = filterData<Movie>(movies, {
          genres: { $collection: options.genres },
        });
      }
      return movies;
    };

  public static validate(movie: Omit<Movie, 'id'>) {
    const schema = Joi.object<Omit<Movie, 'id'>>({
      title: Joi.string().max(255).required(),
      year: Joi.number().integer().min(1888).required(),
      runtime: Joi.number().integer().min(1).required(),
      genres: Joi.array().items(Joi.string()).required(),
      director: Joi.string().max(255).required(),
      actors: Joi.string().optional(),
      plot: Joi.string().optional(),
      posterUrl: Joi.string().optional(),
    });

    return schema.validate(movie);
  }

  /**
   *
   * @param dataSource Pass data source from DataService.getData()
   * @param genres Pass genres to check if they exist in dataSource
   * @returns true if all genres exist in dataSource, false otherwise
   */
  public static checkGenres =
    (dataSource: DataSource) => (genres: string[]) => {
      const genresSet = new Set(genres);
      const intersect = new Set(
        dataSource.genres.filter((x) => genresSet.has(x))
      );
      if (intersect.size !== genresSet.size) {
        return false;
      }

      return true;
    };

  /**
   *
   * @param dataSource Pass data source from DataService.getData()
   * @param title Pass movie title to check if it exists in dataSource
   * @returns true if duplicate movie is found, false otherwise
   */
  public static isDuplicate = (dataSource: DataSource) => (title: string) => {
    return (
      filterData<Movie>(dataSource.movies, {
        title: { $eq: title },
      }).length > 0
    );
  };
}
