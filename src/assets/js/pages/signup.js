"use strict";

import Req from '/assets/js/requests.js'; 

document.querySelector(".form").addEventListener("submit", e =>{
    e.preventDefault();

    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    const username = document.querySelector("input[name='username']").value;

    const data = {
        username,
        email,
        password,
    };

    console.log();
    
    Req.APIRequest('auth/signup', 'POST', data)
    .then(res => {
        if(res.status > 399)
            throw new Error(res.status);       

        if(res.status === 200)
            location.href = "/";
    })
    .catch(err => {
        document.querySelector(".form__err").style.display = 'block';
        if(Number(err.message) === 500)
            document.querySelector(".form__err").innerHTML = "Errore con il server";
        else if(Number(err.message) === 409)
            document.querySelector(".form__err").innerHTML = "Email o username gia esistenti";
    });

});