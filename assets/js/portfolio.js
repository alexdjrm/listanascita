let iso; // Isotope instance globale

async function loadPortfolio() {
    const container = document.getElementById('portfolio-container');
    if (!container) {
        console.error('Elemento #portfolio-container non trovato!');
        return;
    }

    try {
        const response = await fetch('assets/js/lista.tsv', {cache: 'no-store'});
        const text = await response.text();
        const rows = text.trim().split('\n');

        // <i className="fas fa-gift icon-gift text-primary ms-2 regalo-btn"
        //    data-id-regalo="${id}"
        //    data-nome-regalo="${title}"
        //    data-prezzo="${subtitle}"
        //    style="cursor: pointer;"
        //    data-bs-toggle="modal"
        //    data-bs-target="#bonificoModal"></i>
        rows.forEach(row => {
            const [id, active, title, subtitle, imgUrl, linkUrl] = row.split('\t');
            if (active !== '1') return;

            const item = document.createElement('div');
            item.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-app`;
            item.innerHTML = `
          <h5 class="text-center regalo-btn" 
              data-id-regalo="${id}" 
              data-nome-regalo="${title}"
              data-prezzo="${subtitle}" 
              style="cursor: pointer;" 
              data-bs-toggle="modal" 
              data-bs-target="#bonificoModal">
            ${title}
            <a href="${linkUrl}" target="_blank" class="ms-2" title="Apri link del prodotto">
              <i class="fas fa-link text-secondary"></i>
            </a>
          </h5>
        
          <img 
            src="${imgUrl}" 
            class="img-fluid regalo-btn"
            style="width: 300px; height: auto; cursor: pointer;" 
            alt="${title}"
            data-id-regalo="${id}"
            data-nome-regalo="${title}"
            data-prezzo="${subtitle}"
            data-bs-toggle="modal"
            data-bs-target="#bonificoModal"
          />
        
          <div class="portfolio-info regalo-btn">
            ${subtitle}
          </div>
        `;

            container.appendChild(item);
        });

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

        if (window.GLightbox) GLightbox({selector: '.glightbox'});

    } catch (err) {
        console.error('Errore nel caricamento del CSV:', err);
    }
}

function verificaModificaTSV(id, tentativi = 10) {
    fetch('assets/js/lista.tsv', {cache: 'no-store'})
        .then(res => res.text())
        .then(text => {
            const rows = text.trim().split('\n');
            const riga = rows.find(r => r.startsWith(id + '\t'));
            if (riga && riga.split('\t')[1] === '0') {
                location.reload();
            } else if (tentativi > 0) {
                setTimeout(() => verificaModificaTSV(id, tentativi - 1), 300);
            } else {
                alert("⚠️ Modifica non rilevata nel file TSV. Riprova.");
            }
        })
        .catch(err => {
            console.error("Errore durante il polling:", err);
        });
}

document.addEventListener('DOMContentLoaded', loadPortfolio);
