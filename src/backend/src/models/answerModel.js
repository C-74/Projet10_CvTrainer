import db from '../database/db.js'

export function createAnswer({ questionId, answerText, feedback, suggestedAnswer, score }) {
  const stmt = db.prepare(`
    INSERT INTO answers (question_id, answer_text, feedback, suggested_answer, score)
    VALUES (?, ?, ?, ?, ?)
  `)
  return stmt.run(questionId, answerText, feedback, suggestedAnswer, score)
}

export function getAnswersByInterview(interviewId) {
  return db.prepare(`
    SELECT a.* FROM answers a
    JOIN questions q ON a.question_id = q.id
    WHERE q.interview_id = ?
    ORDER BY q.order_index
  `).all(interviewId)
}
