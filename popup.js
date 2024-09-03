// Fonction pour mettre à jour le débit et le cumul dans le popup
function updatePopup() {
    // Obtenir les valeurs du débit et du cumul depuis le stockage local
    browser.storage.local.get(['lastSpeedKbps', 'totalDataKbps']).then((result) => {
        const speedElement = document.getElementById('speed-display');
        const totalElement = document.getElementById('total-display');

        // Mettre à jour le texte du débit ou afficher "En attente de données..." si aucune donnée
        if (result.lastSpeedKbps) {
            speedElement.textContent = `${result.lastSpeedKbps} Kbps`;
        } else {
            speedElement.textContent = 'En attente de données...';
        }

        // Mettre à jour le texte du cumul ou afficher "0 Kbps" si aucune donnée
        if (result.totalDataKbps) {
            totalElement.textContent = `Total: ${result.totalDataKbps} Kbps`;
        } else {
            totalElement.textContent = 'Total: 0.00 Kbps';
        }
    }).catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        const speedElement = document.getElementById('speed-display');
        speedElement.textContent = 'Erreur lors de la récupération des données';
    });
}

// Appeler la fonction pour mettre à jour le popup au chargement
updatePopup();

// Mettre à jour le popup toutes les 200ms
setInterval(updatePopup, 200);
