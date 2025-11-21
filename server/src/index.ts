import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { initSupabase as _initSupabase } from './db';
import {
  registerAuthRoutes,
  createRequireAuthMiddleware,
  getAuthDataFromRequest,
} from './auth';
import { routes } from './routes';
import { timeoutMiddleware } from './utils';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env' });
}

const port = 3100;

let initSupabase;

if (process.env.NODE_ENV === 'development') {
  initSupabase = () => _initSupabase();
} else {
  const supabaseInstance = _initSupabase();
  initSupabase = () => supabaseInstance;
}

const requireAuth = createRequireAuthMiddleware(initSupabase);

const app = express();

/**
 * Render hosting provider adds "X-Forwarded-For" header.
 * This means that the server is behind the reserse-proxy,
 * and looks like it's Cloudflare.
 * 
 * The issue was with 'express-rate-limit'.
 * 
 * As a result, it can’t reliably know the real client’s IP,
 * so rate limiting might not work correctly.
 * 
 * Value "1" - because Render.com is behind 1 proxy server, so
 * this value is secure enough.
 */
app.set('trust proxy', 1);
/**
 * Fix weird caching issues.
 * Example 1: status 304 with response body.
 * Example 2: status 200 without response body.
 */
app.disable('etag');

app.use(bodyParser.json({ limit: '100kb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(timeoutMiddleware());

registerAuthRoutes(app, initSupabase);

app.get('/', (req, res) => {
  res.send('YourGym server welcomes you!');
});

/* ------------------ CHECK SESSION ------------------ */

app.get(routes.session, requireAuth, async (req, res) => {
  const { user } = getAuthDataFromRequest(req);

  res.json({ user });
});

/* ------------------ TEMPLATE WORKOUTS ------------------ */

// Get all template workouts with template exercises (single query)
app.get(routes.templateWorkouts, requireAuth, async (req, res) => {
  try {
    const supabase = initSupabase();
    const { data, error } = await supabase
      .from("template_workouts")
      .select("*, template_exercises(*)"); // relational fetch

    if (error) throw error;

    const workouts = data.map(w => {
      let newWorkout = {
        ...w,
        exercises: w.template_exercises || [],
      };
      delete newWorkout.template_exercises;
      return newWorkout;
    });

    res.json(workouts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific template workout with its exercises
app.get(routes.templateWorkout, requireAuth, async (req, res) => {
  const { workoutId } = req.params;

  // TODO add validation

  try {
    const { data, error } = await initSupabase()
      .from("template_workouts")
      .select("*, template_exercises(*)")
      .eq("id", workoutId)
      .single();

    if (error) throw error;

    const workout = {
      ...data,
      exercises: data.template_exercises || []
    };
    delete workout.template_exercises;

    res.json(workout);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create template workout
app.post(routes.templateWorkouts, requireAuth, async (req, res) => {
  const { name } = req.body;
  const user = getAuthDataFromRequest(req).user;

  // TODO add validation

  try {
    const { data, error } = await initSupabase()
      .from("template_workouts")
      .insert([{ user_id: user?.id, name }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update template workout
app.put(routes.templateWorkout, requireAuth, async (req, res) => {
  const { workoutId } = req.params;
  const { name } = req.body;
  const user = getAuthDataFromRequest(req).user;

  // TODO add validation

  try {
    const { data, error } = await initSupabase()
      .from("template_workouts")
      .update({ user_id: user?.id, name })
      .eq("id", workoutId)
      .select()
      .single();

    // TODO better error status
    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete template workout and its template exercises
app.delete(
  routes.templateWorkout,
  requireAuth,
  async (req, res) => {
    const { workoutId } = req.params;

    try {
      const { error: exrcError } = await initSupabase()
        .from("template_exercises")
        .delete()
        .eq("workout_id", workoutId);

      if (exrcError) throw exrcError;

      const { error: wrktError } = await initSupabase()
        .from("template_workouts")
        .delete()
        .eq("id", workoutId);

      if (wrktError) throw wrktError;

      res.json({ message: "Workout and exercises deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

/* ------------------ TEMPLATE EXERCISES ------------------ */

// Create template exercise under a template workout
app.post(
  routes.templateExercises,
  requireAuth,
  async (req, res) => {
    const { workoutId } = req.params;
    const { type, reps, weight, date } = req.body;
    const user = getAuthDataFromRequest(req).user;

    // TODO add validation

    try {
      const { data, error } = await initSupabase()
        .from("template_exercises")
        .insert([{
          workout_id: workoutId,
          user_id: user?.id,
          type,
          reps,
          weight,
          date,
        }])
        .select()
        .single();

      // TODO better error status
      if (error) throw error;

      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

// Update specific template exercise
app.put(
  routes.templateExercise,
  requireAuth,
  async (req, res) => {
    const { exerciseId } = req.params;
    const { type, reps, weight } = req.body;
    const user = getAuthDataFromRequest(req).user;

    // TODO add validation

    try {
      const { data, error } = await initSupabase()
        .from("template_exercises")
        .update({ user_id: user?.id, type, reps, weight })
        .eq("id", exerciseId)
        .select()
        .single();

      // TODO better error status
      if (error) throw error;

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

// Delete specific template exercise
app.delete(
  routes.templateExercise,
  requireAuth,
  async (req, res) => {
    const { exerciseId } = req.params;

    try {
      const { error } = await initSupabase()
        .from("template_exercises")
        .delete()
        .eq("id", exerciseId);

      // TODO better error status
      if (error) throw error;

      res.json({ message: "Exercise deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

/* ------------------ COMPLETED WORKOUTS ------------------ */

// Get all workouts
app.get(routes.workouts, requireAuth, async (req, res) => {
  try {
    const supabase = initSupabase();
    const { data, error } = await supabase
      .from("completed_workouts")
      .select("*, completed_exercises(*)") // relational fetch
      .order('date', { ascending: false });

    if (error) throw error;

    const workouts = data.map(w => {
      let newWorkout = {
        ...w,
        exercises: w.completed_exercises || [],
      };
      delete newWorkout.completed_exercises;
      return newWorkout;
    });

    res.json(workouts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update
app.post(routes.workouts, requireAuth, async (req, res) => {
  const { workouts } = req.body;
  const user = getAuthDataFromRequest(req).user;

  console.log('>> workouts <<', JSON.stringify(workouts));

  try {
    const supabase = initSupabase();

    const preparedData = workouts.map((w: any) => {
      const newW = {
        ...w,
        user_id: user?.id,
        completed_exercises: w.exercises.map((ex: any) => ({
          ...ex,
          user_id: user?.id,
        })),
      };
      delete newW.tempId;
      delete newW.exercises;
      return newW;
    });

    let { data: trainings, error: trainingsError } = await supabase
      .from("completed_workouts")
      .insert(preparedData.map((w: any) => {
        const newW = { ...w };
        delete newW.completed_exercises;
        return newW;
      }))
      .select();

    if (trainingsError) throw trainingsError;
    if (!trainings) throw new Error('NO trainings!!!');

    const exerciseForInsert = trainings.flatMap((tr, index) => {
      return preparedData[index].completed_exercises.map((ex: any) => ({
        ...ex,
        workout_id: tr.id,
      }))
    });

    if (!exerciseForInsert) throw new Error('NO EXERCISES!!!');

    let { data: exercises, error: exercisesError } = await supabase
      .from("completed_exercises")
      .insert(exerciseForInsert)
      .select();

    if (exercisesError) throw exercisesError;
    if (!exercises) throw new Error('NO exercises!!!');

    const result = trainings.map((tr) => ({
      ...tr,
      exercises: exercises.filter(e => e.workout_id === tr.id),
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ------------------ PROFILE ------------------ */

app.get(routes.profile, requireAuth, async (req, res) => {
  const userData = getAuthDataFromRequest(req).user;
  const user = {
    id: userData?.id,
    email: userData?.email,
  }

  res.json({ user });
});

app.listen(port, () => {
  console.log(`YourGym server is listening on port ${port}`);
});
