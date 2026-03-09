# Spécifications du projet

Ce fichier permet d'avoir une petite vue d'ensemble du projet, afin de notamment de guider l'agent IA

## Architecture

* **FrontEnd :** VueJS + TailwindCSS
* **BackEnd :** Express.JS (Mode API)
* **BDD :** SQLite
* **Modèle IA utilisé :** OpenAI GPT-4o (via clé Azure)

## Users stories

* Un utilisateur peut envoyer son CV et une description du poste pour que l'IA prennent conaissance
* L'IA peut proposer 5-7 questions à l'utilisateur en fonction du CV et de la description du poste
* Un utilisateur peut répondre aux questions de l'IA
* L'IA peut proposer varier la difficulté des questions suivanteen fonction de la réponse précédente (réponse faible → question de relance, réponse forte → question plus dure)
* Un utilisateur peut consulter son bilan (avec feedback + pistes d'amélioration à la fin de l'entretien)
* Un utilisateur peut accéder a des "réponses suggérées" que l'IA peut proposer a la fin de l'entretien pour chaque question
* Un utilisateur peut activer un mode timer pour lui ajouter de la difficulter
* Un utilisateur peut accéder a des anciens CV/ description de poste, afin de revenir plus tard dessus
