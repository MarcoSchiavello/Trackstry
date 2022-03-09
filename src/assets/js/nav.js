"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

//moves the navbar cursor in the position indicated as parameter
function movePointer(voce)
{
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
    document.querySelector('.nav').innerHTML = `
    <a href="/">
        <img src="../assets/img/Logo.png" alt="icon" class="nav__logo">
    </a>
    <div class="container container--row container--nogap">
        <ul class="nav__voices container container--row container--nogap">
            <li on0)"><a href="/">Home</a></li>
            <li><a href="/artisti">artisti</a></li>
            <li class="user-menu container " id="userMenu" >
                <span class="user-menu__voice" >sdadas</span>
                <ul class="user-menu__list" id="userMenuCont">
                    <li><a href="/mia_musica/${artist.id}">Musica</a></li>
                    <li><a href="/preferiti/${artist.id}">Preferiti</a></li>
                </ul>
            </li>       
        </ul>

        <img src="../assets/img/nav/selector.png" alt="selector" class="nav__selector">
            
        <hr class="nav__separator">
        
        <div class="nav__user-cont container container--row container--Sgap container--SMarginH">
            <img src="../assets/img/slider/sec_1.jpg" class="nav__user-img">

            <div class="nav__username">
                Ciao, <br>dsadadads
            </div>

            <div class="dot-menu"> 
                <span class="dot-menu__icon container container--nogap" id="dotMenuIcon">
                    <div></div>
                    <div></div>
                    <div></div>
                </span>

                <ul class="dot-menu__list user-menu__list" id="dotMenuCont">
                    <li><a href="/profilo/${artist.id}">Modifica profilo</a></li>
                    <li><a id="logout">Logout</a></li>
                </ul>
            </div>
            
        </div>
    </div>`;
        
    document.querySelector('.nav__user-img').src = `http://${Config.API}` + artist.img;
    document.querySelector('.nav__username').innerHTML += artist.name;
    document.querySelector('.user-menu__voice').innerHTML = artist.name;

    //drop menu three dot
    document.querySelector('#dotMenuIcon').onclick = () => {
        const dotMenuCont = document.querySelector('#dotMenuCont');
        if(dotMenuCont.style.display == 'block')
            dotMenuCont.style.display = 'none';
        else
            dotMenuCont.style.display = 'block';
    };

    document.querySelector('#logout').onclick = e =>{
        Req.APIRequest('auth/logout', 'POST')
        .then(res => {
            location.href = "/login";
        });
    }
})
.catch(err =>{
    //nav for users that are not logged in
    document.querySelector(".nav").innerHTML = `
    <a href="/">
    <img src="../assets/img/Logo.png" alt="icon" class="nav__logo">
    </a>
    <div class="container container--row container--nogap">
        <ul class="nav__voices container container--row container--nogap">
            <li><a href="/">Home</a></li>
            <li><a href="/artisti">artisti</a></li>    
        </ul>

        <img src="../assets/img/nav/selector.png" alt="selector" class="nav__selector">
            
        <hr class="nav__separator">
        
        <div class="nav__user-cont container container--row container--Sgap container--SMarginH">
            <a class="nav__login" href="/login">
                Login
            </a>
            <button class="button" onclick="location.href = '/signup'">
                Sign up
            </button>
        </div>
    </div>`;
})
.finally(() => {
    
    document.querySelectorAll('.nav__voices > li').forEach((voice, i) => {
        voice.addEventListener('mouseover', e => { movePointer(i) });
        voice.addEventListener('mouseleave', e => { movePointer(0) });
    });

    movePointer(0);

    const nav = document.querySelector(".nav");
    if (document.documentElement.scrollTop >= 150) 
    {
        nav.style.background="white";
        nav.style.borderBottom="solid black 1px";
    }

    window.onscroll = () => {
        if (document.documentElement.scrollTop >= 10) 
        {
            nav.style.background="white";
            nav.style.borderBottom="solid black 1px";
        }
        else 
        {
            nav.style.background="transparent";
            nav.style.borderBottom="";
        }
    };

    window.onresize = () => movePointer(0);
 
});
