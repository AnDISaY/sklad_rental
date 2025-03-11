document.querySelector('.header__menu').addEventListener("click", () => {
    var dropdown = document.querySelector('.dropdown');
    var menu = dropdown.closest('.header__menu-block').querySelector('.header__menu')

    menu.classList.toggle('menu-active')
    dropdown.classList.toggle('dropdown-active');
})