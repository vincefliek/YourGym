const express = require('express');
const app = express();
const port = 3100;

// process.env.DB_URL
// process.env.DB_KEY

app.get('/', (req, res) => {
  res.send('YourGym server welcomes you!');
});

app.listen(port, () => {
  console.log(`YourGym server is listening on port ${port}`);
});
