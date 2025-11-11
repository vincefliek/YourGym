export const routes = {
  workouts: '/api/workouts',
  workout: '/api/workout',
  templateWorkouts: '/api/template-workouts',
  templateWorkout: '/api/template-workouts/:workoutId',
  templateExercises: '/api/template-workouts/:workoutId/exercises',
  templateExercise: '/api/template-workouts/:workoutId/exercises/:exerciseId',
  profile: '/api/profile',
  signup: '/api/signup',
  signin: '/api/signin',
  logout: '/api/logout',
  session: '/api/session',
  refreshSession: '/api/refresh',
} as const;
