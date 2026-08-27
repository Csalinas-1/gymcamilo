// Cloudflare Pages Function: /api/sync
// Receives workout sessions, PRs, and custom links and saves them in Cloudflare D1

interface Env {
  DB?: any // Cloudflare D1 Database Binding
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context
    const body = await request.json() as any
    const { history = [], prs = {}, customLinks = {} } = body

    // If Cloudflare D1 is bound (env.DB)
    if (env.DB) {
      const db = env.DB

      // 1. Sync PRs
      for (const prKey of Object.keys(prs)) {
        const pr = prs[prKey]
        await db.prepare(`
          INSERT INTO personal_records (exercise_id, exercise_name, max_weight, reps_at_max, estimated_1rm, achieved_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(exercise_id) DO UPDATE SET
            max_weight = excluded.max_weight,
            reps_at_max = excluded.reps_at_max,
            estimated_1rm = excluded.estimated_1rm,
            achieved_at = excluded.achieved_at
        `).bind(
          pr.exerciseId,
          pr.exerciseName,
          pr.maxWeight,
          pr.repsAtMaxWeight,
          pr.estimated1RM,
          pr.date
        ).run()
      }

      // 2. Sync Workouts & Sets
      for (const workout of history) {
        await db.prepare(`
          INSERT OR IGNORE INTO workouts (id, day_id, day_name, title, started_at, ended_at, duration_seconds, total_volume_kg)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          workout.id,
          workout.dayId,
          workout.dayName,
          workout.title,
          workout.startedAt,
          workout.endedAt || null,
          workout.durationSeconds || null,
          workout.totalVolumeKg || 0
        ).run()

        if (workout.logs) {
          for (const exKey of Object.keys(workout.logs)) {
            const exLog = workout.logs[exKey]
            for (const set of exLog.sets || []) {
              const setId = `${workout.id}_${exLog.exerciseId}_${set.setNumber}`
              await db.prepare(`
                INSERT OR REPLACE INTO workout_sets (id, workout_id, exercise_id, exercise_name, set_number, weight, reps, rpe, completed, completed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(
                setId,
                workout.id,
                exLog.exerciseId,
                exLog.activeName,
                set.setNumber,
                set.weight || 0,
                set.reps || 0,
                set.rpe || null,
                set.completed ? 1 : 0,
                set.completedAt || null
              ).run()
            }
          }
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Sincronizado con Cloudflare D1 exitosamente',
        syncedAt: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fallback response for local dev or when D1 binding is pending
    return new Response(JSON.stringify({ 
      success: true, 
      mode: 'offline_or_local',
      message: 'Datos recibidos correctamente. Cloudflare D1 listo para vincular.',
      syncedAt: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Error al procesar la sincronización con Cloudflare D1' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function onRequestGet(context: { env: Env }) {
  const { env } = context
  if (env.DB) {
    try {
      const workouts = await env.DB.prepare('SELECT * FROM workouts ORDER BY started_at DESC LIMIT 50').all()
      const prs = await env.DB.prepare('SELECT * FROM personal_records').all()
      return new Response(JSON.stringify({ 
        success: true, 
        workouts: workouts.results,
        prs: prs.results 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 })
    }
  }

  return new Response(JSON.stringify({ message: 'Cloudflare Pages Functions API OK' }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
