popupLinks = document.querySelectorAll('.popup-link')
popups = document.querySelectorAll('.popup')
crosses = document.querySelectorAll('.popup-close')
body = document.querySelector('body')


popupLinks.forEach(link => link.addEventListener("click", (e)=> {
    e.preventDefault()
    openPopup(link)
}))

function openPopup(link) {
    if (link.classList[0] != "profile-mobile__item") {
        popups.forEach(popup => popup.classList.remove('popup-active'))
    }
    allBackground = document.querySelector(".all-background")
    if (allBackground) {
        allBackground.remove()
    }

    href = link.href
    if (href) {
        href = href.slice(link.href.indexOf('#'))
    } else {
        href = `#${link.attributes[1].value}`
    }

    popup = document.querySelector(href)
    popup.classList.add('popup-active')

    popupFlag = true
    if (popup.classList.contains("catalog-mobile")) {
        popupFlag = false
    } else if (popup.classList.contains("profile-mobile")) {
        popupFlag = false
    } else if (popup.classList.contains("profile")) {
        popupFlag = false
    }
    if (popupFlag) {
        background = document.createElement("div")
        background.classList.add("all-background")
        background.style.position = "absolute"
        background.style.left = "0"
        background.style.top = "0"
        background.style.zIndex = "99"
        background.style.height = "100%"
        background.style.width = "100%"
        background.style.background = "rgba(28, 28, 28, 0.7)"
        document.querySelector("body").append(background)
    }
    if (!popup.classList.contains("profile")) {
        body.classList.add('lock')
    }

    history.replaceState('', document.title, window.location.origin + window.location.pathname + window.location.search);
}

crosses.forEach(cross => cross.addEventListener("click", ()=> {
    popup = cross.closest('.popup')
    popup.classList.remove('popup-active')
    if (document.querySelector(".all-background")) {
        document.querySelector(".all-background").remove()
    }
    body.classList.remove('lock')
}))

window.onkeydown = function(event) {
    if (event.keyCode == 27) {
        popups.forEach(popup => popup.classList.remove('popup-active'))
        if (document.querySelector(".all-background")) {
            document.querySelector(".all-background").remove()
        }
        body.classList.remove('lock')
    }
};

backgrounds = document.querySelectorAll('.popup-background')

backgrounds.forEach(back => back.addEventListener("click", ()=> {
    popups.forEach(popup => popup.classList.remove('popup-active'))
    if (document.querySelector(".all-background")) {
        document.querySelector(".all-background").remove()
    }
    body.classList.remove('lock')
}))

function reloadPopupScript() {
    let oldScript = document.querySelector("#popupScript");
    if (oldScript) {
        oldScript.remove(oldScript); // Remove the old script
    }
    popupLinks.forEach(link => link.replaceWith(link.cloneNode(true)))
    crosses.forEach(cross => cross.replaceWith(cross.cloneNode(true)))
    backgrounds.forEach(back => back.replaceWith(back.cloneNode(true)))

    let newScript = document.createElement("script");
    newScript.src = `/static/js/popup.js`;
    newScript.id = "cartScript";
    newScript.type = "text/javascript";
    document.body.appendChild(newScript);
}