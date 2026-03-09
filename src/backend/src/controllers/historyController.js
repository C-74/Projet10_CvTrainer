// Lister tous les entretiens passés
export async function list(req, res) {
  // TODO: récupérer la liste des entretiens depuis la BDD
  res.json({ interviews: [] })
}

// Récupérer un entretien par ID
export async function getById(req, res) {
  // TODO: récupérer un entretien spécifique
  res.json({ interview: null })
}
