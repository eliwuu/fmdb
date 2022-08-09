import { Movie } from '../model/movie';

export type Query<T = Movie> = { [P in keyof T]?: QuerySelector };

export type QuerySelector = {
  /**
   * equal
   */
  $eq?: string;
  /**
   * like - search string
   */
  $like?: string;
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

export interface SearchObject {
  field: string;
  query: SearchQuery[];
}

export interface SearchQuery {
  operator: string;
  value: string | string[] | number;
}

export const processQuery = (query: Query): SearchObject[] => {
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

export const filterData = <T>(movies: T[], query: Query) => {
  const filters = processQuery(query);
  let filteredData: T[];

  filters.forEach((filter) => {
    if (filteredData === undefined) {
      filteredData = movies;
    }
    filter.query.forEach((query) => {
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
          case '$collection':
            return x[filter.field] === (query.value as string[])[0];
        }
      });
      filteredData = intermediate;
    });
  });

  return filteredData!;
};
