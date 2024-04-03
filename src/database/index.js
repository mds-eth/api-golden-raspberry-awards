import fs from 'fs';
import path from 'path';

import csv from 'csv-parser';
import Datastore from 'nedb';

class DatabaseMemory {

  constructor() {
    this.init();
    this.totalElements = 0;
  }
  async init() {

    try {

      const csvFilePath = path.join(__dirname, '../../assets/movielist.csv');

      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`Arquivo CSV não encontrado em ${csvFilePath}`);
      }

      this.db = new Datastore();

      let i = 0;
      fs.createReadStream(csvFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          this.totalElements++;
          const data = {
            year: row.year,
            title: row.title,
            studios: row.studios,
            producers: row.producers,
            winner: row.winner === 'yes' ? true : false
          };

          this.db.insert(data);
        })
        .on('end', () => {
          console.log(`Arquivo CSV lido com sucesso. Foram inseridos: ${this.totalElements} registros no NeDB.`);
        });
      console.log('\x1b[32mConectado ao banco de dados NeDB\x1b[0m');
    } catch (error) {
      console.error('\x1b[31mErro ao conectar ao banco de dados NeDB\x1b[0m', error);
    }
  }
}

export default new DatabaseMemory();
