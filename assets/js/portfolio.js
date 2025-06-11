GOOGLE

let iso; // Isotope instance globale

async function loadPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) {
        console.error('Elemento #portfolio-container non trovato!');
        return;
    }

    try {
        // URL per scaricare direttamente il CSV pubblico
        const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOn9otKjhzVGt2GAhMWyuBVHLp69ylhUbIQwgTTflXIxmyfy2Oyv0Aubhj0-yQ2q-60lyS42ayRboL/pub?output=tsv';


        const response = await fetch(url);
        const text = await response.text();
        console.log('CSV Raw:', text); // 👈 stampa tutto
        const rows = text.trim().split('\n');

        rows.forEach(row => {
            const cols = row.split('\t');
            const [id, attivo, title, subtitle, imgUrl, linkUrl] = cols;

            if (attivo !== '1') return; // salta oggetti disattivati

            const item = document.createElement('div');
            item.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-app`;

            item.innerHTML = `
                <h5 class="text-center regalo-btn" data-id-regalo="${id}" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#bonificoModal">
                    ${title}
                    <i class="fas fa-gift icon-gift text-primary ms-2"></i>
                </h5>
                                    <i class="fas fa-message icon-gift text-primary ms-2"  onclick="marcaOggettoComePresoConId('${id}')"></i>
                <a href="${linkUrl}" target="_blank">
                    <img src="${imgUrl}" class="img-fluid" style="width: 300px; height: auto;" alt="${title}">
                </a>
                <div class="portfolio-info regalo-btn" data-id-regalo="${id}" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#bonificoModal">
                    ${subtitle}
                </div>
            `;

            container.appendChild(item);
        });

        // Inizializza Isotope
        imagesLoaded(container, () => {
            if (!iso) {
                iso = new Isotope(container, {
                    itemSelector: '.isotope-item',
                    layoutMode: 'masonry'
                });
            } else {
                iso.reloadItems();
                iso.layout();
            }
        });

        if (window.GLightbox) GLightbox({ selector: '.glightbox' });

    } catch (err) {
        console.error('Errore nel caricamento del CSV:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolio);

function marcaOggettoComePresoConId(idOggetto) {
    fetch('https://script.google.com/macros/s/AKfycbzTTJlqP6Jltp_4gb3aG70hSrPlatEVmyDYAMpU7Xjx0XzemEXOaCXT5ZKa1gHg-fk/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id: idOggetto }),
    })
        .then(res => res.text())
        .then(data => {
            console.log('Aggiornamento completato:', data);
            document.querySelector(`[data-id-regalo="${idOggetto}"]`)?.closest('.portfolio-item')?.remove();
        })
        .catch(err => console.error('Errore durante l\'aggiornamento:', err));
}


document.addEventListener('DOMContentLoaded', loadPortfolio);
