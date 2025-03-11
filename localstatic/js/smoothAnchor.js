document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.querySelectorAll('.smooth_anchor').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        anchorLink = `.${anchor.href.slice(28,)}`

        if (window.location.href != anchor.href.slice(0, 27) & window.location.href != anchor.href) {
            window.location.href = anchor.href;
        }
        document.querySelector(anchorLink).scrollIntoView({
            behavior: 'smooth'
        });

    });
});