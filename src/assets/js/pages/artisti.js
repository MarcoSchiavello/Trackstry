"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

Req.APIRequest('artists', 'GET')
.then(res => res.json())
.then(artists => {
    const clone = document.querySelector('*[template="artistCard"]');
    const list = clone.parentElement;

    artists.forEach(artist => {
        const newClone = clone.cloneNode(true);

        newClone.removeAttribute('template');
        newClone.querySelector('*[field="artistImg"]').src = `http://${Config.API}` + artist.img;
        newClone.querySelector('*[field="artistName"]').innerHTML = artist.name;
        newClone.addEventListener('click', e => location.href = '/artista/' + artist.id);

        newClone.classList.remove('hidden');
        list.appendChild(newClone);
    });
})