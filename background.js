let totalBytesReceived = 0;
let lastUpdateTime = Date.now();
let lastSpeedKbps = "0.00"; // Dernier débit calculé
let totalDataKbps = 0; // Cumul des données téléchargées en Kbps

// Fonction pour formater le débit en Kbps
function formatKbps(bytes, elapsedTime) {
    const bits = bytes * 8; // Convertir les octets en bits
    const kbps = (bits / 1024) / elapsedTime; // Convertir les bits en kilobits par seconde
    return kbps.toFixed(2); // Formater avec 2 décimales
}

// Fonction pour convertir les octets en kilobits
function bytesToKbps(bytes) {
    const bits = bytes * 8; // Convertir les octets en bits
    return (bits / 1024).toFixed(2); // Convertir en kilobits et formater avec 2 décimales
}

// Fonction pour mettre à jour le badge et le stockage local
function updateMetrics() {
    const now = Date.now();
    const elapsedTime = (now - lastUpdateTime) / 1000; // Temps écoulé en secondes

    if (elapsedTime > 0) {
        if (totalBytesReceived > 0) {
            lastSpeedKbps = formatKbps(totalBytesReceived, elapsedTime);
        }

        // Ajouter les octets reçus au total cumulé
        totalDataKbps += parseFloat(bytesToKbps(totalBytesReceived));

        // Mettre à jour le badge avec le débit actuel ou le dernier débit enregistré
        browser.browserAction.setBadgeText({
            text: lastSpeedKbps
        });

        // Mettre à jour le stockage local avec le débit et le cumul des données
        browser.storage.local.set({ lastSpeedKbps, totalDataKbps });

        // Réinitialiser les compteurs pour la prochaine période
        totalBytesReceived = 0;
        lastUpdateTime = now;
    }
}

// Écouter les requêtes web pour mesurer le débit de téléchargement
browser.webRequest.onCompleted.addListener(
    (details) => {
        if (details.method === 'GET' || details.method === 'HEAD') {
            let bytesReceived = 0;

            // Vérifier l'en-tête 'Content-Length' si disponible
            for (let header of details.responseHeaders) {
                if (header.name.toLowerCase() === 'content-length') {
                    bytesReceived += parseInt(header.value, 10);
                }
            }

            // Si 'Content-Length' n'est pas disponible, utiliser 'totalBytes'
            if (bytesReceived === 0 && details.statusCode === 200 && details.totalBytes) {
                bytesReceived = details.totalBytes;
            }

            // Ajouter les octets reçus au total
            totalBytesReceived += bytesReceived;

            // Mise à jour immédiate du badge pour suivre le débit instantané
            updateMetrics();
        }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

// Mettre à jour le badge très fréquemment
setInterval(updateMetrics, 200); // Mise à jour toutes les 200ms

// Initialiser le badge avec "0.00"
browser.browserAction.setBadgeText({ text: '0.00' });
