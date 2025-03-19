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
