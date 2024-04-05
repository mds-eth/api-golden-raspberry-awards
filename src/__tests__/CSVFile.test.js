import fs from 'fs';
import path from 'path';

import readCSVFile from '../utils/Utils';

describe('CSVFile Test', () => {

  let csvData;

  beforeAll(async () => {

    const csvFilePath = path.join(__dirname, '../../assets/movielist.csv');

    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`Arquivo CSV não encontrado em ${csvFilePath}`);
    }

    csvData = await readCSVFile(csvFilePath)
  });

  test('As colunas esperadas estão presentes', () => {
    const expectedColumns = ['year', 'title', 'studios', 'producers', 'winner'];

    expect(Object.keys(csvData[0])).toEqual(expectedColumns);
  });

  test('Os valores das colunas estão corretos', () => {

    csvData.forEach(entry => {
      expect(typeof entry.year).toBe('string');
      expect(typeof entry.title).toBe('string');
      expect(typeof entry.studios).toBe('string');
      expect(typeof entry.producers).toBe('string');
      expect(typeof entry.winner).toBe('string');
    });
  });
});
