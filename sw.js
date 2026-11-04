/**
 * Service worker : rend l'appli installable et utilisable hors-ligne.
 *
 * - Fichiers de l'appli (même origine) : réseau d'abord (une mise à jour poussée
 *   sur GitHub Pages est vue dès la visite suivante), cache en secours hors-ligne.
 * - Affiches, polices et SDK Firebase (autres origines) : cache d'abord.
 * - Tout le reste (notamment les appels Firestore) n'est PAS intercepté :
 *   Firebase gère lui-même sa synchronisation, et l'appli garde son cache localStorage.
 *
 * Tous les chemins sont relatifs : l'appli est servie dans un sous-dossier
 * (https://<user>.github.io/GhibliFilms/).
 */
const VERSION = "v3";
const SHELL_CACHE = `ghibli-shell-${VERSION}`;
const ASSET_CACHE = `ghibli-assets-${VERSION}`; // affiches, polices, SDK Firebase

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/firebase.js",
  "./src/firebaseConfig.js",
  "./src/filmInfo.js",
  "./assets/calcifer.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
];

// Hôtes externes qu'on met en cache (tous envoient Access-Control-Allow-Origin: *).
const CACHEABLE_HOSTS = new Set([
  "image.tmdb.org",
  "upload.wikimedia.org",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "www.gstatic.com",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL.map((u) => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL_CACHE, ASSET_CACHE]);
      for (const name of await caches.keys()) {
        if (name.startsWith("ghibli-") && !keep.has(name)) await caches.delete(name);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
  } else if (CACHEABLE_HOSTS.has(url.hostname)) {
    event.respondWith(cacheFirst(req));
  }
  // sinon : on laisse passer (Firestore, etc.)
});

/** Réseau d'abord (en revalidant le cache HTTP) ; hors-ligne → copie en cache. */
async function networkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req, { cache: "no-cache" });
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? await cache.match("./index.html") : null);
    if (hit) return hit;
    throw err;
  }
}

/** Cache d'abord ; sinon réseau, puis on garde la réponse pour le hors-ligne. */
async function cacheFirst(req) {
  const cache = await caches.open(ASSET_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  // Images et feuilles de style externes sont demandées en no-cors (réponse opaque : on ne peut
  // pas savoir si elle est valide, et elle est comptée très lourde dans le quota). On les redemande
  // donc en CORS ; `cache: "reload"` évite de réutiliser une copie du cache HTTP stockée sans
  // en-tête CORS (ce qui ferait échouer la requête).
  if (req.mode === "no-cors") {
    try {
      const res = await fetch(req.url, { mode: "cors", cache: "reload" });
      if (res.ok) {
        cache.put(req, res.clone());
        return res;
      }
    } catch (err) {
      // pas de CORS chez cet hôte : on retombe sur la requête d'origine ci-dessous
    }
    return fetch(req); // affichage normal, simplement sans copie hors-ligne
  }
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}
