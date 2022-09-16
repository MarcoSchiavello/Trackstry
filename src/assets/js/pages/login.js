"use strict";

import Req from '/assets/js/requests.js'; 

document.querySelector(".form").addEventListener("submit", e =>{
    e.preventDefault();
    let email = document.querySelector(".form input[name='email']").value;
    let password = document.querySelector(".form input[name='password']").value;
    let data = {
        email: email,
        password: password
    };
    

    Req.APIRequest('auth/login', 'POST', data)
    .then(res => {
        if(res.status > 399)
            throw new Error(res.status);                

        if(res.status === 200)
            location.href = "/";
    })
    .catch(err => {
        if(Number(err.message) === 500)
            document.querySelector(".err").innerHTML = "Errore con il server";
        else if(Number(err.message) === 401)
            document.querySelector(".err").innerHTML = "Email o password sbagliati";
    });

});