"use strict";

import Req from '/assets/js/requests.js'; 

document.querySelector(".form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.querySelector(".form input[name='email']").value;
    const password = document.querySelector(".form input[name='password']").value;
    const data = {
        email,
        password
    };
    

    Req.APIRequest('auth/login', 'POST', data)
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
        else if(Number(err.message) === 401)
            document.querySelector(".form__err").innerHTML = "Email o password sbagliati";
    });

});