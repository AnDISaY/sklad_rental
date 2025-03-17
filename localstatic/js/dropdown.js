var dropdown = document.querySelector('.dropdown');
var menu = dropdown.closest('.header__menu-block').querySelector('.header__menu')

document.querySelector('.header__menu').addEventListener("click", () => {
    menu.classList.toggle('menu-active')
    dropdown.classList.toggle('dropdown-active');
})

window.addEventListener('click', function(e){   
    if (!dropdown.contains(e.target) & !menu.contains(e.target)){
        menu.classList.toggle('menu-active')
        dropdown.classList.toggle('dropdown-active');
    }
  });