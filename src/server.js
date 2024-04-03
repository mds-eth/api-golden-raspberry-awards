import 'dotenv/config';

import app from './app';

app.listen(process.env.PORT, () => {
  console.log(`\x1b[33m Server is running in port: ${process.env.PORT} \x1b[0m`);
});

