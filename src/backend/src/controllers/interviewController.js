// Créer un nouvel entretien
export async function create(req, res) {
  // TODO: sauvegarder le CV et la description de poste
  res.status(201).json({ message: 'Entretien créé' })
}

// Générer les questions via l'IA
export async function generateQuestions(req, res) {
  // TODO: appeler l'IA pour générer 5-7 questions
  res.json({ message: 'Questions générées' })
}

// Soumettre une réponse
export async function submitAnswer(req, res) {
  // TODO: enregistrer la réponse et adapter la difficulté
  res.json({ message: 'Réponse enregistrée' })
}

// Obtenir le bilan
export async function getReview(req, res) {
  // TODO: générer le bilan avec feedback et pistes d'amélioration
  res.json({ message: 'Bilan généré' })
}
