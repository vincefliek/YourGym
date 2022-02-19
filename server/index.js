const express = require('express');
const app = express();
const port = 3100;

app.get('/', (req, res) => {
  res.send('YourGym server welcomes you!');
});

app.listen(port, () => {
  console.log(`YourGym server is listening on port ${port}`);
});
