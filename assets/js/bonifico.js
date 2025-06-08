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