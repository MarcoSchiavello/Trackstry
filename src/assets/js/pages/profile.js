"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

Req.APIRequest('auth/isLoggedIn', 'GET')
.then(res => res.json())
.then(artist => {
    document.querySelector("#username").innerHTML = artist.name;
    document.querySelector("#email").innerHTML = artist.email;
    document.querySelector("#img_profile").src = `http://${Config.API}` + artist.img;
    document.querySelector(".imgBanner").src = `http://${Config.API}` + artist.banner;
})