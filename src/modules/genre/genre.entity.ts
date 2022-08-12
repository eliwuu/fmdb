export default class Genres {
  private readonly list: Promise<string[]>;

  constructor(data: IDataSource) {
    this.list = data.getGenres();
  }

  /**
   *
   * @param genre - genre name
   * @returns true if genre exists in data source, false otherwise
   */
  public genreExist = async (genre: string) => {
    const intersect = new Set(
      (await this.list).filter((x) => new Set(genre).has(x))
    );
    return intersect.size === new Set(genre).size;
  };
}

export interface IDataSource {
  getGenres(): Promise<string[]>;
}
