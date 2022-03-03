"use strict";

import Req from '/assets/js/requests.js'; 

const urlParams = new URLSearchParams(location.search);

if(urlParams.get("album") !== null)
    document.querySelector(".fake_upload").style.display = "none";

document.querySelector(".fake_upload").onclick = e => {
    document.querySelector(".upload").click();
}
document.querySelector(".upload").onchange = e => {
    const tmpfile = document.querySelector(".upload");
    const [file] = tmpfile.files;
    if(file) 
    {
        document.querySelector(".preview").src = URL.createObjectURL(file);
        document.querySelector(".preview").style.display = "block";
    }
}
document.querySelector(".fakeUploadSong").onclick = e => {
    document.querySelector(".uploadSong").click();
}

document.querySelector(".uploadSong").onchange = e => {

    let fileName = document.querySelector(".uploadSong").value;
    fileName = fileName.split("/").length > fileName.split("\\").length ? fileName.split("/") : fileName.split("\\");
    fileName = fileName[fileName.length-1];
    document.querySelector("#uploadSongName").innerHTML = fileName;
}

document.querySelector("#sub_upload_song").onclick = e => {
    e.preventDefault();

    let body = new FormData();
    body.append("songName",document.querySelector("input[name='title_song']").value);
    let fileName = document.querySelector(".uploadSong").value;
    fileName = fileName.split("/").length > fileName.split("\\").length ? fileName.split("/") : fileName.split("\\");
    fileName = fileName[fileName.length-1];

    body.append("song",document.querySelector(".uploadSong").files[0]);
    body.append("songImg",document.querySelector(".upload").files[0]);
    
    getDuration(document.querySelector(".uploadSong"))
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