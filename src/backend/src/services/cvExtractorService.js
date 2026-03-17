/**
 * cvExtractorService.js — Pipeline d'extraction et structuration de CV PDF
 * 
 * Ce service gère le processus en 2 étapes :
 * 1. Extraction du texte brut depuis un fichier PDF (via pdf-parse)
 * 2. Structuration des données en JSON via GPT-4o
 * 
 * Le JSON résultant contient : identité, formations, expériences,
 * compétences et centres d'intérêt du candidat.
 */
import fs from 'fs'
import { createRequire } from 'module'
import openaiClient from './openaiService.js'

// pdf-parse utilise CommonJS, on crée un require() pour l'importer en ESM
const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse')

/**
 * Extrait le texte brut d'un fichier PDF.
 * Lit le fichier en buffer puis utilise pdf-parse pour extraire le contenu textuel.
 * 
 * @param {string} filePath - Chemin absolu vers le fichier PDF
 * @returns {Promise<string>} Texte brut extrait du PDF
 */
export async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath)
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  const result = await parser.getText({ pageJoiner: '' })
  return result.text
}

/**
 * Prompt d'extraction IA : définit le schéma JSON attendu pour structurer
 * les données du CV. L'IA analyse le texte brut et retourne un objet JSON
 * respectant strictement cette structure.
 */
const CV_EXTRACTION_PROMPT = `Tu es un expert en extraction de données de CV. Analyse le texte brut suivant extrait d'un CV PDF et retourne un objet JSON structuré.

IMPORTANT :
- Extrais TOUTES les informations présentes, même si le format est inhabituel
- Si une information n'est pas trouvée, utilise une chaîne vide "" ou un tableau vide []
- Retourne UNIQUEMENT le JSON, sans texte avant ou après
- Les missions doivent être des phrases courtes décrivant les tâches

Le JSON doit respecter EXACTEMENT cette structure :
{
  "identite": {
    "nom": "Nom de famille",
    "prenom": "Prénom",
    "titre": "Titre professionnel ou intitulé (ex: Développeur Web, Étudiant en Master...)",
    "email": "email@example.com",
    "telephone": "06 12 34 56 78",
    "adresse": "Adresse complète",
    "permis": "B",
    "nationalite": "Française",
    "dateNaissance": "1 janvier 2000",
    "profil": "Texte de présentation / résumé du profil si présent"
  },
  "formations": [
    {
      "diplome": "Nom du diplôme",
      "etablissement": "Nom de l'établissement",
      "periode": "2020 - 2023",
      "details": "Détails supplémentaires"
    }
  ],
  "experiences": [
    {
      "poste": "Intitulé du poste",
      "entreprise": "Nom de l'entreprise",
      "periode": "Jan 2023 - Juin 2023",
      "missions": ["Mission 1", "Mission 2"]
    }
  ],
  "competences": {
    "informatique": ["Compétence 1", "Compétence 2"],
    "langues": [
      { "langue": "Anglais", "niveau": "B2" }
    ]
  },
  "centresInteret": ["Intérêt 1", "Intérêt 2"]
}`

/**
 * Envoie le texte brut du CV à GPT-4o pour le structurer en JSON.
 * Utilise response_format: json_object pour garantir un JSON valide.
 * 
 * @param {string} rawText - Texte brut extrait du PDF
 * @returns {Promise<Object>} Données structurées du CV
 */
async function structureCvDataWithAI(rawText) {
  const response = await openaiClient.chat.completions.create({
    messages: [
      { role: 'system', content: CV_EXTRACTION_PROMPT },
      { role: 'user', content: rawText }
    ],
    temperature: 0,             // Température basse pour une extraction fiable
    max_tokens: 4000,
    response_format: { type: 'json_object' }  // Force le retour JSON valide
  })

  const content = response.choices[0].message.content
  return JSON.parse(content)
}

/**
 * Pipeline complet d'extraction de CV : PDF → texte brut → JSON structuré.
 * Combine l'extraction PDF et la structuration IA en une seule fonction.
 * 
 * @param {string} filePath - Chemin absolu vers le fichier PDF
 * @returns {Promise<{rawText: string, structured: Object}>} Texte brut + données structurées
 */
export async function extractCvData(filePath) {
  const rawText = await extractTextFromPdf(filePath)
  const structured = await structureCvDataWithAI(rawText)
  return { rawText, structured }
}
