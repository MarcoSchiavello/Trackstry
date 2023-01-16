"use strict";

let offset = 0;

//swap to the next img in the slider show
function slideNext(slider) {
    if(slider.childElementCount-1 === offset) {
        slider.style.transition = "unset";
        slider.style.left = "0%";
        offset = 0;
    } else {
        slider.style.transition = "2s ease";
        slider.style.left = "-"+offset+"00%";
    }

    offset++;
}

setInterval(() => slideNext(document.querySelector("#slider")), 5000);