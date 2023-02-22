"use strict";

import Req from '/assets/js/requests.js'; 

const urlParams = new URLSearchParams(location.search);

if(urlParams.get("album") !== null)
    document.querySelector('*[fakeUpload="albumImg"]').style.display = "none";

document.querySelector('*[action="submitUploading"]').onclick = e => {
    e.preventDefault();

    let body = new FormData();
    body.append("songName",document.querySelector('*[name="songTitle"]').value);
    let fileName = document.querySelector('*[name="songTitle"]').value;
    fileName = fileName.split("/").length > fileName.split("\\").length ? fileName.split("/") : fileName.split("\\");
    fileName = fileName[fileName.length-1];

    body.append("song",document.querySelector('*[name="songFile"]').files[0]);
    body.append("songImg",document.querySelector('*[name="songImg"]').files[0]);
    
    getDuration(document.querySelector('*[name="songFile"]'))
    .then(songDuration => body.append("songDuration",Math.floor(songDuration)))
    .then(() => {           
        if(urlParams.get("album") !== null)
            body.append("albumId",urlParams.get("album"));

        Req.APIRequest(`auth/isLoggedIn`, 'GET')
        .then(res => res.json())
        .then(artist => {
            Req.APIRequest(`artists/${artist.id}/songs`, 'POST', body, false)
            .then(newSongId => {
                location.href = "/mia_musica/" + artist.id;
            })
            .catch(() => {
                //do something
            });
        })
    })
    

}