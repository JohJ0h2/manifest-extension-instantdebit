// Fonction pour mettre à jour le débit dans le popup
function updatePopup() {
    // Obtenir la valeur du débit depuis le stockage local
    browser.storage.local.get('lastSpeedKbps').then((result) => {
        const speedElement = document.getElementById('speed-display');
        // Mettre à jour le texte du débit ou afficher "En attente de données..." si aucune donnée
        if (result.lastSpeedKbps) {
            speedElement.textContent = `${result.lastSpeedKbps} Kbps`;
        } else {
            speedElement.textContent = 'En attente de données...';
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
