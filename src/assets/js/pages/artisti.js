"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

Req.APIRequest('artists', 'GET')
.then(res => res.json())
.then(artists => {
    const list = document.querySelector(".cointeiner_card");
    artists.forEach(artist => {
        const clone = document.querySelector(".card_artisti").cloneNode(true);
        clone.querySelector("img").src = `http://${Config.API}` + artist.img;
        clone.querySelector(".name_artista").innerHTML = artist.name;
        clone.addEventListener("click",e => location.href = "/artista/"+artist.id);

        clone.removeAttribute("style");
        list.appendChild(clone);
    });
})