document.addEventListener('DOMContentLoaded', function () {
  const display = document.getElementById("speed-display");

  // Écouter les messages du background script
  browser.runtime.onMessage.addListener((message) => {
    if (message.type === "speedUpdate") {
      display.textContent = `Débit : ${message.speed} Kbps`;
    }
  });
});
