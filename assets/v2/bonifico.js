let idCorrente = null;
let nomeRegaloCorrente = null;

document.addEventListener('DOMContentLoaded', () => {
    const btnSegna = document.getElementById('btnSegnaComePreso');
    const donorNameInput = document.getElementById('donorName');
    const donorContactInput = document.getElementById('donorContact');
    const donorMessageInput = document.getElementById('donorMessage');
    const causaleTextElement = document.getElementById('causaleText');
    const importoTextElement = document.getElementById('importoText');
    const bonificoModalLabel = document.getElementById('bonificoModalLabel');
    const importoCopyIcon = importoTextElement?.nextElementSibling;
    const causaleCopyIcon = causaleTextElement?.nextElementSibling;

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

    // Click su un regalo
    document.addEventListener('click', (event) => {
        const target = event.target.closest('.regalo-btn');
        if (!target) return;

        const nomeRegalo = target.getAttribute('data-nome-regalo');
        const idRegalo = target.getAttribute('data-id-regalo');
        const prezzo = target.getAttribute('data-prezzo');

        if (!idRegalo || !nomeRegalo || !prezzo) return;

        idCorrente = idRegalo;
        nomeRegaloCorrente = nomeRegalo;
        prezzoCorrente = prezzo;

        // Popola la modale
        importoTextElement.textContent = prezzo;
        causaleTextElement.textContent = nomeRegalo;
        if (importoCopyIcon) importoCopyIcon.setAttribute('data-copy', prezzo);
        if (causaleCopyIcon) causaleCopyIcon.setAttribute('data-copy', nomeRegalo);
        bonificoModalLabel.textContent = `${nomeRegalo} ${prezzo}`;

    });

    // Invia conferma regalo
    btnSegna?.addEventListener('click', () => {
        const nome = donorNameInput?.value.trim();
        const contatto = donorContactInput?.value.trim();
        const messaggio = donorMessageInput?.value.trim() || '';
        const formError = document.getElementById('formError');

        if (!nome || !contatto) {
            formError.textContent = "⚠️ Inserisci il tuo nome e recapito.";
            formError.style.display = 'block';
            return;
        }

        formError.style.display = 'none';

        const conferma = confirm(`Confermi di aver realizzato il pagamento di "${prezzoCorrente}" e di voler rimuovere l'oggetto "${nomeRegaloCorrente}" dalla lista?`);
        if (!conferma) return;

        fetch('assets/js/back.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: idCorrente, nome: nome, messaggio: messaggio, contatto: contatto })
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
        donorContactInput.value = '';
        donorMessageInput.value = '';

        const formError = document.getElementById('formError');
        if (formError) {
            formError.style.display = 'none';
            formError.textContent = '';
        }
    });
});
