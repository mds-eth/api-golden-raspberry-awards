import '../database';
import AwardsService from '../service/AwardsService';
describe('AwardsService', () => {
  describe('listFilms', () => {
    it('should return films based on the provided parameters', async () => {
      const films = await AwardsService.listFilms({ page: 1, size: 10, winner: 'true' });
      expect(films).toBeDefined();
      expect(films.totalElements).toBeGreaterThanOrEqual(0);
      expect(films.content).toBeDefined();
    });
  });

  describe('listProjection', () => {
    it('should return years with multiple winners', async () => {
      const years = await AwardsService.listProjection('years-with-multiple-winners');
      expect(years).toBeDefined();
      expect(years.length).toBeGreaterThanOrEqual(0);
    });

    it('should return studios with win count', async () => {
      const studios = await AwardsService.listProjection('studios-with-win-count');
      expect(studios).toBeDefined();
      expect(studios.length).toBeGreaterThanOrEqual(0);
    });

    it('should return max min win interval for producers', async () => {
      const intervals = await AwardsService.listProjection('max-min-win-interval-for-producers');
      expect(intervals).toBeDefined();
      expect(intervals.min).toBeDefined();
      expect(intervals.max).toBeDefined();
    });

    it('should throw an error for unrecognized projection', async () => {
      await expect(AwardsService.listProjection('invalid-projection')).rejects.toThrowError(
        "Projection not found."
      );
    });
  });

  describe('getTotalElementsDB', () => {
    it('should return total elements based on the query', async () => {
      const totalElements = await AwardsService.getTotalElementsDB({ year: '2010' });
      expect(totalElements).toBeDefined();
      expect(totalElements).toBeGreaterThanOrEqual(0);
    });
  });
  describe('getMoviesByYearService', () => {
    it('should list movies by year', async () => {
      const year = 2022;
      const movies = await AwardsService.getMoviesByYearService(year);
      expect(Array.isArray(movies)).toBe(true);
    });

    it('should list movies emty when not found by year', async () => {
      const year = 1999;
      const movies = await AwardsService.getMoviesByYearService(year);
      expect(movies).toEqual([]);
    });
  });
});
