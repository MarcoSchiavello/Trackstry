"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

Req.APIRequest('auth/isLoggedIn', 'GET')
.then(res => res.json())
.then(artist => {
    document.querySelector(".img_cover").src = `http://${Config.API}` + artist.banner;

    Req.APIRequest(`artists/${artist.id}/favorites`, 'GET')
    .then(res => res.json())
    .then(favorites => {
        const list = document.querySelector(".album_list");
        
        favorites.forEach(ele => {
            const clone = document.querySelector(".album_song").cloneNode(true);
            clone.querySelector(".song_name").innerHTML = ele.song.name;
            clone.querySelector(".duration").innerHTML = getTimeFormat(ele.song.duration);
            clone.querySelector(".author").innerHTML = ele.artist.name;
            clone.querySelector(".song_title").innerHTML = ele.album.name;

            clone.removeAttribute("style");
            list.appendChild(clone);
        });
    });
});