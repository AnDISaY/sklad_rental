arr = ['favorites', 'category']
pathName = window.location.pathname.slice(1, -1)
showMoreBtns = document.querySelectorAll('.show-more')
products = window.products

if (pathName == 'favorites') {
    arrItem = arr[0]
} else {
    arrItem = arr[1]
}

prices = document.querySelectorAll(`.${arrItem}__card__price`)
prices.forEach(price => {
    priceOld = price.querySelector(`.${arrItem}__card__price__old`)
    priceNew = price.querySelector(`.${arrItem}__card__price__new`)
    if (priceOld) {
        discount = Number(price.closest(`.${arrItem}__card`).querySelector(`.${arrItem}__card__discount__js`).innerHTML)
        priceInt = Number(priceOld.innerHTML.replace(" ", "").replace("₸", ""))
        priceDis = priceInt - ((priceInt * discount) / 100)
        priceNew.innerHTML = `${numberWithSpaces(Math.round(priceDis))} ₸`
    }
})

if (screen.width > 720) {
    if (products.length > 5) {
        for (i=0; i < products.slice(5).length; i++) {
            document.querySelectorAll('.fsd12mjh63').forEach(id => {
                if (Number(id.innerHTML) == products[i+5].id) {
                    id.closest(`.${arrItem}__card`).remove()
                }
            })
        }
    }

    showMoreBtns.forEach(btn => btn.addEventListener("click", (e)=> {
        e.preventDefault()
        cardsBlock = document.querySelector(`.${arrItem}__cards`)

        for (let i=0; i < products.slice(5).length; i++) {
            card = document.createElement('a')
            card.classList.add(`${arrItem}__card`)
            card.classList.add(`favorite-card`)
            card.href = `/product/${products[i+5]['id']}`

            id = document.createElement('div')
            id.classList.add('fsd12mjh63')
            id.style.display = 'none'
            id.innerHTML = products[i+5].id
            card.appendChild(id)

            imageBlock = document.createElement('div')
            imageBlock.classList.add(`${arrItem}__card__image-block`)

            upper = document.createElement('div')
            upper.classList.add(`${arrItem}__card__upper`)
            upperLeft = document.createElement('div')
            upperLeft.classList.add(`${arrItem}__card__upper__left`)

            if (products[i+5]['discount']) {
                discountJs = document.createElement('div')
                discountJs.classList.add(`${arrItem}__card__discount__js`)
                discountJs.innerHTML = products[i+5]['discount']
                discountJs.style.display = "none"
                discount = document.createElement('div')
                discount.classList.add(`${arrItem}__card__discount`)
                discount.classList.add('text-semibold-mid')
                discount.innerHTML = `-${products[i+5]['discount']}%`
                upperLeft.appendChild(discountJs)
                upperLeft.appendChild(discount)
            }
            if (products[i+5]['is_complect']) {
                complect = document.createElement('div')
                complect.classList.add(`${arrItem}__card__complect`)
                complect.classList.add('text-semibold-mid')
                complect.innerHTML = "комплект"
                upperLeft.appendChild(complect)
            }
            upper.appendChild(upperLeft)

            favoriteBtn = document.createElement(`div`)
            favoriteBtn.classList.add(`${arrItem}__card__favorite`)
            favoriteBtn.classList.add(`favorite-btn`)

            if (window.user_is_authenticated == "True") {
                svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                svgEl.setAttribute("width", "100%")
                svgEl.setAttribute("viewBox", "0 0 22 19")
                svgEl.setAttribute("fill", "none")
                svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')

                if (window.favArray.includes(products[i+5]['id'])) {
                    svgEl.classList.add('unfavorite-svg')
                    svgPath.setAttribute("d", "M11 19C10.8887 19 10.7775 18.9713 10.6778 18.9138C10.5695 18.8514 7.99691 17.3599 5.38743 15.1125C3.84082 13.7805 2.60624 12.4594 1.71808 11.1859C0.568758 9.53795 -0.00921315 7.95286 0.000111035 6.47457C0.0110251 4.75441 0.628011 3.13671 1.73755 1.91942C2.86582 0.681629 4.37152 0 5.97739 0C8.03545 0 9.91709 1.15121 11 2.97486C12.083 1.15125 13.9646 0 16.0227 0C17.5398 0 18.9873 0.615036 20.0986 1.73183C21.3183 2.9574 22.0112 4.68906 21.9999 6.48272C21.9905 7.95844 21.4017 9.54113 20.2498 11.1868C19.3589 12.4596 18.1261 13.7801 16.5855 15.1117C13.9856 17.3589 11.4315 18.8504 11.324 18.9128C11.2256 18.9699 11.1138 19 11 19Z")
                    svgPath.setAttribute("fill", "#FF6400")
                } else {
                    svgEl.classList.add('favorite-svg')
                    svgPath.setAttribute("d", "M16.2708 0C13.9755 0 11.8919 1.60413 11 3.77331C10.1081 1.60327 8.0245 0 5.72917 0C2.57033 0 0 2.43003 0 5.41644C0 11.2749 8.94117 17.6099 10.7332 18.8197L11 19L11.2668 18.8197C13.0598 17.6099 22 11.274 22 5.41644C22 2.43003 19.4297 0 16.2708 0ZM11 17.9332C6.28742 14.6963 0.916667 9.552 0.916667 5.41644C0.916667 2.90754 3.07542 0.86663 5.72917 0.86663C8.24817 0.86663 10.5417 3.34519 10.5417 6.06641H11.4583C11.4583 3.34519 13.7518 0.86663 16.2708 0.86663C18.9246 0.86663 21.0833 2.90754 21.0833 5.41644C21.0833 9.552 15.7126 14.6963 11 17.9332Z")
                    svgPath.setAttribute("fill", "currentColor")
                }
            } else {
                favoriteBtn.classList.add('popup-link')
                favoriteBtn.setAttribute("link", "favorites-popup")
                svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                svgEl.classList.add("favorite-svg-inactive")
                svgEl.setAttribute("width", "100%")
                svgEl.setAttribute("viewBox", "0 0 22 19")
                svgEl.setAttribute("fill", "none")
                svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg")
                svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                svgPath.setAttribute("d", "M16.2708 0C13.9755 0 11.8919 1.60413 11 3.77331C10.1081 1.60327 8.0245 0 5.72917 0C2.57033 0 0 2.43003 0 5.41644C0 11.2749 8.94117 17.6099 10.7332 18.8197L11 19L11.2668 18.8197C13.0598 17.6099 22 11.274 22 5.41644C22 2.43003 19.4297 0 16.2708 0ZM11 17.9332C6.28742 14.6963 0.916667 9.552 0.916667 5.41644C0.916667 2.90754 3.07542 0.86663 5.72917 0.86663C8.24817 0.86663 10.5417 3.34519 10.5417 6.06641H11.4583C11.4583 3.34519 13.7518 0.86663 16.2708 0.86663C18.9246 0.86663 21.0833 2.90754 21.0833 5.41644C21.0833 9.552 15.7126 14.6963 11 17.9332Z")
                svgPath.setAttribute("fill", "currentColor")
            }
            svgEl.appendChild(svgPath)
            favoriteBtn.appendChild(svgEl)
            upper.appendChild(favoriteBtn)
            imageBlock.appendChild(upper)

            imageEl = document.createElement('div')
            imageEl.classList.add(`${arrItem}__card__image`)
            imgTag = document.createElement('img')
            imgTag.setAttribute("src", `/media/${products[i+5].photo}`)
            imgTag.setAttribute("alt", "Product image")
            imageEl.appendChild(imgTag)
            imageBlock.appendChild(imageEl)
            card.appendChild(imageBlock)

            wrapContainer = document.createElement("div")
            wrapContainer.classList.add(`${arrItem}__card__wrapper`)
            wrapContainerInner = document.createElement("div")
            wrapContainerInner.classList.add(`${arrItem}__card__wrapper__inner`)
            wrapContainerLast = document.createElement("div")
            wrapContainerLast.classList.add(`${arrItem}__card__lastdiv`)

            if (arrItem != "category") {
                categoryEl = document.createElement("div")
                categoryEl.classList.add(`${arrItem}__card__category`)
                categoryEl.classList.add(`text-medium-small`)
                categoryEl.innerHTML = products[i+5].category__name
                wrapContainerInner.appendChild(categoryEl)
            }

            nameEl = document.createElement("div")
            nameEl.classList.add(`${arrItem}__card__name`)
            nameEl.classList.add(`text-medium-big`)
            nameEl.innerHTML = products[i+5].name
            wrapContainerInner.appendChild(nameEl)

            priceBlock = document.createElement('div')
            priceBlock.classList.add(`${arrItem}__card__price`)
            priceNew = document.createElement("div")
            priceNew.classList.add(`${arrItem}__card__price__new`)
            priceNew.classList.add(`text-regular`)

            if (products[i+5]['discount']) {
                priceOld = document.createElement("div")
                priceOld.classList.add(`${arrItem}__card__price__old`)
                priceOld.classList.add(`text-regular`)
                priceOld.innerHTML = `${products[i+5]['price']} ₸`

                discount = Number(products[i+5]['discount'])
                priceInt = Number(products[i+5]['price'].replace(" ", "").replace("₸", ""))
                priceDis = priceInt - ((priceInt * discount) / 100)
                priceNew.innerHTML = `${numberWithSpaces(Math.round(priceDis))} ₸`

                priceBlock.appendChild(priceNew)
                priceBlock.appendChild(priceOld)
            } else {
                priceNew.innerHTML = `${numberWithSpaces(products[i+5].price)} ₸`
                priceBlock.appendChild(priceNew)
            }

            wrapContainerLast.appendChild(priceBlock)

            if (window.cartArr) {
                for (let c=0; c < window.cartArr.length; c++) {
                    if (window.cartArr[c].product__id == products[i+5].id) {
                        cartEl = document.createElement("div")
                        cartEl.classList.add(`${arrItem}__card__cart`)
                        cartWrap = document.createElement("div")
                        cartWrap.classList.add(`${arrItem}__card__cart__wrapper`)
                        cartMinus = document.createElement("div")
                        cartMinus.classList.add(`${arrItem}__card__cart__minus`)
                        cartMinus.classList.add(`text-medium-big`)
                        cartMinus.innerHTML = "-"
                        cartValue = document.createElement("div")
                        cartValue.classList.add(`${arrItem}__card__cart__value`)
                        cartValue.classList.add(`text-medium-big`)
                        cartValue.innerHTML = window.cartArr[c].quantity
                        cartPlus = document.createElement("div")
                        cartPlus.classList.add(`${arrItem}__card__cart__plus`)
                        cartPlus.classList.add(`text-medium-big`)
                        cartPlus.innerHTML = "+"
                        cartWrap.appendChild(cartMinus)
                        cartWrap.appendChild(cartValue)
                        cartWrap.appendChild(cartPlus)
                        cartEl.appendChild(cartWrap)
                        wrapContainerLast.appendChild(cartEl)
                    }
                }
            }
            if (card.querySelector(`.${arrItem}__card__cart`)) {
                
            } else {
                cartBtn = document.createElement('div')
                cartBtn.classList.add(`${arrItem}__card__btn`)
                cartBtn.classList.add(`text-semibold-mid`)
                cartBtn.innerHTML = "Добавить в корзину"
                wrapContainerLast.appendChild(cartBtn)
            }

            wrapContainer.appendChild(wrapContainerInner)
            wrapContainer.appendChild(wrapContainerLast)
            card.appendChild(wrapContainer)
            cardsBlock.appendChild(card)
        }

        btn.remove()
        reloadCartScript()
        reloadPopupScript()
        reloadFavoritesScript()
        // btn.closest(`.${arrItem}__container`).appendChild(btn)
    }))
}