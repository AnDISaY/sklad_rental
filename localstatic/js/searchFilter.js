currentPath = window.location.pathname.split('/')[1]
let pathname;

if (screen.width <= 720) {
    if (currentPath == "order" | currentPath == "cart" | currentPath == "profile" | currentPath == "order_history" ) {
        document.querySelector('.header__content').remove()
    }
}

$('#search').on('input', function(event) {
    inputValue = $(this)[0].value
    event.preventDefault();
    $.ajax({
        url: '/searchbar/',
        type: 'POST',
        headers: { "X-CSRFToken": $.cookie("csrftoken") },
        data: {"data": "search",
               "searchInput": $(this)[0].value,
        },
        success: function(response) {
            searchSuggestions(response, inputValue)
        }
    });
});


$(window).click(function() {
    suggestions = document.querySelector('.header__searchbar__suggestions')
    if (suggestions) {
        suggestions.style.display = 'none'
    }
});

$('.header__searchbar__suggestions').click(function(e) {
    e.stopPropagation()
})

$('.header__searchbar').click(function(e) {
    e.stopPropagation()
    suggestions = document.querySelector('.header__searchbar__suggestions')
    if (suggestions) {
        suggestions.style.display = 'block'
    }
})

function searchSuggestions(response, value) {
    searchBar = document.querySelector('.header__searchbar')
    suggestionsPrevious = searchBar.querySelector('.header__searchbar__suggestions')
    if (suggestionsPrevious) {
        suggestionsPrevious.remove()
    }
    suggestions = document.createElement('div')
    suggestions.classList.add('header__searchbar__suggestions')
    suggestionsWrapper = document.createElement('div')
    suggestionsWrapper.classList.add('header__searchbar__suggestions__wrapper')

    // if 
    console.log(value)
    console.log(value.length)
    console.log(typeof(value))

    if (value.length > 0) {
        if (Object.keys(response).length != 0) {
            for (let i=0; i < Object.keys(response).length; i++) {
                suggestionsItem = document.createElement('a')
                suggestionsItem.setAttribute('href', `/product/${response[i].id}`)
                suggestionsItem.classList.add('header__searchbar__suggestions__item')

                suggestionsImage = document.createElement('div')
                suggestionsImage.classList.add('header__searchbar__suggestions__item__image')
                suggestionsImg = document.createElement('img')
                suggestionsImg.setAttribute('src', `${response[i].photo}`)
                suggestionsImg.setAttribute('alt', "Product image")
                suggestionsImage.appendChild(suggestionsImg)

                suggestionsContent = document.createElement('div')
                suggestionsContent.classList.add('header__searchbar__suggestions__item__content')
                suggestionsTitle = document.createElement('div')
                suggestionsTitle.classList.add('header__searchbar__suggestions__item__title')
                suggestionsTitle.classList.add('text-semibold-mid')
                suggestionsTitle.innerHTML = response[i].name
                suggestionsPrice = document.createElement('div')
                suggestionsPrice.classList.add('header__searchbar__suggestions__item__price')
                suggestionsPrice.classList.add('text-medium-small')
                suggestionsPrice.innerHTML = `${response[i].price}₸`
                suggestionsContent.appendChild(suggestionsTitle)
                suggestionsContent.appendChild(suggestionsPrice)

                suggestionsItem.appendChild(suggestionsImage)
                suggestionsItem.appendChild(suggestionsContent)
                suggestionsWrapper.appendChild(suggestionsItem)
            }
        } else {
            text = document.createElement('div')
            text.classList.add('header__searchbar__suggestions__text')
            text.classList.add('text-main')
            text.innerHTML = "Список пуст"
            suggestionsWrapper.appendChild(text)
            suggestionsWrapper.style.overflow = 'hidden'
        }

        suggestions.appendChild(suggestionsWrapper)
        searchBar.appendChild(suggestions)
    }
}