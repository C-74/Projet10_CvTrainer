Session 1 — Objectif : Initialiser la structure du projet et guider l'agent IA pour la suite du développement.

Prompt : "Hello, je souhaite réaliser une petite application web permettant de faire une simulation d'entretien d'embauche avec une IA. Tu trouveras pour commencer dans le fichier Spec.md les spécifications du projet qui contient les technos que je veux utiliser puis quelques user stories. Mais tout d'abord peux tu initialiser la structure du projet en créant les dossiers et fichiers nécessaires pour le FrontEnd, le BackEnd, et la BDD ? D'ailleurs pour SQLLit demande moi ce que je dois faire de mon coté pour que ça foncitonne car je n'ai jamais utiliser cette BDD. Et dernière chose, peux tu faire ce projet dans le dossier /src ? Ne prends pas en compte le fichier Journal.md, c'est pour moi et ça n'a rien a voir avec le développement."

Résultat :  L'agent IA a bien initialisé la structure du projet avec les technos que j'ai demandé. Il m'a aussi expliquer comment installer les dépendences nécéssaires et n'a rien ajouté de plus que je lui ai demandé.

Apprentissage : Bien demander à l'IA quel outils supplémentaire a installer, car pour SQLite, je devais installer un package npm qui par la suite n'a pas reussi a s'installer, il y avait donc une deuxième solution qui était de passer par le site officiel de icrosoft (pas besoin d'un deuxième prompt)

---

Session 2 — Objectif : Modifier l'interface Frontend

Prompt : "Ok génial, maintenant passons a l'étape suivante qui est le design de l'application. En gros quand j'arrive sur la page, ça me propose un champ de texte "Description de l'offre", ainsi qu'un Input pour inserer un CV (PDF uniquement), dès qu'il cliquera sur envoyer, ça lui modifiera la page pour passer en mode "Chat avec l'IA". On aura 3 parties dans cette page. On aura la partie centrale avec le chat. A droite, un rappel avec la descritpion de l'offre et un aperçu du CV. Et a gauche un historique qui enregistre les CV et description d'offre. On verra après pour l'OCR/extraction de données pour le backend car c une partie importante."

Problème : A première vue, l'affichage à l'air de correspondre a ce que je voudrais, mais dès que je souhaite cliquer sur le bouton upload avec ma description et mon cv, il bloque et met une erreur sur la console.

Solution : Je lui ai fournit une capture d'écran avec l'erreur de la console du navigateur en lui précisant que cela se provoque quand je clique sur le bouton "upload". Et il m'a donc corrigé le problème, qui venait du fait que la BDD n'était pas configuré (pas de migration et de liens avec les contrôleurs).

---

Session 3 — Objectif : Extraction des informations du CV
