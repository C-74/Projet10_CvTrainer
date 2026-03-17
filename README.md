# 🎯 CV Trainer — Simulateur d'entretien d'embauche avec IA

Application web permettant de simuler un entretien d'embauche avec une intelligence artificielle. L'utilisateur fournit son CV (PDF) et une description de poste, puis l'IA joue le rôle d'un recruteur professionnel en posant des questions adaptatives avec feedback progressif.

## 📦 Technologies

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Vue.js 3 (Composition API) + Vite + TailwindCSS |
| **Backend** | Express.js (ESM, mode API) |
| **Base de données** | SQLite via `better-sqlite3` |
| **IA** | Azure OpenAI GPT-4o |
| **Parsing PDF** | `pdf-parse` + structuration IA |
| **State Management** | Pinia |
| **HTTP Client** | Axios |

---

## 📁 Arborescence du projet

```
Projet10_CvTrainer/
├── README.md
├── JOURNAL.md                          # Journal de développement (sessions)
├── Spec.md                             # Spécifications et user stories
└── src/
    ├── backend/
    │   ├── server.js                   # Point d'entrée Express (port 3000)
    │   ├── package.json
    │   ├── .env                        # Variables d'environnement (Azure OpenAI)
    │   ├── .env.example
    │   ├── data/
    │   │   └── cv_trainer.db           # Base de données SQLite
    │   ├── uploads/                    # Stockage des CV PDF uploadés
    │   └── src/
    │       ├── app.js                  # Configuration Express (CORS, routes)
    │       ├── controllers/
    │       │   ├── interviewController.js  # Création, chat IA, fin forcée
    │       │   └── historyController.js    # Liste, détail, suppression
    │       ├── models/
    │       │   ├── interviewModel.js   # CRUD table interviews
    │       │   ├── messageModel.js     # CRUD table messages
    │       │   ├── questionModel.js    # CRUD table questions
    │       │   └── answerModel.js      # CRUD table answers
    │       ├── services/
    │       │   ├── openaiService.js    # Client Azure OpenAI
    │       │   ├── chatService.js      # Prompts système + logique de chat
    │       │   └── cvExtractorService.js  # Pipeline PDF → JSON via IA
    │       ├── middlewares/
    │       │   └── upload.js           # Multer (upload fichiers PDF)
    │       ├── database/
    │       │   ├── db.js               # Connexion SQLite + config WAL
    │       │   └── migrate.js          # Création des tables
    │       └── routes/
    │           ├── interviewRoutes.js  # Routes /api/interviews/*
    │           └── historyRoutes.js    # Routes /api/history/*
    │
    └── frontend/
        ├── index.html
        ├── package.json
        ├── vite.config.js              # Proxy /api → localhost:3000
        ├── tailwind.config.js
        ├── postcss.config.js
        └── src/
            ├── App.vue                 # Layout principal (navbar + router)
            ├── main.js                 # Point d'entrée Vue (Pinia + Router)
            ├── assets/
            │   └── style.css           # Styles globaux + Tailwind
            ├── router/
            │   └── index.js            # 4 routes (/, /interview, /review, /history)
            ├── stores/
            │   └── interviewStore.js   # State Pinia (entretien, timer)
            ├── services/
            │   └── api.js              # Client Axios (baseURL: /api)
            └── views/
                ├── HomeView.vue        # Page d'accueil (upload + historique)
                ├── InterviewView.vue   # Page de chat (3 panneaux + timer)
                ├── ReviewView.vue      # (placeholder)
                └── HistoryView.vue     # (placeholder)
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      NAVIGATEUR                          │
│                                                          │
│  ┌──────────┐  ┌───────────────────┐  ┌──────────────┐  │
│  │Historique│  │   Chat (centre)   │  │  CV + Offre   │  │
│  │ (gauche) │  │  + Timer + Bilan  │  │   (droite)   │  │
│  └──────────┘  └───────────────────┘  └──────────────┘  │
│          Vue.js 3 + Pinia + Vue Router                   │
└──────────────────────┬───────────────────────────────────┘
                       │ Axios (HTTP /api)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   SERVEUR EXPRESS                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Routes                                          │    │
│  │  POST /api/interviews      → Créer entretien     │    │
│  │  POST /api/interviews/:id/chat → Chat IA         │    │
│  │  POST /api/interviews/:id/end  → Fin forcée      │    │
│  │  GET  /api/interviews/:id/messages → Historique   │    │
│  │  GET  /api/history         → Liste entretiens     │    │
│  │  GET  /api/history/:id     → Détail + messages    │    │
│  │  DELETE /api/history/:id   → Supprimer            │    │
│  └──────────────────────────────────────────────────┘    │
│              │                    │                       │
│              ▼                    ▼                       │
│  ┌────────────────┐   ┌─────────────────────┐            │
│  │   SQLite (BDD) │   │  Azure OpenAI API   │            │
│  │  better-sqlite3│   │    GPT-4o           │            │
│  └────────────────┘   └─────────────────────┘            │
└──────────────────────────────────────────────────────────┘
```

---

## 🗄️ Modèle Conceptuel de Données (MCD)

```
┌──────────────────────────┐
│       INTERVIEWS         │
├──────────────────────────┤
│ id (PK)                  │
│ cv_text          TEXT     │
│ cv_data          TEXT     │  ← JSON structuré du CV
│ cv_filename      TEXT     │
│ job_description  TEXT     │
│ timer_enabled    INTEGER  │
│ status           TEXT     │
│ created_at       TEXT     │
│ updated_at       TEXT     │
└──────────┬───────────────┘
           │ 1
           │
     ┌─────┼──────────┬───────────┐
     │     │          │           │
     │ N   │ N        │ N         │ 1
┌────┴──┐ ┌┴────────┐ ┌┴────────┐ ┌┴──────────┐
│MESSAGES│ │QUESTIONS│ │ REVIEWS │ │  ANSWERS  │
├────────┤ ├─────────┤ ├─────────┤ ├───────────┤
│ id(PK) │ │ id(PK)  │ │ id (PK) │ │ id (PK)   │
│ intv_id│ │ intv_id │ │ intv_id │ │ q_id (FK) │
│ role   │ │ q_text  │ │ g_feedbk│ │ a_text    │
│ content│ │difficlty│ │ tips    │ │ feedback  │
│created │ │order_idx│ │ score   │ │ suggest   │
└────────┘ └─────────┘ └─────────┘ │ score     │
                                   └───────────┘

  QUESTIONS 1──N ANSWERS (une question peut avoir une réponse)
```

**Relations :**
- Un **interview** possède N **messages** (conversation brute)
- Un **interview** possède N **questions** (générées par l'IA)
- Une **question** possède 0..1 **answer** (réponse du candidat)
- Un **interview** possède 0..1 **review** (bilan final)

---

## 🤖 Schéma de communication avec l'IA

```
┌─────────────┐        ┌──────────────┐        ┌─────────────────┐
│  UTILISATEUR │        │   BACKEND    │        │  AZURE OPENAI   │
│  (Frontend)  │        │  (Express)   │        │    GPT-4o       │
└──────┬───────┘        └──────┬───────┘        └────────┬────────┘
       │                       │                         │
       │  1. Upload CV + Offre │                         │
       │──────────────────────>│                         │
       │                       │  2. Extraire PDF        │
       │                       │  (pdf-parse)            │
       │                       │                         │
       │                       │  3. Structurer CV       │
       │                       │────────────────────────>│
       │                       │     JSON structuré      │
       │                       │<────────────────────────│
       │                       │                         │
       │  4. Démarrer chat     │                         │
       │──────────────────────>│                         │
       │                       │  5. System prompt       │
       │                       │  + CV + Offre           │
       │                       │────────────────────────>│
       │                       │  Première question      │
       │   Question IA         │<────────────────────────│
       │<──────────────────────│                         │
       │                       │                         │
       │  6. Réponse candidat  │                         │
       │──────────────────────>│                         │
       │                       │  7. Historique + msg    │
       │                       │────────────────────────>│
       │                       │  [FEEDBACK] + question  │
       │   Feedback + question │<────────────────────────│
       │<──────────────────────│                         │
       │                       │                         │
       │     ... (5-7 Q/R) ... │                         │
       │                       │                         │
       │                       │  8. Fin (ou timer=0)    │
       │                       │────────────────────────>│
       │                       │  ---BILAN--- (JSON)     │
       │   Bilan structuré     │<────────────────────────│
       │<──────────────────────│                         │
       │                       │                         │
```

### Balises de communication IA

| Balise | Usage |
|--------|-------|
| `[FEEDBACK]...[/FEEDBACK]` | Feedback intermédiaire après chaque réponse |
| `---BILAN---...---FIN_BILAN---` | Bilan final JSON (score, points forts/faibles, conseils, réponses suggérées) |

### Format du bilan JSON

```json
{
  "score": 7,
  "maxScore": 10,
  "pointsForts": ["Point fort 1", "Point fort 2"],
  "pointsAAmeliorer": ["Point 1", "Point 2"],
  "conseilGeneral": "Conseil personnalisé",
  "reponsesSuggerees": [
    {
      "question": "La question posée",
      "reponseIdeale": "La réponse idéale"
    }
  ]
}
```

---

## ⚙️ Installation

### Prérequis

- **Node.js** ≥ 18
- **npm**
- Une **clé API Azure OpenAI** avec accès GPT-4o

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd Projet10_CvTrainer
```

### 2. Backend

```bash
cd src/backend
npm install
cp .env.example .env
# Éditer .env avec vos clés Azure OpenAI
npm run db:migrate
npm run dev
```

### 3. Frontend

```bash
cd src/frontend
npm install
npm run dev
```

L'application est accessible sur **http://localhost:5173** (le frontend proxy les appels `/api` vers le backend sur le port 3000).

### Variables d'environnement (.env)

```env
PORT=3000
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

## 🚀 Fonctionnalités

- ✅ Upload de CV (PDF) avec extraction automatique via IA
- ✅ Simulation d'entretien conversationnel (5-7 questions adaptatives)
- ✅ Feedbacks intermédiaires après chaque réponse (masquables)
- ✅ Bilan final structuré (score, points forts, points à améliorer, réponses suggérées)
- ✅ Historique des entretiens (accessible depuis la page d'accueil)
- ✅ Mode Timer configurable (5/10/15/20/30 min) avec fin automatique
- ✅ Lueur rouge pulsante à 1 minute restante
- ✅ Barre de progression de l'entretien
- ✅ Aperçu du CV structuré (identité, formations, expériences, compétences)

---

## 📚 API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/interviews` | Créer un entretien (multipart: CV + description) |
| `POST` | `/api/interviews/:id/chat` | Envoyer un message / démarrer le chat |
| `POST` | `/api/interviews/:id/end` | Forcer la fin (timer écoulé) |
| `GET` | `/api/interviews/:id/messages` | Récupérer les messages d'un entretien |
| `GET` | `/api/history` | Lister tous les entretiens |
| `GET` | `/api/history/:id` | Détail d'un entretien + messages |
| `DELETE` | `/api/history/:id` | Supprimer un entretien |
| `GET` | `/api/health` | Health check |
