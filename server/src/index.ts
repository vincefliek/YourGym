import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
// @ts-ignore
import cookieParser from 'cookie-parser';
// @ts-ignore
import helmet from 'helmet';

import { initSupabase } from './db';
import {
  registerAuthRoutes,
  createRequireAuthMiddleware,
} from './auth';
import { routes } from './routes';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env' });
}

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(cookieParser());

const port = 3100;

const supabase = initSupabase();
const requireAuth = createRequireAuthMiddleware(supabase);

registerAuthRoutes(app, supabase);

app.get('/', (req, res) => {
  res.send('YourGym server welcomes you!');
});

app.get(routes.workouts, requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('completed_exercises')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data)
})

app.post(routes.workouts, requireAuth, async (req, res) => {
  const { type, reps, weight, date } = req.body;
  const user = (req as any).auth.user;

  const { data, error } = await supabase
    .from('completed_exercises')
    .insert([{ type, reps, weight, date, user_id: user.id }])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

app.get(routes.profile, requireAuth, async (req, res) => {
  const user = (req as any).auth.user;

  res.json({ user });
});

app.listen(port, () => {
  console.log(`YourGym server is listening on port ${port}`);
});
