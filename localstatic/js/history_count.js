// btns = document.querySelectorAll('.history__accordion__question__btn')

// btns.forEach(btn => btn.addEventListener("click", function(e) {
//     e.preventDefault()
//     e.stopPropagation()
//     products = JSON.parse(this.dataset.products.replace(/'/g, '"'))

//     for (let i=0; i<products.length; i++) {
//         console.log(products[i])
//         console.log(products[i].id)
//         console.log(products[i].name)
//     }
    
//     $.ajax({
//         url: "/order/",
//         type: 'POST',
//         headers: { "X-CSRFToken": $.cookie("csrftoken") },
//         data: {
//             "data": "cart",
//             "quantity": Number(value.innerHTML),
//             "productId": id,
//         },
//     });
// }))


prices = document.querySelectorAll('.history__price__js')
totalEl = document.querySelector('.history__quantity__js')
let total = 0

prices.forEach(price => {
    discount = Number(price.closest('.history__accordion__panel__card').querySelector('.history__discount__js').innerHTML)
    priceInt = Number(price.innerHTML)
    if (discount) {
        console.log('bebebe')
        priceNew = priceInt - ((priceInt * discount) / 100)
        price.closest('.history__accordion__panel__card').querySelector('.history__accordion__panel__card__price').innerHTML = `${priceNew} x ${price.closest('.history__accordion__panel__card').querySelector('.history__quantity__js').innerHTML}шт.`
        total += priceNew * Number(price.closest('.history__accordion__panel__card').querySelector('.history__quantity__js').innerHTML)
    } else {
        total += priceInt * Number(price.closest('.history__accordion__panel__card').querySelector('.history__quantity__js').innerHTML)
    }
})
