Session 1 — Objectif : Initialiser la structure du projet et guider l'agent IA pour la suite du développement.

Prompt : "Hello, je souhaite réaliser une petite application web permettant de faire une simulation d'entretien d'embauche avec une IA. Tu trouveras pour commencer dans le fichier Spec.md les spécifications du projet qui contient les technos que je veux utiliser puis quelques user stories. Mais tout d'abord peux tu initialiser la structure du projet en créant les dossiers et fichiers nécessaires pour le FrontEnd, le BackEnd, et la BDD ? D'ailleurs pour SQLLit demande moi ce que je dois faire de mon coté pour que ça foncitonne car je n'ai jamais utiliser cette BDD. Et dernière chose, peux tu faire ce projet dans le dossier /src ? Ne prends pas en compte le fichier Journal.md, c'est pour moi et ça n'a rien a voir avec le développement."

Résultat :  L'agent IA a bien initialisé la structure du projet avec les technos que j'ai demandé. Il m'a aussi expliquer comment installer les dépendences nécéssaires et n'a rien ajouté de plus que je lui ai demandé.

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

Solution bis : Passer par un Agent IA, je pense que ça sera mieux car avec les nouveaux CV, c'est extrêmement dur d'extraire les informations comment c'est différent à chaque fois.

Résultat : N'importe quel CV s'affiche très bien sur le navigateur

---

Session 4 — Objectif : Simulation d'entretien + feedback
