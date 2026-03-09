import db from '../database/db.js'

export function createInterview({ cvText, cvFilename, jobDescription, timerEnabled }) {
  const stmt = db.prepare(`
    INSERT INTO interviews (cv_text, cv_filename, job_description, timer_enabled)
    VALUES (?, ?, ?, ?)
  `)
  return stmt.run(cvText, cvFilename, jobDescription, timerEnabled ? 1 : 0)
}

export function getInterviewById(id) {
  return db.prepare('SELECT * FROM interviews WHERE id = ?').get(id)
}

export function getAllInterviews() {
  return db.prepare('SELECT * FROM interviews ORDER BY created_at DESC').all()
}

export function updateInterviewStatus(id, status) {
  return db.prepare('UPDATE interviews SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, id)
}
