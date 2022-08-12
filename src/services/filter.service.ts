import { Movie } from '../model/movie';

type Query<T = Movie> = { [P in keyof T]?: QuerySelector };

/**
 * Filter data by query
 */
type QuerySelector = {
  /**
   * equal
   */
  $eq?: string;
  /**
   * like - search string
   */
  $like?: string;
  /**
   * collection - array of string values to filter
   */
  $collection?: string[];
  /**
   * greater than
   */
  $gt?: number;
  /**
   * less than
   */
  $lt?: number;
  /**
   * greater or equal than
   */
  $get?: number;
  /**
   * less or equal than
   */
  $let?: number;
};

interface SearchObject {
  field: string;
  query: SearchQuery[];
}

interface SearchQuery {
  operator: string;
  value: string | string[] | number;
}

const processQuery = (query: Query): SearchObject[] => {
  return Object.entries(query).map((x) => {
    return {
      field: x[0],
      query: Object.entries(x[1]).map((y) => {
        return {
          operator: y[0],
          value: y[1],
        };
      }),
    };
  });
};

/**
 *
 * @param data - array of objects to filter
 * @param query - object with fields and values to filter
 * @returns
 */
export const filterData = <T>(data: T[], query: Query<T>) => {
  const filters = processQuery(query);
  let filteredData: T[];

  filters.forEach((filter) => {
    if (filteredData === undefined) {
      filteredData = data;
    }
    filter.query.forEach((query) => {
      if ((query.operator as keyof QuerySelector) === '$collection') {
        filteredData = filterCollection<T>(
          filteredData,
          query.value as string[],
          filter.field
        );
      } else {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const intermediate = filteredData.filter((x: any) => {
          switch (query.operator as keyof QuerySelector) {
            case '$gt':
              return x[filter.field] > query.value;
            case '$lt':
              return x[filter.field] < query.value;
            case '$get':
              return +x[filter.field] >= query.value;
            case '$let':
              return +x[filter.field] <= query.value;
            case '$eq':
              return x[filter.field] === query.value;
            case '$like':
              if (typeof x[filter.field] === 'string') {
                return x[filter.field].includes(query.value);
              }
          }
        });
        filteredData = intermediate;
      }
    });
  });

  return filteredData!;
};

/**
 *
 * @param data - array of objects to filter
 * @param collection - array of values to filter
 * @param field - field to filter by
 * @returns
 */
const filterCollection = <T>(
  data: T[],
  collection: string[],
  field: string
) => {
  const selectedGenres = collection.map((x) => x.toLowerCase());
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const filteredMovies = data.map((x: any) => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const mapped = x[field].filter((y: any) => {
      const status = selectedGenres.map((z) => {
        return z === y.toLowerCase();
      });

      return status.includes(true);
    });

    if (mapped.length > 0) return { ...x, field: mapped };
  });

  return filteredMovies
    .sort((a, b) => {
      return b!.field.length - a!.field.length;
    })
    .filter((x) => x !== undefined);
};
