/**
 * upload.js — Middleware Multer pour l'upload de fichiers
 * 
 * Configure le stockage des fichiers CV uploadés :
 * - Destination : dossier /uploads à la racine du backend
 * - Nom de fichier : timestamp unique + nom original pour éviter les conflits
 * 
 * Usage dans les routes : upload.single('cv')
 */
import multer from 'multer'
import path from 'path'

// Configuration du stockage sur disque local
const storage = multer.diskStorage({
  // Dossier de destination pour les fichiers uploadés
  destination: (_req, _file, cb) => {
    cb(null, path.resolve('uploads'))
  },
  // Nom du fichier avec préfixe unique (timestamp + random) pour éviter les doublons
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

export const upload = multer({ storage })
