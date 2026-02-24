# Dashboard Enhancement Plan - Exercise Progress Stats

## Goal

Add exceptional UI with charts and stats to show per-exercise progress, so users can track improvement and identify areas for growth.

---

## Current State

Your dashboard shows **aggregate metrics only** (total volume & sessions). You have rich per-exercise data available but it's not being visualized.

---

## Available Data

### Per-Exercise Metrics

- **Per Set**: repetitions, weight (kg), completion status, timestamp
- **Per Exercise Session**: date/time completed, all reps and weights for that session
- **Per Exercise**: exercise name, number of sets performed

### Daily Aggregates (Currently Used)

- Total Volume (kg) = sum of all (weight × reps)
- Total Reps
- Sessions Count

---

## Recommended Enhancements

### 1. **Exercise Progress Cards** (Primary Widget)

Create a card for each exercise showing:

- **Max Weight Lifted** - Personal record with date
- **Volume Progression** - Line chart showing total volume per exercise over last 30 days
- **Frequency** - How many times performed in last 30 days
- **Trend Badge** - Visual indicator (↑ improving, → stable, ↓ declining)

**Why**: Immediately see which exercises are your strongest and which need work.

---

### 2. **Strength Comparison Grid** (Secondary Widget)

- **Exercise Ranking** - Sort exercises by max weight or total volume
- **Mini bar chart** - Compare your top 5 exercises side-by-side
- **Show improvement** - Weight/volume increase vs. 30 days ago

**Why**: Quick visual comparison to identify weak points.

---

### 3. **Per-Exercise Detailed View** (Interactive)

For each exercise, show:

- **Weight Progression** - Line chart: weight on Y-axis, date on X-axis
- **Volume Per Session** - Bar chart: total volume (weight × reps) per workout session
- **Sets Breakdown** - Show actual sets (e.g., "5×80kg, 5×85kg, 3×90kg" from last session)

**Why**: Track if you're progressively increasing weight or volume—the core signs of progress.

---

### 4. **Consistency Metrics**

- **Exercise Frequency Heatmap** - Shows which exercises you do regularly
- **Recovery Days** - Days between sessions for each exercise
- **Current Streak** - How many consecutive weeks you've done an exercise

**Why**: Consistency is key to progress. Shows if you're balanced or over/under-training certain muscles.

---

### 5. **Personal Records Dashboard**

Simple grid showing:

- **Max Weight** - Highest weight lifted per exercise
- **Max Reps** - Most reps at any weight
- **PR Date** - When that record was set
- **Days Since PR** - Motivation to beat your record

**Why**: Clear progress metric and motivational factor.

---

## Implementation Roadmap

### Phase 1 - Quick Wins (Highest Impact)

**Estimated scope**: Low complexity, immediate value

1. **Exercise Personal Records** - Simple list/card showing max weight per exercise with date
2. **Exercise Volume Trend** - Mini line charts showing top 3-5 exercises with volume progression

**Files to modify/create**:

- `client/src/model/aggregation.ts` - Add `aggregateByExercise()` and `getExerciseMetrics()`
- `client/src/screens/dashboard/controller.ts` - Add `getExerciseMetrics()` method
- `client/src/screens/dashboard/view.tsx` - Add new sections for PRs and volume trends
- Create `client/src/components/ExerciseMetricsCard/view.tsx` - Reusable exercise card component (optional, can inline first)

---

### Phase 2 - Full Stats

**Estimated scope**: Medium complexity, comprehensive coverage

1. **Exercise Comparison Grid** - All exercises ranked by max weight
2. **Per-Exercise Detail View** - Clickable to expand with detailed charts
3. **Consistency Metrics** - Frequency heatmap and streaks

**Files to modify/create**:

- `client/src/components/ExerciseComparisonGrid/view.tsx`
- `client/src/model/aggregation.ts` - Add consistency calculation functions

---

### Phase 3 - Advanced Analytics

**Estimated scope**: Medium-to-high complexity, nice-to-have features

1. Weight progression prediction
2. Strength curve visualization
3. Advanced filtering and time range selection

---

## Data Flow

### Current

```
completedTrainings → aggregateByDay() → TrainingAggregate[] → Dashboard
```

### Phase 1 Addition

```
completedTrainings → aggregateByExercise() → ExerciseMetrics[] → Exercise Cards/Trends
```

### Data Structure for ExerciseMetrics

```typescript
interface ExerciseMetrics {
  exerciseName: string;
  maxWeight: number;
  maxWeightDate: string; // ISO date
  maxReps: number;
  totalVolume: number; // Sum of weight × reps
  frequency: number; // Times performed in period
  volumeByDate: Array<{
    date: string; // YYYY-MM-DD
    volume: number;
  }>;
  lastPerformed: string; // ISO date
  trend: "improving" | "stable" | "declining";
}
```

---

## Technical Considerations

**Existing Stack**:

- ✅ Recharts component library already in use
- ✅ React with TypeScript
- ✅ Connected component pattern with controllers
- ✅ Exercise history already tracked

**No new dependencies needed** for Phase 1.

---

## Benefits

| Metric                    | Current | With Phase 1 | With Phases 2-3 |
| ------------------------- | ------- | ------------ | --------------- |
| See progress per exercise | ❌      | ✅           | ✅✅            |
| Identify weak exercises   | ❌      | ✅           | ✅✅            |
| Personal records tracking | ❌      | ✅           | ✅              |
| Motivation/Streaks        | ❌      | 🟡           | ✅              |
| Detailed analytics        | ❌      | ❌           | ✅              |

---

## Next Steps

1. Implement Phase 1 aggregation functions
2. Connect to dashboard controller
3. Build UI components for PRs and volume trends
4. Test with real data
5. Iterate based on feedback before Phase 2
