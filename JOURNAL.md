Session 1 — Objectif : Initialiser la structure du projet et guider l'agent IA pour la suite du développement.

Prompt : "Hello, je souhaite réaliser une petite application web permettant de faire une simulation d'entretien d'embauche avec une IA. Tu trouveras pour commencer dans le fichier Spec.md les spécifications du projet qui contient les technos que je veux utiliser puis quelques user stories. Mais tout d'abord peux tu initialiser la structure du projet en créant les dossiers et fichiers nécessaires pour le FrontEnd, le BackEnd, et la BDD ? D'ailleurs pour SQLLit demande moi ce que je dois faire de mon coté pour que ça foncitonne car je n'ai jamais utiliser cette BDD. Et dernière chose, peux tu faire ce projet dans le dossier /src ? Ne prends pas en compte le fichier Journal.md, c'est pour moi et ça n'a rien a voir avec le développement."

Résultat : L'agent IA a bien initialisé la structure du projet avec les technos que j'ai demandé. Il m'a aussi expliquer comment installer les dépendences nécéssaires et n'a rien ajouté de plus que je lui ai demandé.

Apprentissage : Bien demander à l'IA quel outils supplémentaire a installer, car pour SQLite, je devais installer un package npm qui par la suite n'a pas reussi a s'installer, il y avait donc une deuxième solution qui était de passer par le site officiel de icrosoft (pas besoin d'un deuxième prompt)

---

Session 2 — Objectif : Modifier l'interface Frontend

Prompt : "Ok génial, maintenant passons a l'étape suivante qui est le design de l'application. En gros quand j'arrive sur la page, ça me propose un champ de texte "Description de l'offre", ainsi qu'un Input pour inserer un CV (PDF uniquement), dès qu'il cliquera sur envoyer, ça lui modifiera la page pour passer en mode "Chat avec l'IA". On aura 3 parties dans cette page. On aura la partie centrale avec le chat. A droite, un rappel avec la descritpion de l'offre et un aperçu du CV. Et a gauche un historique qui enregistre les CV et description d'offre. On verra après pour l'OCR/extraction de données pour le backend car c une partie importante."

Problème : A première vue, l'affichage à l'air de correspondre a ce que je voudrais, mais dès que je souhaite cliquer sur le bouton upload avec ma description et mon cv, il bloque et met une erreur sur la console.

Solution : Je lui ai fournit une capture d'écran avec l'erreur de la console du navigateur en lui précisant que cela se provoque quand je clique sur le bouton "upload". Et il m'a donc corrigé le problème, qui venait du fait que la BDD n'était pas configuré (pas de migration et de liens avec les contrôleurs).

Apprentissage : Ne pas oublier de faire d'inclures les fonctionnalités quand des inputs sont sur une page

---

Session 3 — Objectif : Extraction des informations du CV

Prompt : " Ok, maintenant passons à l'étape suivante : l'extraction d'information du CV : Il faudrait extraire les informations les plus importantes :

- Informations principales : Nom, préniom, perfmifié...
- Formations
- Experiences
- Compétences
- Centres d'intérêts

Je te fournis mon CV en guise d'exemple pour que tu vois ce qui peut être intéréssant à ajouter" + un CV

Problème : Le backend ne veut pas se lancer car il semble que le module permettant d'extraire du texte via le pdf n'a pas bien été importé + j'ai l'impression que l'Agent veut utiliser ma clé OpenIA pour séparer les données du pdf parser.

Solution : Je suis allé sur la documentation de pdfparse, et j'ai corrigé l'importation qui était mal interprété. Et j'ai demandé à l'Agent IA de ne pas utilisé la clé OpenAI pour ceci et à la place de créer par la suite un outil permettant d'extraire les informations et de les structurer dans un format JSON afin que ça puisse afficher propement sur le navigateur et de faciliter pour plus tard le traitement du CV sur L'IA.

Problème bis : L'extraction de CV marche très bien sur mon CV personnel. Mais ne marche pas parfaitement sur d'autre CV (champs manquants, informations qui ne vont pas dans certains endroits).

Solution bis : Passer par un Agent IA, je pense que ça sera mieux car avec les nouveaux CV, c'est extrêmement dur d'extraire les informations comme c'est différent à chaque fois.

Résultat : N'importe quel CV s'affiche très bien sur le navigateur

Apprentissage : Il est mieux conseillé d'utiliser l'IA pour extraire des données d'un PDF, surtout dans ces années là où les PDF sont crées sur Canva et sont donc désoordonés. Extraire manuellement à l'aide de Regex est un cauchemard comme chaque CV sont différents.

---

Session 4 — Objectif : Simulation d'entretien + feedback

Prompt : "Ok, maintenant qu'on a tout, tu peux regarder le fichier spec.md et faire les user stories concernant la conversation, tu as noramlement toute les informations.

D'ailleurs avant ça, clean la BDD avec les upload comme ça ça fait propre. Et en plus fait en sorte de mettre une croix des conversations a gauche de l'écran, comme ça on peut delete facilement"

Problème : Après l'upload, la conversation ne se lance pas (problème au FrontEnd)

Solution : Je lui ai fourni une capture d'écran de l'érreur, et la conversation marche bien désormais.

Résultat : Il me pose des questions et réponds bien aux miennes avec des feedbacks.

Apprentissage : L'utilisation d'un spec.md pour placer les users story's est intéréssant car cela permet de liberer de la place au niveau du prompt

---

Session 5 — Objectif : Amélioration du Front-End et de l'affichage

Prompt : "C'est super bien, maintenant je voudrais améliorer l'esthethisme :

- Deja quand l'entretien est terminé, fait disparaitre la barre de réponse en bas.
- Pour le feedback, au lieu d'un message, fait apparaitre un bloc qui prend toute la largeur qui fait un vrai feedback avec une mise en forme (struturation JSON ?) au lieu d'un simple message.
- Pour les petits feedbacks peandant la conversation, ça serai bien de séparer avec les conversations (un petit bouton pour faire aparaitre et disparaitre le feedback)
- Aussi ça serai bien que en haut de la page, j'ai une barre de progression de l'entretien"

Résultat : Il m'a bien effectué ce que je voulais (feedbacks cachés sur les réponses, barre de progretion), et avec un UI très bien réalisé, bilan final.

---

Session 6 — Objectif : Mise en place de l'historique des entretiens :

Prompt : "Ok très bien, maintenant je voudrais mettre en place l'historique. On a actuellement à gauche de l'écran un résumé des conversation précédente, mais quand on clique dessus, il ne se passe rien (logique j'avais pas encore implémenter). Ducoup je voudrais simplement qu'on sauvegarde la conversation avec le bilan et feedback afin que la personne puisse y retourner plus tard s'il le souhaite.

De plus l'historique de conversation a gauche, je voudrais qu'elle soit acessible aussi dès qu'on arrive sur la main page"

Problème : Quand je clique sur un élement de l'historique, il ne se passe rien

Solution : J'ai demander a mon agent IA de regarder pourquoi cela ne fonctionnait pas et il a corrigé le problème, maintenant je peux switcher facilement entre les différents entretiens.

Apprentissage : Ne pas oublier de lui spécifier la partie front, je pense qu'il l'a oublié et c'est peut etre pour ça que ça ne fonctionnais pas.

---

Session 7 — Objectif : Mise en place du Timer :

Prompt : "On va passer a la dernière fonctionnalité, comme tu le vois dans le spec.md, il reste une user story, et c'est le mode timer. En gros on peux définir un chronomètre que l'utilisateur peut configurer et que ce chronomètre arrete l'entretien automatiquement et passe directement au bilan si le temps est ecoulé. je voudrais faire en sorte d'ajouter une lueure rouge quand le temps risque bientot d'etre ecoulé (genre 1min avant)"

Problème : Lorsque le timer atteignait 0, le message qui dit que le temps était écoulé aparraissait bien, mais je pouvais quand meme continuer l'entretien. Et le bilan ne s'affichait pas. De plus, quand j'avais essayé de continuer l'entretien, j'ai obtenu une erreur.

Solution : J'ai expliqué à l'agent le problème de timer que j'avais, et il m'a pu corriger la majorité des problèmes, par contre il m'a expliqué que l'erreur que j'ai obtenu pour le message envoyé après le timer, n'est pas provoqué par mon code, mais par un "Time Out" des serveurs OpenAI comme je n'avait pas répondu pendant 5min.

--- Session 8 — Objectif : Documentation :

Prompt : "L'application est super bien, pour la dernière étape, fais un READ.me pour la documentation (expliquant le projet, l'architecture, MCD, schéma de communication avec l'IA..., arbre des dossier). Et aussi commente le code dans le backend et frontend."

Résultat : L'agent à bien rédigé un README.md complet et à commenté le code.
