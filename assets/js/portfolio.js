let iso; // Isotope instance globale

async function loadPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) {
        console.error('Elemento #portfolio-container non trovato!');
        return;
    }

    try {
        const response = await fetch('assets/js/listaNascita - Sheet1.tsv');
        const text = await response.text();
        const rows = text.trim().split('\n');

        rows.forEach(row => {
            const [id, active,title, subtitle, imgUrl, linkUrl] = row.split('\t');

            const item = document.createElement('div');
            item.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-app`;

            item.innerHTML = `
                <h5 class="text-center">${title}</h5>
                <a href="${linkUrl}">
                    <img src="${imgUrl}" class="img-fluid" style="width: 300px; height: auto;" alt="${title}">
                </a>
                <div class="portfolio-info">
                    ${subtitle}
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
        if (window.GLightbox) GLightbox({selector: '.glightbox'});

    } catch (err) {
        console.error('Errore nel caricamento del CSV:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolio);