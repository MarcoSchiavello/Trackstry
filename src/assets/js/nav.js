"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

const mapPathToPointerPos = {
    '/': 0,
    '/artisti': 1,
    '/mia_musica': 2
}

//moves the navbar cursor in the position indicated as parameter
function movePointer(voce) {
    const voceEle = document.querySelectorAll('.nav__voices > li')[voce];
    const selector = document.querySelector('.nav__selector');
    selector.style.left= (voceEle.offsetLeft + (voceEle.offsetWidth/2)-(selector.offsetWidth/2) + 'px');
} 

Req.APIRequest('auth/isLoggedIn', 'GET')
.then(res => {
    if(res.status > 399) //throw an error if the api goes wrong
        throw new Error(res.status);
    return res.json(); 
})
.then(artist => {
    //in case of success load the nav for logged user and his action
    const template = document.querySelector('*[template="loggedin"]');
    template.innerHTML = template.innerHTML.replace(/{{userId}}/g, artist.id);
    document.querySelector('*[template="default"]').remove();
    template.classList.remove('hidden');
        
    template.querySelector('.nav__user-img').src = `http://${Config.API}` + artist.img;
    template.querySelector('.nav__username').innerHTML += artist.name;
    template.querySelector('.user-menu__voice').innerHTML = artist.name;

    //drop menu three dot
    template.querySelector('*[action="dotMenuIcon"]').onclick = () => {
        const dotMenuCont = document.querySelector('*[action="dotMenuCont"]');
        if(dotMenuCont.style.display == 'block')
            dotMenuCont.style.display = 'none';
        else
            dotMenuCont.style.display = 'block';
    };

    template.querySelector('*[action="logout"]').onclick = e =>{
        Req.APIRequest('auth/logout', 'POST')
        .then(res => {
            location.href = "/login";
        });
    }
})
.catch(err =>{
    //nav for users that are not logged in
    const template = document.querySelector('*[template="default"]');
    document.querySelector('*[template="loggedin"]').remove();
    template.classList.remove('hidden');
})
.finally(() => {
    let basePointerPosition = mapPathToPointerPos['/' + location.pathname.split(/\//g)[1]];
    basePointerPosition = basePointerPosition === undefined ? 0 : basePointerPosition;

    document.querySelectorAll('.nav__voices > li').forEach((voice, i) => {
        voice.addEventListener('mouseover', e => { movePointer(i) });
        voice.addEventListener('mouseleave', e => { movePointer(basePointerPosition) });
    });

    movePointer(basePointerPosition);

    const nav = document.querySelector(".nav");
    
    if (document.documentElement.scrollTop >= 150) {
        nav.style.background="white";
        nav.style.borderBottom="solid black 1px";
    }

    window.onscroll = () => {
        if (document.documentElement.scrollTop >= 10) {
            nav.style.background="white";
            nav.style.borderBottom="solid black 1px";
        } else {
            nav.style.background="transparent";
            nav.style.borderBottom="";
        }
    };

    window.onresize = () => movePointer(basePointerPosition);
});
