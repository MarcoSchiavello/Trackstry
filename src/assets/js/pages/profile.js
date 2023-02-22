"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

Req.APIRequest('auth/isLoggedIn', 'GET')
.then(res => res.json())
.then(artist => {
    document.querySelector('*[field="username"]').innerHTML = artist.name;
    document.querySelector('*[field="email"]').innerHTML = artist.email;
    document.querySelector('*[field="profileImg"]').src = `http://${Config.API}` + artist.img;
    document.querySelector('*[field="profileBanner"]').src = `http://${Config.API}` + artist.banner;

    document.querySelector('*[action="changeData"]').addEventListener('click', e => {
        const body = new FormData();
        if(document.querySelector('*[field="newImg"]').files[0] !== undefined)
            body.append("newImg", document.querySelector('*[field="newImg"]').files[0]);
        if(document.querySelector('*[field="newBanner"]').files[0] !== undefined)
            body.append("newBanner", document.querySelector("*[field='newBanner']").files[0]);
        if(document.querySelector("input[name='newEmail']").value.trim() !== '')
            body.append("newEmail", document.querySelector("input[name='newEmail']").value);
        if(document.querySelector("input[name='newUsername']").value.trim() !== '')
            body.append("newUsername", document.querySelector("input[name='newUsername']").value);
        if(document.querySelector("input[name='newPassword']").value.trim() !== '')
            body.append("newPassword", document.querySelector("input[name='newPassword']").value);
        
        Req.APIRequest(`artists/${artist.id}`, 'PATCH', body, false)
        .then( res => location.reload() );
    });
});
