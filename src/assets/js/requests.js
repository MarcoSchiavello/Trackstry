"use strict";

import Conifg from '/config.json' assert { type: 'json' };

async function APIRequest(uri, method, body, json = true) {
    return fetch(`http://${Conifg.API}/v1/${uri}`, {
        method: method,
        credentials: 'include',
        mode: 'cors',
        headers: json ? {
            'Content-Type': 'application/json'
        } : {},
        body: json ? JSON.stringify(body) : body
    });
}

export default {
    APIRequest
}