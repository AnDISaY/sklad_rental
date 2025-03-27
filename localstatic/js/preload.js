function showAnimation () {
    document.body.classList.toggle('loader');
  }
  
window.addEventListener("load", ()=> {
    document.querySelector("body").classList.remove("lock")
    document.querySelector(".loader").style.display = "none"
    document.querySelector("header").style.setProperty('display', 'block', 'important')
    document.querySelectorAll("section").forEach(section => section.style.setProperty('display', 'block', 'important'))
    if (screen.width > 720) {
        document.querySelector(".footer").style.setProperty('display', 'block', 'important')
    } else {
        document.querySelector(".footer-mobile").style.setProperty('display', 'block', 'important')
    }
})