document.addEventListener("DOMContentLoaded", cartSetup());

function cartSetup() {
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
    
    carts = document.querySelectorAll(`.${cartItem}__card__cart`)
    carts.forEach(cart => {
        cart.addEventListener("click", (e)=> {e.preventDefault()})
        btn = cart.closest(`.${cartItem}__card`).querySelector(`.${cartItem}__card__btn`)
        if (btn != null) {btn.remove()}
    })
    btns = document.querySelectorAll(`.${cartItem}__card__btn`)
    
    btns.forEach(btn => btn.addEventListener('click', (e)=> {
        e.preventDefault()
        e.stopPropagation()
        id = btn.closest(`.${cartItem}__card`).querySelector('.fsd12mjh63').innerHTML
        
        cart = document.createElement('div')
        cart.classList.add(`${cartItem}__card__cart`)
        wrapper = document.createElement('div')
        wrapper.classList.add(`${cartItem}__card__cart__wrapper`)
        minus = document.createElement('div')
        minus.classList.add(`${cartItem}__card__cart__minus`)
        minus.classList.add('text-medium-big')
        minus.innerHTML = "-"
        text = document.createElement('div')
        text.classList.add(`${cartItem}__card__cart__value`)
        text.classList.add('text-medium-big')
        text.innerHTML = 1
        plus = document.createElement('div')
        plus.classList.add(`${cartItem}__card__cart__plus`)
        plus.classList.add('text-medium-big')
        plus.innerHTML = "+"
        wrapper.appendChild(minus)
        wrapper.appendChild(text)
        wrapper.appendChild(plus)
        cart.appendChild(wrapper)
    
        if (cartItem == "product") {
            btn.closest(`.${cartItem}__card`).prepend(cart)
        } else {
            btn.closest(`.${cartItem}__card`).querySelector(`.${cartItem}__card__lastdiv`).appendChild(cart)
        }
        btn.remove()

        cart_number = document.querySelector('.header__searchbar__cart__item__number')
        if (cart_number) {
            cart_number.innerHTML = Number(cart_number.innerHTML) + 1
        } else {
            cart_number = document.createElement('div')
            cart_number.classList.add('header__searchbar__cart__item__number')
            cart_number.innerHTML = 1
            document.querySelector('.header__searchbar__cart__item__icon').after(cart_number)
        }
    
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            headers: { "X-CSRFToken": $.cookie("csrftoken") },
            data: {
                "data": "cart",
                "quantity": 1,
                "productId": id,
            },
        });
    
        reloadCartScript()
    }))
    
    minuses = document.querySelectorAll(`.${cartItem}__card__cart__minus`)
    pluses = document.querySelectorAll(`.${cartItem}__card__cart__plus`)
    
    minuses.forEach(minus => minus.addEventListener('click', (e)=> {
        e.preventDefault()
        e.stopPropagation()
        id = minus.closest(`.${cartItem}__card`).querySelector('.fsd12mjh63').innerHTML
    
        value = minus.closest(`.${cartItem}__card__cart__wrapper`).querySelector(`.${cartItem}__card__cart__value`)
        dif = Number(value.innerHTML) - 1
        value.innerHTML = dif
    
        if (dif == 0) {
            btn = document.createElement('div')
            btn.classList.add(`${cartItem}__card__btn`)
            if (cartItem == "product") {
                btn.classList.add(`${cartItem}__btn`)
                btn.classList.add(`text-main`)
            } else {
                btn.classList.add(`text-semibold-mid`)
            }
            btn.innerHTML = "Добавить в корзину"
    
            if (cartItem == "product") {
                minus.closest(`.${cartItem}__card`).prepend(btn)
            } else {
                minus.closest(`.${cartItem}__card`).querySelector(`.${cartItem}__card__lastdiv`).appendChild(btn)
            }
            minus.closest(`.${cartItem}__card__cart`).remove()

            cart_number = document.querySelector('.header__searchbar__cart__item__number')
            if (Number(cart_number.innerHTML) == 1) {
                cart_number.remove()
            } else {
                cart_number.innerHTML = Number(cart_number.innerHTML) - 1
            }
    
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
    
            reloadCartScript()
        } else {
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
        e.stopPropagation()
        id = plus.closest(`.${cartItem}__card`).querySelector('.fsd12mjh63').innerHTML
    
        value = plus.closest(`.${cartItem}__card__cart__wrapper`).querySelector(`.${cartItem}__card__cart__value`)
        dif = Number(value.innerHTML) + 1
        value.innerHTML = dif
    
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
}
    
function reloadCartScript() {
    let oldScript = document.querySelector("#cartScript");
    if (oldScript) {
        oldScript.remove(oldScript); // Remove the old script
    }
    btns.forEach(btn => btn.replaceWith(btn.cloneNode(true)))
    minuses.forEach(minus => minus.replaceWith(minus.cloneNode(true)))
    pluses.forEach(plus => plus.replaceWith(plus.cloneNode(true)))

    let newScript = document.createElement("script");
    newScript.src = `/static/js/cart.js`;
    newScript.id = "cartScript";
    newScript.type = "text/javascript";
    document.body.appendChild(newScript);
}


 
// cartArray = ['popular', 'category']


// for (let i=0; i < cartArray.length; i++) {
//     cartItem = cartArray[i]

//     carts = document.querySelectorAll(`.popular__card__cart`)
//     carts.forEach(cart => {
//         cart.addEventListener("click", (e)=> {e.preventDefault()})
//         btn = cart.closest(`.popular__card`).querySelector(`.popular__card__btn`)
//         if (btn != null) {btn.remove()}
//     })
//     btns = document.querySelectorAll(`.popular__card__btn`)

//     btns.forEach(btn => btn.addEventListener('click', (e)=> {
//         e.preventDefault()
//         id = btn.closest(`.popular__card`).querySelector('.fsd12mjh63').innerHTML

        
//         cart = document.createElement('div')
//         cart.classList.add(`popular__card__cart`)
//         wrapper = document.createElement('div')
//         wrapper.classList.add(`popular__card__cart__wrapper`)
//         minus = document.createElement('div')
//         minus.classList.add(`popular__card__cart__minus`)
//         minus.classList.add('text-medium-big')
//         minus.innerHTML = "-"
//         text = document.createElement('div')
//         text.classList.add(`popular__card__cart__value`)
//         text.classList.add('text-medium-big')
//         text.innerHTML = 1
//         plus = document.createElement('div')
//         plus.classList.add(`popular__card__cart__plus`)
//         plus.classList.add('text-medium-big')
//         plus.innerHTML = "+"
//         wrapper.appendChild(minus)
//         wrapper.appendChild(text)
//         wrapper.appendChild(plus)
//         cart.appendChild(wrapper)

//         btn.closest(`.popular__card`).appendChild(cart)
//         btn.remove()

//         $.ajax({
//             url: window.location.pathname,
//             type: 'POST',
//             headers: { "X-CSRFToken": $.cookie("csrftoken") },
//             data: {
//                 "data": "cart",
//                 "quantity": 1,
//                 "productId": id,
//             },
//         });

//         reloadScript('static/js/cart.js')
//     }))

//     minuses = document.querySelectorAll(`.popular__card__cart__minus`)
//     pluses = document.querySelectorAll(`.popular__card__cart__plus`)

//     minuses.forEach(minus => minus.addEventListener('click', (e)=> {
//         e.preventDefault()
//         id = minus.closest(`.popular__card`).querySelector('.fsd12mjh63').innerHTML

//         value = minus.closest(`.popular__card__cart__wrapper`).querySelector(`.popular__card__cart__value`)
//         dif = Number(value.innerHTML) - 1
//         value.innerHTML = dif

//         if (dif == 0) {
//             btn = document.createElement('div')
//             btn.classList.add(`popular__card__btn`)
//             btn.innerHTML = "Добавить в корзину"
//             minus.closest(`.popular__card`).appendChild(btn)
//             minus.closest(`.popular__card__cart`).remove()

//             $.ajax({
//                 url: window.location.pathname,
//                 type: 'POST',
//                 headers: { "X-CSRFToken": $.cookie("csrftoken") },
//                 data: {
//                     "data": "cart",
//                     "quantity": Number(value.innerHTML),
//                     "productId": id,
//                 },
//             });

//             reloadScript('static/js/cart.js')
//         } else {
//             $.ajax({
//                 url: window.location.pathname,
//                 type: 'POST',
//                 headers: { "X-CSRFToken": $.cookie("csrftoken") },
//                 data: {
//                     "data": "cart",
//                     "quantity": Number(value.innerHTML),
//                     "productId": id,
//                 },
//             });
//         }
//     }))

//     pluses.forEach(plus => plus.addEventListener('click', (e)=> {
//         e.preventDefault()
//         id = plus.closest(`.popular__card`).querySelector('.fsd12mjh63').innerHTML

//         value = plus.closest(`.popular__card__cart__wrapper`).querySelector(`.popular__card__cart__value`)
//         dif = Number(value.innerHTML) + 1
//         value.innerHTML = dif

//         $.ajax({
//             url: window.location.pathname,
//             type: 'POST',
//             headers: { "X-CSRFToken": $.cookie("csrftoken") },
//             data: {
//                 "data": "cart",
//                 "quantity": Number(value.innerHTML),
//                 "productId": id,
//             },
//         });
//     }))
// }


// function reloadScript(file) {
//     let oldScript = document.querySelector(`script[src="${file}"]`);
//     if (oldScript) {
//         oldScript.parentNode.removeChild(oldScript); // Remove the old script
//     }

//     let newScript = document.createElement("script");
//     newScript.src = file;
//     newScript.type = "text/javascript";
//     document.body.appendChild(newScript);
// }
