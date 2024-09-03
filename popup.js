function updatePopup() {
    // Obtenir les valeurs du débit et du cumul depuis le stockage local
    browser.storage.local.get(['lastSpeedKbps', 'totalDataKbps']).then((result) => {
        const speedElement = document.getElementById('speed-display');
        const totalElement = document.getElementById('total-display');

        // Mettre à jour le texte du débit
        if (result.lastSpeedKbps) {
            speedElement.textContent = `Débit instantané : ${result.lastSpeedKbps} Kbps`;
        } else {
            speedElement.textContent = 'Débit instantané : 0.00 Kbps';
        }

        // Mettre à jour le texte du cumul des données
        if (result.totalDataKbps) {
            totalElement.textContent = `Cumul des données : ${result.totalDataKbps} Kbps`;
        } else {
            totalElement.textContent = 'Cumul des données : 0.00 Kbps';
        }
    }).catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
    });
}

// Appeler la fonction pour mettre à jour le popup au chargement
updatePopup();

// Mettre à jour le popup toutes les 500ms pour un affichage presque instantané
setInterval(updatePopup, 500);
