Session 1 — Objectif : Initialiser la structure du projet et guider l'agent IA pour la suite du développement.

Prompt : "Hello, je souhaite réaliser une petite application web permettant de faire une simulation d'entretien d'embauche avec une IA. Tu trouveras pour commencer dans le fichier Spec.md les spécifications du projet qui contient les technos que je veux utiliser puis quelques user stories. Mais tout d'abord peux tu initialiser la structure du projet en créant les dossiers et fichiers nécessaires pour le FrontEnd, le BackEnd, et la BDD ? D'ailleurs pour SQLLit demande moi ce que je dois faire de mon coté pour que ça foncitonne car je n'ai jamais utiliser cette BDD. Et dernière chose, peux tu faire ce projet dans le dossier /src ? Ne prends pas en compte le fichier Journal.md, c'est pour moi et ça n'a rien a voir avec le développement."

Problème : le code généré stockait les embeddings en mémoire.
Avec 500 chunks, ça crashait au redémarrage (tout perdu).

Solution : j'ai demandé de persister dans un fichier JSON.
Pas optimal mais suffisant pour le MVP.

Apprentissage : toujours penser à la persistance dès le début.