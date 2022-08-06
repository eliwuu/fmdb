import { Movie } from '../model/movie';

export type Filter = { [P in keyof Movie]?: QuerySelector };

type QuerySelector = {
  $eq?: string;
  $like?: string;
  $gt?: number;
  $lt?: number;
};

const usefilter = (aFitler: Filter, dataSource: Movie[]) => {
  const selector = dataSource.map((x) => Object.keys(x).filter((y) => aFitler));
};
