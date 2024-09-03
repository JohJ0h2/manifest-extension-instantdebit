document.addEventListener('DOMContentLoaded', function() {
    // Code existant pour charger les données
    updateSpeedAndData();
});

// Fonction pour recharger les données
function reloadData() {
    updateSpeedAndData();
}

function updateSpeedAndData() {
    // Supposons que cette fonction met à jour le débit instantané et le cumul des données
    // Ici tu dois réinsérer le code nécessaire pour mettre à jour les affichages

    // Exemple de mise à jour (ce code doit être remplacé par celui qui obtient les vraies données)
    document.getElementById('speed-display').innerText = 'Débit instantané : ' + (Math.random() * 100).toFixed(2) + ' Kbps';
    document.getElementById('total-display').innerText = 'Cumul des données : ' + (Math.random() * 1000).toFixed(2) + ' Kbps';
}
