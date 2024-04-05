import fs from 'fs';
import path from 'path';

import Datastore from 'nedb';
import readCSVFile from '../utils/Utils';

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

      const dataFilms = await readCSVFile(csvFilePath);

      this.db.insert(dataFilms);

      console.log(`Arquivo CSV lido com sucesso. Foram inseridos: ${dataFilms.length} registros no NeDB.`);

      console.log('\x1b[32mConectado ao banco de dados NeDB\x1b[0m');

    } catch (error) {
      console.error('\x1b[31mErro ao conectar ao banco de dados NeDB\x1b[0m', error);
    }
  }
}

export default new DatabaseMemory();
