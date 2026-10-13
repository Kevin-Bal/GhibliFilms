/**
 * Configuration CLIENT de Firebase.
 *
 * ⚠️ CE N'EST PAS UN SECRET : ces clés sont publiques par nature (elles partent
 * dans le JavaScript du navigateur). La sécurité vient des RÈGLES Firestore
 * (voir le bas de ce fichier). Ce fichier peut donc être committé.
 *
 * Où trouver ces valeurs :
 *   console.firebase.google.com → ton projet → ⚙ Paramètres du projet
 *   → « Général » → « Tes applications » → appli Web (</>) → SDK.
 * Copie/colle l'objet firebaseConfig que Firebase te montre.
 *
 * Tant que les valeurs commencent par "REMPLACE", l'app tourne en mode LOCAL
 * (sauvegarde dans le navigateur seulement, sans synchronisation).
 */
export function getFirebaseConfig() {
  return {
    apiKey: "AIzaSyCm3Mdj6DIph-VF2F-66h7V89kJypjPVEg",
    authDomain: "mes-films-ghibli.firebaseapp.com",
    projectId: "mes-films-ghibli",
    storageBucket: "mes-films-ghibli.firebasestorage.app",
    messagingSenderId: "424367929977",
    appId: "1:424367929977:web:6f93be5f87b86fabdbf2a8",
  };
}

/*
 * RÈGLES FIRESTORE à coller dans la console (Firestore Database → Règles).
 * Accès ouvert à la collection `ghibli` (usage perso, pas de connexion).
 * N'importe qui connaissant l'URL du site pourrait en théorie modifier ces
 * données : acceptable pour une liste de films, à durcir sinon.
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /ghibli/{doc} {
 *         allow read, write: if true;
 *       }
 *     }
 *   }
 */
