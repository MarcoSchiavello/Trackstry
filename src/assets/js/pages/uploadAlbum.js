"use strict";

import Req from '/assets/js/requests.js'; 

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

document.querySelector("#sub_upload_album").onclick = e => {
    e.preventDefault();
    
    Req.APIRequest('auth/isLoggedIn', 'GET')
    .then(res => res.json())
    .then(artist => {
        let promises = [];
        let bodyAlbum = new FormData();
        bodyAlbum.append("albumName",document.querySelector("input[name='title_album']").value);
        bodyAlbum.append("albumImg",document.querySelector(".upload").files[0]);

        Req.APIRequest(`artists/${artist.id}/albums`, 'POST', bodyAlbum, false)//FIXME: forse problema con il body
        .then(res => {
            if(res.status > 399)
                throw new Error(res.status);
            return res.json();
        }) 
        .then(async newAlbumId => {
            const albumSongs = document.querySelector("#album_list").children;
            let promises = [];
            for(const ele of albumSongs) 
            {
                let bodySong = new FormData();
                bodySong.append("song",ele.querySelector(".uploadSong").files[0]);
                bodySong.append("songName",ele.querySelector("input[name='title_song']").value);
                bodySong.append("albumId",newAlbumId.albumId);
                bodySong.append("songDuration",Math.floor( await getDuration(document.querySelector(".uploadSong") )));
                promises.push(Req.APIRequest(`artists/${artist.id}/songs`, 'POST', bodySong, false));
            };

            await Promise.all(promises);
            location.href = "/mia_musica/" + artist.id; 
        })
        
    })
}