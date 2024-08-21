let totalBytes = 0;
let lastTimestamp = Date.now();

// Fonction pour ajouter la taille des données de chaque requête
function addData(details) {
  const contentLengthHeader = details.responseHeaders.find(header => header.name.toLowerCase() === 'content-length');
  const sizeInBytes = contentLengthHeader ? parseInt(contentLengthHeader.value, 10) : 0;

  if (sizeInBytes > 0) {
    totalBytes += sizeInBytes;
  }
}

// Intercepter les requêtes réseau
browser.webRequest.onCompleted.addListener(
  function(details) {
    addData(details);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Fonction pour calculer le débit instantané
function calculateInstantaneousSpeed() {
  const now = Date.now();
  const elapsedTime = (now - lastTimestamp) / 1000; // Temps écoulé en secondes

  if (elapsedTime > 0) {
    const bitsTransferred = totalBytes * 8;
    const speedKbps = (bitsTransferred / elapsedTime) / 1024; // Débit en Kbps

    // Envoyer le débit instantané à la popup
    browser.runtime.sendMessage({
      type: "speedUpdate",
      speed: speedKbps.toFixed(2)
    });

    // Réinitialiser les valeurs pour la prochaine période
    totalBytes = 0;
    lastTimestamp = now;
  }
}

// Mettre à jour le débit instantané toutes les 500 ms
setInterval(calculateInstantaneousSpeed, 500);
