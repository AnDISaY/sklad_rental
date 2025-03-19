prices = document.querySelectorAll('.order__cart__card__price__js')
totalEl = document.querySelector('.order__cart__total')
let total = 0

prices.forEach(price => {
    discount = Number(price.closest('.order__cart__card').querySelector('.order__cart__card__discount__js'))
    priceInt = Number(price.innerHTML)
    if (discount) {
        discount = discount.innerHTML
        priceNew = priceInt - ((priceInt * discount) / 100)
        price.closest('.order__cart__card').querySelector('.order__cart__card__price').innerHTML = `${priceNew} x ${price.closest('.order__cart__card').querySelector('.order__cart__card__quantity__js').innerHTML}шт.`
        total += priceNew * Number(price.closest('.order__cart__card').querySelector('.order__cart__card__quantity__js').innerHTML)
    } else {
        total += priceInt * Number(price.closest('.order__cart__card').querySelector('.order__cart__card__quantity__js').innerHTML)
    }
})
totalEl.innerHTML = `${total}₸`
document.querySelector('#priceInput').value = total

// $('.order__form').on('submit', function(event) {
//     event.preventDefault()
//     data = [{"total": total}, []]
//     ids = document.querySelectorAll('.order__cart__card__id__js')
//     ids.forEach(id => {
//         dataDict = {}
//         orderCart = id.closest('.order__cart__card')
//         dataDict['id'] = id
//         dataDict['name'] = orderCart.querySelector('.order__cart__card__title')
//         dataDict['price'] = orderCart.querySelector('.order__cart__card__price__js')
//         dataDict['quantity'] = orderCart.querySelector('.order__cart__card__quantity__js')
//         data[1].push(dataDict)
//     })
//     console.log(data)
//     console.log($(this))

//     $.ajax({
//         url: window.location.pathname,
//         type: 'POST',
//         headers: { "X-CSRFToken": $.cookie("csrftoken") },
//         data: [$(this).serialize(), data],
//     });
// });