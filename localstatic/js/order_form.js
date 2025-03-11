deliveryBtns = document.querySelectorAll('.order__form__delivery-label')

deliveryBtns.forEach(btn => btn.addEventListener("click", ()=> {
    deliveryBtns.forEach(btn => btn.classList.remove('form-delivery-active'))
    btn.classList.add('form-delivery-active')
}))

dateInputs = document.querySelectorAll('.input-type-date')
timeInputs = document.querySelectorAll('.input-type-time')


dateInputs.forEach(input => input.addEventListener("change", ()=> {
    let date = new Date(input.value);
    let formattedDate = date.toLocaleDateString('ru-RU'); // Format DD.MM.YYYY
    input.closest(".order__form__datetime-label").querySelector(".order__form__datetime-label__text").innerHTML = formattedDate;
}));


timeInputs.forEach(input => input.addEventListener("change", ()=> {
    input.closest(".order__form__datetime-label").querySelector(".order__form__datetime-label__text").innerHTML = input.value;
}));

