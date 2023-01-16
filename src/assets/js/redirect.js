"use strict";

document.querySelectorAll('*[redirect]').forEach(ele => {
    ele.onclick = e => {
        location.href = ele.getAttribute('redirect');
    };
});