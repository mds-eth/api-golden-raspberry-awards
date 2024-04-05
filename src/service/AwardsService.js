import database from '../database';

import { YEARS_WITH_MULTIPLE_WINNERS, STUDIOS_WITH_WIN_COUNT, MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS } from '../constants';

class AwardsService {
  async listFilms({ page, size, winner, year }) {
    try {

      let query = {};

      if (winner) {
        query.winner = winner === 'true' ? 'yes' : '';
      }

      if (year) {
        query.year = year;
      }

      const skipDocs = (page - 1) * size;

      const data = await new Promise((resolve, reject) => {
        database.db.find(query)
          .skip(skipDocs)
          .limit(Number(size))
          .exec((err, docs) => {
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          });
      });

      return {
        totalElements: await this.getTotalElementsDB(query),
        content: data
      }
    } catch (error) {
      throw error;
    }
  }

  async getMoviesByYearService(year) {
    try {

      const data = await new Promise((resolve, reject) => {
        database.db.find({ year, winner: 'yes' })
          .exec((err, docs) => {
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          });
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async listProjection(projection) {
    try {
      switch (projection) {
        case YEARS_WITH_MULTIPLE_WINNERS:
          return this.yearsWithMultipleWinners();
        case STUDIOS_WITH_WIN_COUNT:
          return this.studiosWithWinCount();
        case MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS:
          return this.maxMinWinIntervalForProducers();
        default:
          throw new Error(`Projection not found.`);
      }
    } catch (error) {
      throw error;
    }
  }

  async yearsWithMultipleWinners() {
    try {
      const winners = await this.getTotalWinners();

      const yearCounts = {};

      winners.forEach((winner) => {
        const year = winner.year;
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      });

      const multipleWinnersYears = Object.keys(yearCounts).filter(year => yearCounts[year] > 1);

      const sortedMultipleWinnersYears = multipleWinnersYears.sort((a, b) => yearCounts[b] - yearCounts[a]);

      return sortedMultipleWinnersYears.map(year => ({ year, winnerCount: yearCounts[year] }));
    } catch (error) {
      throw error;
    }
  }

  async studiosWithWinCount() {
    try {

      const winners = await this.getTotalWinners();

      const studioCounts = {};

      winners.forEach((winner) => {
        const studios = winner?.studios?.split(',').map(s => s.trim());
        studios?.forEach((studio) => {
          studioCounts[studio] = (studioCounts[studio] || 0) + 1;
        });
      });

      const sortedStudios = Object.keys(studioCounts).sort((a, b) => studioCounts[b] - studioCounts[a]);


      return sortedStudios.slice(0, 3).map(studio => ({ studio, winCount: studioCounts[studio] }));
    } catch (error) {
      throw error;
    }
  }

  async maxMinWinIntervalForProducers() {
    try {
      const winners = await this.getTotalWinners();

      let minInterval = [];
      let maxInterval = [];

      for (let i = 1; i < winners.length; i++) {
        const filmsWithSameProducer = winners.filter(winner => winner?.producers.includes(winners[i].producers));
        const sortedFilms = filmsWithSameProducer.sort((a, b) => a.year - b.year);

        const firstFilm = sortedFilms[0];
        const lastFilm = sortedFilms[sortedFilms.length - 1];

        const interval = lastFilm?.year - firstFilm.year;

        if (interval === 0) continue;

        if (maxInterval.length === 0 || interval > maxInterval[0].interval) {
          maxInterval = [{
            producer: firstFilm?.producers,
            interval,
            previousWin: firstFilm?.year,
            followingWin: lastFilm?.year,
          }];
        }

        if (minInterval.length === 0 || interval < minInterval[0].interval) {
          minInterval = [{
            producer: firstFilm?.producers,
            interval: interval,
            previousWin: firstFilm?.year,
            followingWin: lastFilm?.year
          }];
        }
      }

      return { min: minInterval, max: maxInterval }
    } catch (error) {
      throw error;
    }
  }

  async getTotalWinners() {
    return await new Promise((resolve, reject) => {
      database.db.find({ winner: 'yes' }, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    }) || 0;
  }

  async getTotalElementsDB(query) {
    try {

      const length = await new Promise((resolve, reject) => {
        database.db.find(query, (err, docs) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
      });

      return length?.length || 0
    } catch (error) {
      throw error;
    }
  }
}

export default new AwardsService();
