var acc = document.querySelectorAll(".faq__accordion__question");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        var icon = this.lastChild.previousSibling.children[1];

        // if (panel.classList.contains("accordion-panel-active")) {
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null; // Close the panel
            this.classList.toggle("accordion-active");
            panel.classList.toggle("accordion-panel-active");
            icon.classList.toggle("accordion-icon-active");
        } else {
            acc.forEach(acc => {acc.classList.remove("accordion-active")});
            document.querySelectorAll(".faq__accordion__answer").forEach(panel => {
                panel.classList.remove("accordion-panel-active");
                panel.style.maxHeight = null; // Close the panel
            })
            document.querySelectorAll('.faq-line2').forEach(icon => icon.classList.remove('accordion-icon-active'))
            this.classList.toggle("accordion-active");
            panel.classList.toggle("accordion-panel-active");
            icon.classList.toggle("accordion-icon-active");
            panel.style.maxHeight = panel.scrollHeight + "px"; // Expand the panel
        }
    });
}

var acc = document.querySelectorAll(".history__accordion__question");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        var icon = this.lastChild.previousSibling.children[1];
        var icon2 = this.querySelector('.history__accordion__question__icon');
        var btn = this.querySelector('.history__accordion__question__btn');

        if (panel.classList.contains("accordion-panel-active")) {
            this.classList.toggle("accordion-active");
            panel.classList.toggle("accordion-panel-active");
            icon.classList.toggle("accordion-icon-active");
            btn.classList.toggle("accordion-btn-active");

            if (screen.width <= 720) {
                // this.querySelector(".history__accordion__question__block").style.width = "100%"
                this.style.padding = "0 18px 0 0"
                icon2.classList.toggle("accordion-icon-active");
            }
        } else {
            acc.forEach(acc => {acc.classList.remove("accordion-active")});
            document.querySelectorAll('.history__accordion__question__btn').forEach(btn => btn.classList.remove('accordion-btn-active'))
            document.querySelectorAll(".history__accordion__panel").forEach(panel => panel.classList.remove("accordion-panel-active"))
            document.querySelectorAll('.history-line2').forEach(icon => icon.classList.remove('accordion-icon-active'))
            this.classList.toggle("accordion-active");
            panel.classList.toggle("accordion-panel-active");
            icon.classList.toggle("accordion-icon-active");
            btn.classList.toggle("accordion-btn-active");

            if (screen.width <= 720) {
                document.querySelectorAll('.history__accordion__question__block').forEach(block => block.style.width = "auto")
                document.querySelectorAll(".history__accordion__question").forEach(question => question.style.padding = "0 18px 0 0")
                document.querySelectorAll('.history__accordion__question__icon').forEach(icon => icon.classList.remove('accordion-icon-active'))
                icon2.classList.toggle("accordion-icon-active");
                this.querySelector(".history__accordion__question__block").style.width = "100%"
                this.style.padding = "0"
            }
        }
    });
}