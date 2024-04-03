import database from '../database';

import { YEARS_WITH_MULTIPLE_WINNERS, STUDIOS_WITH_WIN_COUNT, MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS } from '../constants';

class AwardsService {
  async listFilms({ page, size, winner, year }) {
    try {

      let query = {};

      if (winner) {
        query.winner = winner === 'true';
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
        database.db.find({ year, winner: true })
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
        const studios = winner.studios.split(',').map(s => s.trim());
        studios.forEach((studio) => {
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

      winners.sort((a, b) => a.year - b.year);

      let minProducer = { interval: Infinity };
      let maxProducer = { interval: -Infinity };

      for (let i = 1; i < winners.length; i++) {
        const interval = winners[i].year - winners[i - 1].year;
        if (interval < minProducer.interval) {
          minProducer = {
            producer: winners[i].producers,
            interval: interval,
            previousWin: winners[i - 1].year,
            followingWin: winners[i].year
          };
        }
        if (interval > maxProducer.interval) {
          maxProducer = {
            producer: winners[i].producers,
            interval: interval,
            previousWin: winners[i - 1].year,
            followingWin: winners[i].year
          };
        }
      }

      return { min: [minProducer], max: [maxProducer] }
    } catch (error) {
      throw error;
    }
  }

  async getTotalWinners() {
    return await new Promise((resolve, reject) => {
      database.db.find({ winner: true }, (err, docs) => {
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
