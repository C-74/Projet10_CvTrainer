import db from '../database/db.js'

export function createMessage(interviewId, role, content) {
  return db.prepare(
    'INSERT INTO messages (interview_id, role, content) VALUES (?, ?, ?)'
  ).run(interviewId, role, content)
}

export function getMessagesByInterviewId(interviewId) {
  return db.prepare(
    'SELECT role, content FROM messages WHERE interview_id = ? ORDER BY id ASC'
  ).all(interviewId)
}

export function deleteMessagesByInterviewId(interviewId) {
  return db.prepare('DELETE FROM messages WHERE interview_id = ?').run(interviewId)
}
