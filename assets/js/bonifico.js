let idCorrente = null;
let nomeRegaloCorrente = null;

document.addEventListener('DOMContentLoaded', () => {
    const btnSegna = document.getElementById('btnSegnaComePreso');
    const donorNameInput = document.getElementById('donorName');
    const donorMessageInput = document.getElementById('donorMessage');
    const donorNameSection = document.getElementById('donorNameSection');
    const donorMessageSection = document.getElementById('donorMessageSection');
    const confirmCheckboxSection = document.getElementById('confirmCheckboxSection');
    const confirmCheckbox = document.getElementById('confirmCheckbox');
    const causaleTextElement = document.getElementById('causaleText');
    const copyIcon = causaleTextElement?.nextElementSibling;

    // Copia negli appunti
    document.querySelectorAll('.copy-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const text = icon.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                icon.classList.replace('text-primary', 'text-success');
                icon.title = "Copiato!";
                setTimeout(() => {
                    icon.classList.replace('text-success', 'text-primary');
                    icon.title = "";
                }, 1500);
            });
        });
    });

    // Gestione click su elemento regalo
    document.addEventListener('click', (event) => {
        const target = event.target.closest('.regalo-btn');
        if (!target) return;

        const nomeRegalo = target.getAttribute('data-nome-regalo');
        const idRegalo = target.getAttribute('data-id-regalo');
        const prezzo = target.getAttribute('data-prezzo');

        if (target.classList.contains('icon-gift')) {
            const conferma = confirm(`Vuoi regalarci "${nomeRegalo}" per "${prezzo}"?`);
            if (!conferma) return;
        }

        if (nomeRegalo && causaleTextElement) {
            causaleTextElement.textContent = nomeRegalo;
            nomeRegaloCorrente = nomeRegalo;
            if (copyIcon) copyIcon.setAttribute('data-copy', nomeRegalo);
        }

        if (btnSegna) {
            if (idRegalo) {
                idCorrente = idRegalo;
                donorNameSection.style.display = 'block';
                donorMessageSection.style.display = 'block';
                confirmCheckboxSection.style.display = 'block';
                btnSegna.style.display = 'inline-block';
                btnSegna.disabled = !confirmCheckbox.checked;
            } else {
                idCorrente = null;
                btnSegna.style.display = 'none';
                donorNameSection.style.display = 'none';
                donorMessageSection.style.display = 'none';
                confirmCheckboxSection.style.display = 'none';
                btnSegna.disabled = true;
            }
        }
    });

    // Abilitazione pulsante
    confirmCheckbox?.addEventListener('change', () => {
        btnSegna.disabled = !confirmCheckbox.checked;
    });

    // Invio
    btnSegna?.addEventListener('click', () => {
        if (!idCorrente) return alert("Errore: oggetto non identificato.");
        const nome = donorNameInput?.value.trim();
        const messaggio = donorMessageInput?.value.trim() || '';
        if (!nome) return alert("Per favore inserisci il tuo nome e cognome.");

        const conferma = confirm(`Confermi di ritirare l'oggetto "${nomeRegaloCorrente}" dalla lista?`);
        if (!conferma) return;

        fetch('assets/js/back.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: idCorrente, nome: nome, messaggio: messaggio })
        })
            .then(res => res.text())
            .then(data => {
                if (data.trim().startsWith('OK')) {
                    verificaModificaTSV(idCorrente);
                } else {
                    alert("Errore backend: " + data);
                }
            })
            .catch(err => {
                console.error("Errore:", err);
                alert("Errore nella richiesta al server.");
            });
    });

    // Reset modale
    document.getElementById('bonificoModal')?.addEventListener('hidden.bs.modal', () => {
        idCorrente = null;
        nomeRegaloCorrente = null;
        donorNameInput.value = '';
        donorMessageInput.value = '';
        confirmCheckbox.checked = false;
        btnSegna.disabled = true;
        btnSegna.style.display = 'none';
        donorNameSection.style.display = 'none';
        donorMessageSection.style.display = 'none';
        confirmCheckboxSection.style.display = 'none';
    });
});
