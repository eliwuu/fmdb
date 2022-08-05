import { FilterQuery } from 'mongoose';
import { Movie } from '../model/movie';

// export function filter: FilterQuery()

export type Filter = { [P in keyof Movie]?: QuerySelector };

type QuerySelector = {
  $eq?: string;
  $rng?: { from: Date | number; to: Date | number };
};

const filter: Filter = {
  title: { $eq: 'ac' },
  runtime: { $rng: { from: 10, to: 80 } },
};

const usefilter = (aFitler: Filter, dataSource: Movie[]) => {
  const selector = dataSource.map((x) => Object.keys(x).filter((y) => aFitler));
};
