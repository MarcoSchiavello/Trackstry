"use strict";

import Req from '/assets/js/requests.js'; 

document.querySelector(".form").addEventListener("submit", e =>{
    event.preventDefault();

    let email = document.querySelector(".form > input[name='email']").value;
    let password = document.querySelector(".form > input[name='password']").value;
    let username = document.querySelector(".form > input[name='username']").value;

    let data = {
        username: username,
        email: email,
        password: password,
    };
    
    Req.APIRequest('auth/signup', 'POST', data)
    .then(res => {
        if(res.status > 399)
            throw new Error(res.status);       

        if(res.status === 200)
            location.href = "/";
    })
    .catch(err => {
        if(Number(err.message) === 500)
            document.querySelector(".err").innerHTML = "Errore con il server";
        else if(Number(err.message) === 409)
            document.querySelector(".err").innerHTML = "Email o username gia esistenti";
    });

});