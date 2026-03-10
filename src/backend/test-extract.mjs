import 'dotenv/config'
import { extractCvData, extractTextFromPdf } from './src/services/cvExtractorService.js'

const filePath = './uploads/1773128354636-257843290-CV Gwenole Le Thoer.pdf'

console.log('Extraction du texte brut...')
const rawText = await extractTextFromPdf(filePath)
console.log('Texte brut extrait (' + rawText.length + ' caractères)')

console.log('\nAppel GPT-4o pour structurer le CV...')
const { structured } = await extractCvData(filePath)
console.log('\n=== RÉSULTAT ===')
console.log(JSON.stringify(structured, null, 2))
