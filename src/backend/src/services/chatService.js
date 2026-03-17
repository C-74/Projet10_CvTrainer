import openaiClient from './openaiService.js'

const SYSTEM_PROMPT = `Tu es un recruteur professionnel qui fait passer un entretien d'embauche simulé.

CONTEXTE :
- Tu as accès au CV du candidat et à la description du poste visé.
- Tu dois poser entre 5 et 7 questions pertinentes basées sur le CV et l'offre.
- Adapte la difficulté : si le candidat répond faiblement, pose une question de relance plus simple. Si la réponse est forte, augmente la difficulté.

COMPORTEMENT :
- Commence par te présenter brièvement et poser ta première question (sans balise FEEDBACK pour la première question).
- Pose UNE SEULE question à la fois. Attends la réponse avant de poser la suivante.
- Sois encourageant mais professionnel.
- Après chaque réponse du candidat, donne un bref retour encadré par les balises [FEEDBACK] et [/FEEDBACK], puis pose la question suivante EN DEHORS des balises.
- Exemple de format pour une réponse intermédiaire :
  [FEEDBACK]Bonne réponse, vous avez bien mis en avant votre expérience en développement.[/FEEDBACK]
  Passons à la suite. Comment gérez-vous les conflits au sein d'une équipe technique ?
- Après 5 à 7 questions (selon la qualité des échanges), indique que l'entretien est terminé.
- Quand l'entretien est terminé, génère un bilan complet au format JSON STRICT entre les balises suivantes :

---BILAN---
{"score":7,"maxScore":10,"pointsForts":["Point fort 1","Point fort 2"],"pointsAAmeliorer":["Point 1","Point 2"],"conseilGeneral":"Votre conseil ici","reponsesSuggerees":[{"question":"La question posée","reponseIdeale":"La réponse idéale"}]}
---FIN_BILAN---

Suivi d'un court message de clôture amical.

IMPORTANT :
- Reste dans ton rôle de recruteur. Ne sors jamais de ce rôle.
- Ne réponds pas à des questions hors sujet.
- Sois concis dans tes retours (2-3 phrases max par retour dans les balises FEEDBACK).
- Le JSON du bilan doit être valide et parseable. Pas de commentaires dans le JSON.
- Respecte STRICTEMENT le format des balises [FEEDBACK][/FEEDBACK] et ---BILAN--- ---FIN_BILAN---.`

export async function getChatResponse(cvData, jobDescription, conversationHistory) {
  const contextMessage = `DONNÉES DU CV :\n${JSON.stringify(cvData, null, 2)}\n\nDESCRIPTION DU POSTE :\n${jobDescription}`

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: contextMessage },
    ...conversationHistory
  ]

  const response = await openaiClient.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: 1000
  })

  return response.choices[0].message.content
}

export async function getForceEndResponse(cvData, jobDescription, conversationHistory) {
  const contextMessage = `DONNÉES DU CV :\n${JSON.stringify(cvData, null, 2)}\n\nDESCRIPTION DU POSTE :\n${jobDescription}`

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: contextMessage },
    ...conversationHistory,
    {
      role: 'system',
      content: `Le temps imparti pour l'entretien est écoulé. Tu dois IMMÉDIATEMENT terminer l'entretien.
Ne pose plus de question. Génère directement le bilan complet au format JSON entre les balises ---BILAN--- et ---FIN_BILAN--- en te basant sur les réponses déjà données par le candidat, suivi d'un court message de clôture expliquant que le temps est écoulé.`
    }
  ]

  const response = await openaiClient.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: 2000
  })

  return response.choices[0].message.content
}
