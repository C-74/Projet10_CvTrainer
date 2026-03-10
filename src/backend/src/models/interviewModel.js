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

export function updateCvData(id, { cvText, cvData }) {
  return db.prepare(`
    UPDATE interviews SET cv_text = ?, cv_data = ?, updated_at = datetime('now') WHERE id = ?
  `).run(cvText, JSON.stringify(cvData), id)
}

export function deleteInterview(id) {
  db.prepare('DELETE FROM messages WHERE interview_id = ?').run(id)
  db.prepare('DELETE FROM answers WHERE question_id IN (SELECT id FROM questions WHERE interview_id = ?)').run(id)
  db.prepare('DELETE FROM questions WHERE interview_id = ?').run(id)
  db.prepare('DELETE FROM reviews WHERE interview_id = ?').run(id)
  return db.prepare('DELETE FROM interviews WHERE id = ?').run(id)
}
