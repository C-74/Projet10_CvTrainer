/**
 * openaiService.js — Client Azure OpenAI
 * 
 * Initialise et exporte le client Azure OpenAI configuré avec
 * les variables d'environnement (.env). Ce client est utilisé
 * par chatService.js et cvExtractorService.js.
 * 
 * Variables requises :
 * - AZURE_OPENAI_API_KEY : Clé d'API Azure
 * - AZURE_OPENAI_ENDPOINT : URL de la ressource Azure OpenAI
 * - AZURE_OPENAI_API_VERSION : Version de l'API (ex: 2024-02-15-preview)
 * - AZURE_OPENAI_DEPLOYMENT : Nom du déploiement du modèle (ex: gpt-4o)
 */
import { AzureOpenAI } from 'openai'

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT
})

export default client
