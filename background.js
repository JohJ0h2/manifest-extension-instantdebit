let totalBytesReceived = 0;
let lastUpdateTime = Date.now();
let totalDataKbps = 0;
let lastSpeedKbps = 0;

// Fonction pour convertir les octets en Kbps
function bytesToKbps(bytes, elapsedTime) {
    const kbps = (bytes * 8 / 1024) / elapsedTime; // Conversion octets -> bits -> Kbps
    return parseFloat(kbps.toFixed(2)); // Retourner le résultat arrondi à 2 décimales
}

// Fonction pour mettre à jour les statistiques
function updateMetrics() {
    const now = Date.now();
    const elapsedTime = (now - lastUpdateTime) / 1000; // Temps écoulé en secondes

    if (elapsedTime > 0 && totalBytesReceived > 0) {
        lastSpeedKbps = bytesToKbps(totalBytesReceived, elapsedTime);
        totalDataKbps += lastSpeedKbps;

        // Mettre à jour le stockage local avec les nouvelles valeurs
        browser.storage.local.set({
            lastSpeedKbps: lastSpeedKbps.toFixed(2),
            totalDataKbps: totalDataKbps.toFixed(2)
        });

        // Mettre à jour le badge avec le débit instantané
        browser.browserAction.setBadgeText({
            text: lastSpeedKbps.toFixed(0) // Arrondir à l'entier le plus proche pour le badge
        });

        // Réinitialiser les compteurs pour le prochain intervalle
        totalBytesReceived = 0;
        lastUpdateTime = now;
    }
}

// Charger le cumul des données téléchargées au démarrage de l'extension
browser.storage.local.get('totalDataKbps').then((result) => {
    if (result.totalDataKbps) {
        totalDataKbps = parseFloat(result.totalDataKbps);
    }
});

// Écouter les requêtes web pour mesurer le débit de téléchargement
browser.webRequest.onCompleted.addListener(
    (details) => {
        if (details.method === 'GET' || details.method === 'HEAD') {
            let bytesReceived = 0;

            // Vérifier l'en-tête 'Content-Length' si disponible
            for (let header of details.responseHeaders) {
                if (header.name.toLowerCase() === 'content-length') {
                    bytesReceived = parseInt(header.value, 10);
                }
            }

            // Si 'Content-Length' n'est pas disponible, utiliser 'totalBytes'
            if (bytesReceived === 0 && details.statusCode === 200 && 'totalBytes' in details) {
                bytesReceived = details.totalBytes;
            }

            // Ajouter les octets reçus au total
            totalBytesReceived += bytesReceived;

            // Mise à jour immédiate des statistiques
            updateMetrics();
        }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

// Mettre à jour les statistiques toutes les 500ms
setInterval(updateMetrics, 500);

// Initialiser le badge avec "0"
browser.browserAction.setBadgeText({ text: '0' });
