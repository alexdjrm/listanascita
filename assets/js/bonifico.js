// Gestione della copia negli appunti
document.addEventListener('DOMContentLoaded', () => {
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

    // Event delegation per .regalo-btn (perché gli elementi sono creati dinamicamente)
    document.addEventListener('click', (event) => {
        const target = event.target.closest('.regalo-btn');
        if (target) {
            const nomeRegalo = target.getAttribute('data-nome-regalo');
            const causaleTextElement = document.getElementById('causaleText');
            if (nomeRegalo && causaleTextElement) {
                causaleTextElement.textContent = nomeRegalo;
                const copyIcon = causaleTextElement.nextElementSibling;
                if (copyIcon && copyIcon.classList.contains('copy-icon')) {
                    copyIcon.setAttribute('data-copy', nomeRegalo);
                }
            }
        }
    });
});
