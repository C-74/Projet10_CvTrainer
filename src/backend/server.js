/**
 * server.js — Point d'entrée du serveur backend
 * 
 * Charge les variables d'environnement depuis .env (via dotenv)
 * puis démarre le serveur Express sur le port configuré (défaut: 3000).
 */
import 'dotenv/config'
import app from './src/app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
