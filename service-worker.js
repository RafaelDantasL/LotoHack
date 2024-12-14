const CACHE_NAME = 'loto-hack-cache-v1';
const urlsToCache = [
    '/',
    'https://app.acertos.club/pr/fC7hpda9',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/compartilhar.png',
    '/icons/resultado.png',
    '/icons/jogar.png',
    '/icons/palpite.png',
    '/icons/LotoHack.png',
    '/icons/favicon.png',
    '/icons/favicon.ico',
    '/icons/favicon.svg',
    '/MPayment/Modal.js'
    '/MPayment/Script.js'
    '/MPayment/Styles.css'
    '/MPayment/BuyOK.png'  
    // Adicione aqui outros recursos que você deseja cachear
];

// Instala o Service Worker e adiciona os recursos ao cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercepta as requisições e serve os recursos do cache quando disponíveis
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o recurso do cache se encontrado
                if (response) {
                    return response;
                }
                // Caso contrário, busca na rede
                return fetch(event.request);
            })
    );
});

// Atualiza o Service Worker e remove caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
