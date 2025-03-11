var acc = document.querySelectorAll(".faq__accordion__question");
var i;

for (i = 0; i < acc.length; i++) {
acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    var icon = this.lastChild.previousSibling.children[1];

    if (panel.classList.contains("accordion-panel-active")) {
    this.classList.toggle("accordion-active");
    panel.classList.toggle("accordion-panel-active");
    icon.classList.toggle("accordion-icon-active");
    } else {
    acc.forEach(acc => {acc.classList.remove("accordion-active")});
    document.querySelectorAll(".faq__accordion__answer").forEach(panel => {
        panel.classList.remove("accordion-panel-active");
    })
    document.querySelectorAll('.faq-line2').forEach(icon => icon.classList.remove('accordion-icon-active'))
    this.classList.toggle("accordion-active");
    panel.classList.toggle("accordion-panel-active");
    icon.classList.toggle("accordion-icon-active");
    }
});
}