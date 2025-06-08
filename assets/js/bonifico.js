document.querySelectorAll('.copy-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const text = icon.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
            icon.classList.remove('text-primary');
            icon.classList.add('text-success');
            icon.title = "Copiato!";
            setTimeout(() => {
                icon.classList.remove('text-success');
                icon.classList.add('text-primary');
                icon.title = "";
            }, 1500);
        });
    });
});

document.addEventListener("click", function (e) {
    // Controlla se il click è avvenuto su un'icona regalo
    if (e.target && e.target.classList.contains("regalo-btn")) {
        const title = e.target.getAttribute("data-nome-regalo");

        // Aggiorna il testo della causale
        const causaleText = document.getElementById("causaleText");
        if (causaleText) {
            causaleText.textContent = title;

            // Aggiorna anche il valore del pulsante di copia
            const copyIcon = causaleText.parentElement.querySelector(".copy-icon");
            if (copyIcon) {
                copyIcon.setAttribute("data-copy", title);
            }
        }
    }
});