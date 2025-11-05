import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors'

import { initSupabase } from './src/db/index.js';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: 'server/.env' });
}

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'https://vincefliek.github.io/YourGym/' }));

const port = 3100;

const supabase = initSupabase();

app.get('/', (req, res) => {
  res.send('YourGym server welcomes you!');
});

app.get('/api/workouts', async (req, res) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

app.post('/api/workouts', async (req, res) => {
  // const { exercise, reps, weight, date } = req.body;

  // const { data, error } = await supabase
  //   .from('workouts')
  //   .insert([{ exercise, reps, weight, date }]);

  // if (error) return res.status(400).json({ error: error.message });
  // res.json(data);
})

app.listen(port, () => {
  console.log(`YourGym server is listening on port ${port}`);
});
