"use strict";

import Req from '/assets/js/requests.js'; 

const removeEvent = e => {
    const rmBtn = e.target;
    const song = rmBtn.parentElement.parentElement;
    const songList = song.parentElement;

    
    if(songList.querySelectorAll('*[role="rmAlbumSong"]').length < 3)
        return;
    
    songList.removeChild(song);

    const trackNums = songList.querySelectorAll('*[field="trackNum"]');

    for(let i = 0; i < trackNums.length; i++)
        trackNums[i+1].innerHTML = i+1;
};

//removes the song entry from the list and recount the track number
document.querySelectorAll('*[role="rmAlbumSong"]').forEach(remBtn => remBtn.addEventListener('click', removeEvent) );

//removes the song entry from the list and recount the track number
document.querySelectorAll('*[role="addAlbumSong"]').forEach(addBtn => {
    addBtn.addEventListener('click', e => {
        const songList = addBtn.parentElement;

        const newElement = songList.firstElementChild.cloneNode(true);
        newElement.classList.remove('hidden'); 
        newElement.querySelector('*[field="trackNum"]').innerHTML = Number(songList.children[songList.children.length - 2].querySelector('*[field="trackNum"]').innerHTML) + 1;
        newElement.querySelector('*[role="rmAlbumSong"]').onclick = removeEvent;

        addBtn.insertAdjacentElement('beforebegin', newElement);
    });
});


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