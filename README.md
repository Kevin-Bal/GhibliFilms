# Mes films Ghibli

Liste des films Ghibli avec statut vu / pas vu, tirage au sort, fiches détaillées et liste « à regarder ».
Tout est sauvegardé dans **Firebase (Firestore)** et synchronisé
entre appareils ; sans config Firebase, l'app tourne en mode local (navigateur).

La barre de recherche filtre la liste (en plus de l'onglet choisi) sur le titre français ou
original, l'année, le réalisateur et le synopsis, sans tenir compte des accents ni de la casse.

## Design : Liquid Glass (branche `design/liquid-glass`)

Variante d'interface inspirée du « Liquid Glass » d'Apple, à comparer avec la version Material 3 de
`main`. Pas de bibliothèque : tout est du CSS au début de `index.html`. Les surfaces (carte du tirage,
liste, barre de recherche, barre de filtres, fiche) sont du verre : fond translucide, flou et saturation de
ce qui passe derrière (`backdrop-filter`), liseré lumineux plus clair en haut, reflet spéculaire, ombre
douce. Un fond de grandes taches de couleur floues, qui dérivent lentement, donne de la matière à
« réfracter ». La barre de recherche reste collée en haut, la barre de filtres flotte en bas avec un
indicateur en verre qui glisse d'un onglet à l'autre ; les boutons principaux sont du verre teinté (vert,
ambre de Calcifer). Police du système (SF sur Apple, Segoe UI sur Windows). Le thème suit le système, ou se
force avec `<html data-theme="light|dark">` ; avec le réglage système « réduire la transparence », ou sans
`backdrop-filter`, les surfaces deviennent opaques.

Le mouvement reste fluide et élastique : des ressorts (rapide, défaut, lent, plus des ressorts « effets » sans
rebond) définis en variables CSS `--sp-*` / `--fx-*` (courbes `linear()`, repli en Bézier). Au programme :
entrée en cascade de la page et des lignes, lignes qui glissent quand le filtre change, éléments qui
grossissent et s'éclairent à l'appui, rebond des étoiles / de « Vu » / de la note, fiche qui s'ouvre et se ferme
en douceur, effet « rouleau » du tirage, flamme de Calcifer qui respire. Tout est coupé avec « réduire les
animations » (réglage d'accessibilité du système).

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
