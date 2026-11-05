# Mes films Ghibli

Liste des films Ghibli avec statut vu / pas vu, tirage au sort, fiches détaillées et liste « à regarder ».
Tout est sauvegardé dans **Firebase (Firestore)** et synchronisé
entre appareils ; sans config Firebase, l'app tourne en mode local (navigateur).

La barre de recherche filtre la liste (en plus de l'onglet choisi) sur le titre français ou
original, l'année, le réalisateur et le synopsis, sans tenir compte des accents ni de la casse.

## Design : Material 3

L'interface suit Material Design 3 (Material You) : rôles de couleur, formes arrondies, police
Roboto, puces de filtre, FAB étendu, interrupteur, barre de recherche, boîte de dialogue, couches
d'état et ondulation au toucher. Pas de bibliothèque : tout est du CSS au début de `index.html`.
Les couleurs (clair et sombre, via `light-dark()`) ont été générées avec
`@material/material-color-utilities` à partir du vert `#3f8f6b`, avec l'ambre de Calcifer en
tertiaire ; pour changer de palette, régénère les rôles `--md-*` depuis une autre couleur.
Le thème suit le système, ou se force avec `<html data-theme="light|dark">`.

Le mouvement suit M3 expressif : des ressorts (rapide, défaut, lent, plus des ressorts « effets » sans
rebond) définis en variables CSS `--sp-*` / `--fx-*` (courbes `linear()` calculées depuis les
paramètres de `MotionScheme.expressive` de Compose, repli en Bézier). Au programme : entrée en
cascade de la page et des lignes, lignes qui glissent quand le filtre change, formes qui se
déforment à l'appui, coche qui se déploie sur les puces, rebond des étoiles / de « Vu » / de la
note, dialogue qui s'ouvre et se ferme en douceur, effet « rouleau » du tirage, flamme de Calcifer
qui respire. Tout est coupé avec « réduire les animations » (réglage d'accessibilité du système).

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
