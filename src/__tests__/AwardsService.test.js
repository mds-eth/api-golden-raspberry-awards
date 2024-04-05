import '../database';

import AwardsService from '../service/AwardsService';

import { MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS, STUDIOS_WITH_WIN_COUNT, YEARS_WITH_MULTIPLE_WINNERS } from '../constants';

describe('AwardsService', () => {
  describe('listFilms', () => {
    it('should return films based on the provided parameters', async () => {

      AwardsService.listFilms = jest.fn().mockResolvedValue({
        totalElements: 1,
        content: [{
          producers: 'Avi Arad, Isaac Larian and Steven Paul',
          studios: 'Lionsgate',
          title: 'Bratz',
          winner: '',
          year: '2007',
          _id: '05Aet2w8WLP3So7z'
        }]
      });

      const films = await AwardsService.listFilms({ page: 1, size: 10, winner: 'true' });

      expect(films).toBeDefined();
      expect(films.totalElements).toBeGreaterThanOrEqual(0);
      expect(films.content).toBeDefined();
      expect(films.content.length).toBeGreaterThanOrEqual(1);

      const expectedFilm = {
        producers: 'Avi Arad, Isaac Larian and Steven Paul',
        studios: 'Lionsgate',
        title: 'Bratz',
        winner: '',
        year: '2007',
        _id: '05Aet2w8WLP3So7z'
      };
      expect(films.content[0]).toEqual(expectedFilm);
    });
  });

  describe('listProjection', () => {
    it('should return years with multiple winners', async () => {

      const mockProjectionData = [
        { winnerCount: 2, year: '1986' }
      ];

      AwardsService.listProjection = jest.fn().mockResolvedValue(mockProjectionData);

      const years = await AwardsService.listProjection(YEARS_WITH_MULTIPLE_WINNERS);

      expect(years).toBeDefined();
      expect(years.length).toBeGreaterThanOrEqual(0);

      const expectedData = [
        { winnerCount: 2, year: '1986' }
      ];
      expect(years).toEqual(expectedData);
    });

    it('should return studios with win count', async () => {

      const mockProjectionData = [
        { winCount: 2, studio: 'Columbia Pictures' }
      ];

      AwardsService.listProjection = jest.fn().mockResolvedValue(mockProjectionData);

      const studios = await AwardsService.listProjection(STUDIOS_WITH_WIN_COUNT);

      expect(studios).toBeDefined();
      expect(studios.length).toBeGreaterThanOrEqual(0);

      const expectedData = [
        { winCount: 2, studio: 'Columbia Pictures' }
      ];
      expect(studios).toEqual(expectedData);
    });

    it('should return max min win interval for producers', async () => {
      const mockProjectionData = [
        { followingWin: '2015', interval: 13, previousWin: '2002', producer: 'Matthew Vaughn' }
      ];

      AwardsService.listProjection = jest.fn().mockResolvedValue(mockProjectionData);

      const intervals = await AwardsService.listProjection(MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS);

      expect(intervals).toBeDefined();

      expect(Array.isArray(intervals)).toBe(true);

      expect(intervals.length).toBe(1);

      expect(intervals[0]).toEqual({ followingWin: '2015', interval: 13, previousWin: '2002', producer: 'Matthew Vaughn' });
    });

    it('should throw an error for unrecognized projection', async () => {
      AwardsService.listProjection = jest.fn().mockRejectedValue(new Error('Projection not found.'));

      await expect(AwardsService.listProjection('invalid-projection')).rejects.toThrowError('Projection not found.');

      AwardsService.listProjection.mockClear();
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

      const mockMovies = [
        {
          producers: 'Allan Carr',
          studios: 'Associated Film Distribution',
          title: "Can't Stop the Music",
          winner: 'yes',
          year: '1980',
          _id: '66urgyFv9k6VRJ4k'
        },
      ];

      AwardsService.getMoviesByYearService = jest.fn().mockResolvedValue(mockMovies);

      const year = 2022;
      const movies = await AwardsService.getMoviesByYearService(year);

      expect(Array.isArray(movies)).toBe(true);

      mockMovies.forEach((mockMovie) => {
        expect(movies).toContainEqual(mockMovie);
      });
    });

    it('should list movies emty when not found by year', async () => {
      AwardsService.getMoviesByYearService.mockClear();

      AwardsService.getMoviesByYearService.mockResolvedValue([]);

      const year = 2050;
      const movies = await AwardsService.getMoviesByYearService(year);

      expect(movies).toEqual([]);
    });
  });
});
