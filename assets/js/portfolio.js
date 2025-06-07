let iso; // Isotope instance globale

async function loadPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) {
        console.error('Elemento #portfolio-container non trovato!');
        return;
    }

    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTOn9otKjhzVGt2GAhMWyuBVHLp69ylhUbIQwgTTflXIxmyfy2Oyv0Aubhj0-yQ2q-60lyS42ayRboL/pub?output=csv');
        const text = await response.text();
        const rows = text.trim().split('\n');

        rows.forEach(row => {
            const [filter, title, subtitle, imgUrl, linkUrl] = row.split('$');

            const item = document.createElement('div');
            item.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${filter}`;

            item.innerHTML = `
                <img src="${imgUrl}" class="img-fluid" alt="${title}">
                <div class="portfolio-info">
                    <h4>${title}</h4>
                    <p>${subtitle}</p>
                    <a href="${imgUrl}" title="${title}" data-gallery="portfolio-gallery" class="glightbox preview-link">
                        <i class="bi bi-zoom-in"></i>
                    </a>
                    <a href="${linkUrl}" title="More Details" class="details-link">
                        <i class="bi bi-link-45deg"></i>
                    </a>
                </div>
            `;

            container.appendChild(item);
        });

        // Ricarica immagini e aggiorna Isotope layout
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

        // Inizializza Glightbox
        if (window.GLightbox) GLightbox({ selector: '.glightbox' });

    } catch (err) {
        console.error('Errore nel caricamento del CSV:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolio);