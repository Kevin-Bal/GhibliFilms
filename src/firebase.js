/**
 * Couche d'accès Firebase (Firestore) — la SEULE partie de l'app qui connaît
 * Firebase. Le reste manipule des objets JS simples.
 *
 * Trois documents dans la collection `ghibli` :
 *   - ghibli/seen   : { seen:   { "<idFilm>": true|false } }
 *   - ghibli/ratings: { ratings: { "<idFilm>": 1..10 } }
 *   - ghibli/next   : { next:   { "<idFilm>": true|false } }  (à regarder ensuite)
 * Les écritures fusionnent (merge) : chaque clic ne touche que SON film, donc
 * deux appareils qui cochent des films différents ne s'écrasent pas.
 *
 * Le SDK est importé depuis le CDN gstatic (aucun npm, compatible GitHub Pages),
 * en import dynamique pour ne rien télécharger en mode local.
 */
import { getFirebaseConfig } from "./firebaseConfig.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

let _db = null;
let _fs = null;

/** True si une vraie config a été fournie (sinon : mode local). */
export function isConfigured() {
  const c = getFirebaseConfig();
  return !!(c && c.apiKey && !c.apiKey.startsWith("REMPLACE"));
}

async function db() {
  if (_db) return _db;
  const { initializeApp } = await import(`${SDK}/firebase-app.js`);
  _fs = await import(`${SDK}/firebase-firestore.js`);
  _db = _fs.getFirestore(initializeApp(getFirebaseConfig()));
  return _db;
}

const ref = async (name) => {
  const d = await db(); // charge aussi _fs : à lire APRÈS l'await
  return _fs.doc(d, "ghibli", name);
};

/** Marque un film vu / pas vu (n'écrit que ce film). */
export async function setSeen(id, value) {
  const r = await ref("seen");
  await _fs.setDoc(r, { seen: { [id]: !!value } }, { merge: true });
}

/** Note un film de 1 à 10 ; `null` retire la note. */
export async function setRating(id, value) {
  const r = await ref("ratings");
  const v = value == null ? _fs.deleteField() : value;
  await _fs.setDoc(r, { ratings: { [id]: v } }, { merge: true });
}

/** Ajoute / retire un film de la liste « à regarder ensuite ». */
export async function setNext(id, value) {
  const r = await ref("next");
  await _fs.setDoc(r, { next: { [id]: !!value } }, { merge: true });
}

/** Réinitialise tout (statuts, liste, notes). */
export async function resetAll() {
  const rs = await ref("seen");
  await _fs.setDoc(rs, { seen: {} });
  const rn = await ref("next");
  await _fs.setDoc(rn, { next: {} });
  const rr = await ref("ratings");
  await _fs.setDoc(rr, { ratings: {} });
}

/** Envoie d'un coup une map locale (`name` = "seen" | "next" | "ratings") : migration du localStorage. */
export async function pushAll(name, map) {
  const r = await ref(name);
  await _fs.setDoc(r, { [name]: map }, { merge: true });
}

/**
 * Écoute en temps réel un document (`"seen"`, `"next"` ou `"ratings"`).
 * `cb({ exists, data, hasPendingWrites })` — `data` est la map (ou null).
 * `hasPendingWrites` = true pour l'écho de NOTRE écriture pas encore confirmée.
 * `onError(err)` est appelé si la lecture échoue (règles, réseau…).
 * Renvoie la fonction de désabonnement.
 */
export async function subscribe(name, cb, onError) {
  const r = await ref(name);
  return _fs.onSnapshot(
    r,
    (snap) =>
      cb({
        exists: snap.exists(),
        data: snap.exists() ? snap.data()[name] || {} : null,
        hasPendingWrites: snap.metadata.hasPendingWrites,
      }),
    onError
  );
}
