// Fonction pour mettre à jour le débit et le cumul dans le popup
function updatePopup() {
    // Obtenir les valeurs du débit et du cumul depuis le stockage local
    browser.storage.local.get(['lastSpeedKbps', 'totalDataKbps']).then((result) => {
        const speedElement = document.getElementById('speed-display');
        const totalElement = document.getElementById('total-display');

        // Mettre à jour le texte du débit ou afficher "En attente de données..." si aucune donnée
        if (result.lastSpeedKbps) {
            speedElement.textContent = `Débit instantané : ${result.lastSpeedKbps} Kbps`;
        } else {
            speedElement.textContent = 'En attente de données...';
        }

        // Formater le cumul avec 2 décimales
        if (result.totalDataKbps) {
            const formattedTotal = parseFloat(result.totalDataKbps).toFixed(2); // Arrondir à 2 décimales
            totalElement.textContent = `Cumul des données : ${formattedTotal} Kbps`;
        } else {
            totalElement.textContent = 'Cumul des données : 0.00 Kbps';
        }
    }).catch((error) => {
        console.error('Erreur lors de la récupération des données:', error);
        const speedElement = document.getElementById('speed-display');
        speedElement.textContent = 'Erreur lors de la récupération des données';
    });
}

// Appeler la fonction pour mettre à jour le popup au chargement
updatePo
