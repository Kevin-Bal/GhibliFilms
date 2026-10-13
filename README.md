# Mes films Ghibli

Liste des films Ghibli avec statut vu / pas vu, tirage au sort, fiches détaillées et liste « à regarder ».
Tout est sauvegardé dans **Firebase (Firestore)** et synchronisé
entre appareils ; sans config Firebase, l'app tourne en mode local (navigateur).

## Brancher Firebase (une seule fois)

1. console.firebase.google.com → créer un projet (forfait Spark gratuit).
2. Ajouter une appli Web (`</>`) et copier l'objet `firebaseConfig` dans
   `src/firebaseConfig.js`.
3. Créer une base **Firestore** puis coller les règles indiquées en bas de
   `src/firebaseConfig.js` (Firestore → Règles).

Au premier chargement, les films déjà cochés dans le navigateur sont envoyés
automatiquement dans Firebase.

## Données (collection `ghibli`)

- `ghibli/seen` : `{ seen: { "<idFilm>": true|false } }`
- `ghibli/ratings` : `{ ratings: { "<idFilm>": 1..10 } }` (notes sur 10, onglet Classement)
- `ghibli/next` : `{ next: { "<idFilm>": true|false } }` (liste « à regarder ensuite »)

## Lancer en local

```bash
npm run serve   # http://localhost:4321 (les modules ES exigent un serveur)
```
