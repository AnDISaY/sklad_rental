prices = document.querySelectorAll('.cart__card__price')
priceTotal = document.querySelector('.cart__buy__price')
flushes = document.querySelectorAll('.cart__flush')
trash_multiple = document.querySelectorAll('.cart__card__trash')
total = 0

prices.forEach(price => {
    discount = Number(price.closest('.cart__card').querySelector('.cart__card__discount__js').innerHTML)
    priceInt = Number(price.innerHTML.replace(" ", "").replace("₸", ""))
    if (discount) {
        priceNew = priceInt - ((priceInt * discount) / 100)
        price.innerHTML = `${numberWithSpaces(priceNew)} ₸`
        total += priceNew * Number(price.closest('.cart__card').querySelector('.cart__card__quantity__value').innerHTML)
    } else {
        total += priceInt * Number(price.closest('.cart__card').querySelector('.cart__card__quantity__value').innerHTML)
    }
})
priceTotal.innerHTML = `${numberWithSpaces(total)} ₸`

flushes.forEach(flush => flush.addEventListener("click", (e)=> {
    e.preventDefault()

    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        headers: { "X-CSRFToken": $.cookie("csrftoken") },
        data: {
            "data": "cart",
            "method": 'deleteAll',
        },
    });

    flush.closest('.cart').querySelectorAll('.cart__card').forEach(card => card.remove())
    flush.closest('.cart').querySelector('.cart__text').innerHTML = "В вашей корзине 0 товаров:"
    cartBuy = flush.closest('.cart').querySelector('.cart__buy')
    if (cartBuy) {
        cartBuy.remove()
    }
    flush.remove()
    setTimeout(function () {
        window.location.reload()
    }, 500)
}))

trash_multiple.forEach(trash => trash.addEventListener('click', (e)=> {
    e.preventDefault()
    id = trash.closest('.cart__card').querySelector('.fsd12mjh63').innerHTML

    quantity = document.querySelector('.bsdfjl392dm')
    quantity_text = trash.closest('.cart__content').querySelector('.cart__text')
    quantity_value = quantity_text.innerHTML
    quantity_text.innerHTML = quantity_value.replace(quantity.innerHTML, `${Number(quantity.innerHTML) - 1}`)
    quantity.innerHTML = `${Number(quantity.innerHTML) - 1}`
    if (Number(quantity.innerHTML) == 0) {
        document.querySelector('.cart__buy').remove()
        document.querySelectorAll('.cart__flush').forEach(flush => flush.remove())
    }

    price = trash.closest('.cart__card').querySelector('.cart__card__price')
    productQuantity = trash.closest('.cart__card').querySelector('.cart__card__quantity__value').innerHTML
    priceInt = Number(price.innerHTML.slice(0, -1)) * Number(productQuantity)
    total -= priceInt
    priceTotal.innerHTML = `${total}₸`
    textCorrection()

    // if (quantity_value[16] - 1 == 0) {trash.closest('.cart__content').querySelector('.cart__flush').remove()}
    trash.closest('.cart__card').remove()

    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        headers: { "X-CSRFToken": $.cookie("csrftoken") },
        data: {
            "data": "cart",
            "method": 'delete',
            "productId": id,
        },
    });
}))


minuses = document.querySelectorAll('.cart__card__quantity__minus')
pluses = document.querySelectorAll('.cart__card__quantity__plus')

for (let i=0; i < minuses.length; i++) {
    value = minuses[i].closest('.cart__card__quantity__wrapper').querySelector('.cart__card__quantity__value')
    if (Number(value.innerHTML) == 1) {
        minuses[i].classList.add('countOne')
    }
}

minuses.forEach(minus => minus.addEventListener('click', (e)=> {
    e.preventDefault()
    id = minus.closest('.cart__card').querySelector('.fsd12mjh63').innerHTML

    value = minus.closest('.cart__card__quantity__wrapper').querySelector('.cart__card__quantity__value')
    if (Number(value.innerHTML) != 1) {
        price = minus.closest('.cart__card').querySelector('.cart__card__price')
        priceInt = Number(price.innerHTML.slice(0, -1))
        value.classList.remove('countOne')
        dif = Number(value.innerHTML) - 1
        value.innerHTML = dif
        if (dif == 1) {minus.classList.add('countOne')}
        total -= priceInt
        priceTotal.innerHTML = `${total}₸`

        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            headers: { "X-CSRFToken": $.cookie("csrftoken") },
            data: {
                "data": "cart",
                "quantity": Number(value.innerHTML),
                "productId": id,
            },
        });
    } 
}))

pluses.forEach(plus => plus.addEventListener('click', (e)=> {
    e.preventDefault()
    plus.closest('.cart__card__quantity__wrapper').querySelector('.cart__card__quantity__minus').classList.remove('countOne')
    id = plus.closest('.cart__card').querySelector('.fsd12mjh63').innerHTML
    price = plus.closest('.cart__card').querySelector('.cart__card__price')
    priceInt = Number(price.innerHTML.slice(0, -1))

    value = plus.closest('.cart__card__quantity__wrapper').querySelector('.cart__card__quantity__value')
    dif = Number(value.innerHTML) + 1
    value.innerHTML = dif

    total += priceInt
    priceTotal.innerHTML = `${total}₸`

    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        headers: { "X-CSRFToken": $.cookie("csrftoken") },
        data: {
            "data": "cart",
            "quantity": Number(value.innerHTML),
            "productId": id,
        },
    });
}))


function textCorrection() {
    text = Number(document.querySelector('.bsdfjl392dm').innerHTML)
    quantity = document.querySelector('.cart__text')
    quantity_text = quantity.innerHTML
    quantity__letter = quantity_text.slice(-2, -1)
    numArray = [2, 3, 4]
    
    if (numArray.includes(text)) {
        if (quantity__letter == "в") {
            quantity.innerHTML = `${quantity_text.slice(0, -3)}а:`
        } else if (quantity__letter == "р") {
            quantity.innerHTML = `${quantity_text}а:`
        }

    } else if (text == 1) {
        if (quantity__letter == "в") {
            quantity.innerHTML = `${quantity_text.slice(0, -3)}:`
        } else if (quantity__letter == "а") {
            quantity.innerHTML = `${quantity_text.slice(0, -2)}:`
        }
    } else {
        if (quantity__letter == "а") {
            quantity.innerHTML = `${quantity_text.slice(0, -2)}ов:`
        } else if (quantity__letter == "р") {
            quantity.innerHTML = `${quantity_text.slice(0, -1)}ов:`
        }
    }
}

textCorrection()