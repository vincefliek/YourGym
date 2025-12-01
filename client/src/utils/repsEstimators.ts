/**
 * Epley Formula
 * @link https://en.wikipedia.org/wiki/One-repetition_maximum#Estimation_methods
 */
export function estimate1RepMax(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

/**
 * Reverse Epley Formula
 */
export function estimateWeightFrom_1_RepMax(
  oneRepMax: number,
  targetReps: number,
): number {
  return oneRepMax / (1 + targetReps / 30);
}

export function estimate_4_RepsWeight(oneRepMax: number): number {
  return estimateWeightFrom_1_RepMax(oneRepMax, 4);
}
