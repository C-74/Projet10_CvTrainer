import db from '../database/db.js'

export function createQuestion({ interviewId, questionText, difficulty, orderIndex }) {
  const stmt = db.prepare(`
    INSERT INTO questions (interview_id, question_text, difficulty, order_index)
    VALUES (?, ?, ?, ?)
  `)
  return stmt.run(interviewId, questionText, difficulty, orderIndex)
}

export function getQuestionsByInterview(interviewId) {
  return db.prepare('SELECT * FROM questions WHERE interview_id = ? ORDER BY order_index').all(interviewId)
}
