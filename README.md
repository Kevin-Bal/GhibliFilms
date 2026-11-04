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

## Application installable (PWA)

L'appli est une PWA : `manifest.webmanifest` (nom, icônes, mode plein écran) et
`sw.js` (service worker) la rendent installable (« Ajouter à l'écran d'accueil » /
« Installer l'application ») et utilisable hors-ligne. Les icônes (Calcifer) sont dans
`assets/icons/`. Le service worker met en cache l'appli, les affiches, la police et le SDK
Firebase ; les fichiers de l'appli sont lus en priorité sur le réseau, donc une mise à jour
poussée sur GitHub est visible dès la visite suivante. Si tu ajoutes un fichier à l'appli,
ajoute-le à la liste `SHELL` de `sw.js` (et change `VERSION` pour repartir d'un cache propre).
Un service worker exige HTTPS (GitHub Pages) ou `localhost`.

## Lancer en local

```bash
npm run serve   # http://localhost:4321 (les modules ES exigent un serveur)
```
