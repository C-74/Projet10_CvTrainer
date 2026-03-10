import fs from 'fs'
import { createRequire } from 'module'
import openaiClient from './openaiService.js'

const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse')

/**
 * Extrait le texte brut d'un fichier PDF
 */
export async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath)
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  const result = await parser.getText({ pageJoiner: '' })
  return result.text
}

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
 * Structure les données du CV via GPT-4o
 */
async function structureCvDataWithAI(rawText) {
  const response = await openaiClient.chat.completions.create({
    messages: [
      { role: 'system', content: CV_EXTRACTION_PROMPT },
      { role: 'user', content: rawText }
    ],
    temperature: 0,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0].message.content
  return JSON.parse(content)
}

/**
 * Pipeline complet : PDF → texte brut → structuration IA
 */
export async function extractCvData(filePath) {
  const rawText = await extractTextFromPdf(filePath)
  const structured = await structureCvDataWithAI(rawText)
  return { rawText, structured }
}
