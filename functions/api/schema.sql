-- FitTrack Pro Cloudflare D1 SQLite Database Schema

CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  day_id TEXT NOT NULL,
  day_name TEXT NOT NULL,
  title TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  duration_seconds INTEGER,
  total_volume_kg INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id TEXT PRIMARY KEY,
  workout_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight REAL,
  reps INTEGER,
  rpe INTEGER,
  completed INTEGER DEFAULT 0,
  completed_at TEXT,
  FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_records (
  exercise_id TEXT PRIMARY KEY,
  exercise_name TEXT NOT NULL,
  max_weight REAL NOT NULL,
  reps_at_max INTEGER NOT NULL,
  estimated_1rm REAL NOT NULL,
  achieved_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_links (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
