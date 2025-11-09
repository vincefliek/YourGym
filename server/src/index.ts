import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import { initSupabase } from './db';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env' });
}

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

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

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res
      .status(400)
      .json({ error: error.message });
  }

  res.json(data);
});

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res
      .status(400)
      .json({ error: error.message });
  }

  if (!data.session) {
    return res
      .status(400)
      .json({ error: 'No session returned', data });
  }

  const { access_token, refresh_token, expires_in } = data.session;

  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expires_in * 1000,
    path: '/',
  });
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.json(data);
});

app.post('/api/signout', async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return res
      .status(400)
      .json({ error: error.message });
  }

  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });

  res.json({ message: 'Signed out successfully' });
});

app.get('/api/session', async (req, res) => {
  const { access_token } = req.headers;

  if (!access_token) {
    return res
      .status(401)
      .json({ error: 'No access token provided' });
  }

  // @ts-ignore TODO fix
  const { data, error } = await supabase.auth.getUser(access_token);

  if (error) {
    return res
      .status(401)
      .json({ error: error.message });
  }

  res.json({ user: data.user });
});

app.listen(port, () => {
  console.log(`YourGym server is listening on port ${port}`);
});
