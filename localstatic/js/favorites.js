cartArray = ['favorites', 'popular', 'product', 'category']
pathName = window.location.pathname.slice(1)
let cartItem;

if (pathName == "favorites/") {
    cartItem = cartArray[0]
} else if (pathName == "home/" || pathName == "") {
    cartItem = cartArray[1]
} else if (pathName.split('/')[0] == "product") {
    cartItem = cartArray[2]
} else {
    cartItem = cartArray[3]
}

favorites = document.querySelectorAll('.favorite-btn')

favorites.forEach(favorite => favorite.addEventListener('click', (e)=> {
    e.preventDefault()
    e.stopPropagation()
    id = favorite.closest('.favorite-card').querySelector('.fsd12mjh63').innerHTML
    
    svgPath = favorite.querySelector('.favorite-svg path')
    if (svgPath == null) {
        svgPath = favorite.querySelector('.unfavorite-svg path')
        svgPath.setAttribute('fill', 'currentColor')
        svgPath.setAttribute('d', 'M16.2708 0C13.9755 0 11.8919 1.60413 11 3.77331C10.1081 1.60327 8.0245 0 5.72917 0C2.57033 0 0 2.43003 0 5.41644C0 11.2749 8.94117 17.6099 10.7332 18.8197L11 19L11.2668 18.8197C13.0598 17.6099 22 11.274 22 5.41644C22 2.43003 19.4297 0 16.2708 0ZM11 17.9332C6.28742 14.6963 0.916667 9.552 0.916667 5.41644C0.916667 2.90754 3.07542 0.86663 5.72917 0.86663C8.24817 0.86663 10.5417 3.34519 10.5417 6.06641H11.4583C11.4583 3.34519 13.7518 0.86663 16.2708 0.86663C18.9246 0.86663 21.0833 2.90754 21.0833 5.41644C21.0833 9.552 15.7126 14.6963 11 17.9332Z')
        svg = favorite.querySelector('.unfavorite-svg')
        svg.classList.add('favorite-svg')
        svg.classList.remove('unfavorite-svg')
        
        if (cartItem == 'product') {
            favorite.querySelector(`.${cartItem}__btn__text`).innerHTML = "Добавить в избранное"
        }

    } else {
        console.log('bobobo')
        svgPath.setAttribute('d', 'M11 19C10.8887 19 10.7775 18.9713 10.6778 18.9138C10.5695 18.8514 7.99691 17.3599 5.38743 15.1125C3.84082 13.7805 2.60624 12.4594 1.71808 11.1859C0.568758 9.53795 -0.00921315 7.95286 0.000111035 6.47457C0.0110251 4.75441 0.628011 3.13671 1.73755 1.91942C2.86582 0.681629 4.37152 0 5.97739 0C8.03545 0 9.91709 1.15121 11 2.97486C12.083 1.15125 13.9646 0 16.0227 0C17.5398 0 18.9873 0.615036 20.0986 1.73183C21.3183 2.9574 22.0112 4.68906 21.9999 6.48272C21.9905 7.95844 21.4017 9.54113 20.2498 11.1868C19.3589 12.4596 18.1261 13.7801 16.5855 15.1117C13.9856 17.3589 11.4315 18.8504 11.324 18.9128C11.2256 18.9699 11.1138 19 11 19Z')
        svgPath.setAttribute('fill', '#FF6400')
        svg = favorite.querySelector('.favorite-svg')
        svg.classList.add('unfavorite-svg')
        svg.classList.remove('favorite-svg')
        console.log(cartItem)
        
        if (cartItem == 'product') {
            console.log('bebebe')
            favorite.querySelector(`.${cartItem}__btn__text`).innerHTML = "В избранном"
        }
    }
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        headers: { "X-CSRFToken": $.cookie("csrftoken") },
        data: {
            "data": "favorites",
            "productId": id,
        },
    });
    return false;
}))


function reloadFavoritesScript() {
    let oldScript = document.querySelector("#favoritesScript");
    if (oldScript) {
        oldScript.remove(oldScript); // Remove the old script
    }
    favorites.forEach(btn => btn.replaceWith(btn.cloneNode(true)))

    let newScript = document.createElement("script");
    newScript.src = `/static/js/favorites.js?v=${new Date().getTime()}`;
    newScript.id = "favoritesScript";
    newScript.type = "text/javascript";
    document.body.appendChild(newScript);
}


// anonFav = document.querySelectorAll('.anonymous-favorite-svg')
// if (anonFav) {
//     anonFav.forEach(anon => anon.addEventListener("click", (e)=> {
//         e.preventDefault()
//         e.stopPropagation()
//         info = document.querySelector('#info-favorites')
//         console.log(info)
//         console.log(info.classList)

//         if (!info.classList.contains('info-active')) {
//             console.log('bebebe')
//             info.classList.add('info-active')
//         } else {
//             console.log('bebebe')
//             info.classList.remove('info-active')
//             info.classList.add('info-active')
//         }
//     }))
// }