const fs = require('fs');
const csv = require('csv-parser');

async function readCSVFile(csvFilePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    let headers = null;
    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        if (!headers) {
          headers = Object.keys(row);
        }

        const rowData = {};

        headers.forEach(header => {
          rowData[header] = row[header];
        });

        data.push(rowData);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = readCSVFile;
