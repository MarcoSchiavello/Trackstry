"use strict";

import Req from '/assets/js/requests.js'; 
import FakeUpload from '/assets/js/fakeUpload.js'

const removeEvent = e => {
    const rmBtn = e.target;
    const song = rmBtn.parentElement.parentElement;
    const songList = song.parentElement;

    
    if(songList.querySelectorAll('*[role="rmAlbumSong"]').length < 3)
        return;
    
    songList.removeChild(song);

    const trackNums = songList.querySelectorAll('*[field="trackNum"]');

    for(let i = 0; i < trackNums.length - 1; i++)
        trackNums[i + 1].innerHTML = i+1;
};

//removes the song entry from the list and recount the track number
document.querySelectorAll('*[role="rmAlbumSong"]').forEach(remBtn => remBtn.addEventListener('click', removeEvent) );

let numberOfSongs = 2;
document.querySelector('*[role="addAlbumSong"]').addEventListener('click', e => {
    const songList = document.querySelector('*[role="addAlbumSong"]').parentElement;

    const newElement = songList.firstElementChild.cloneNode(true);
    newElement.classList.remove('hidden'); 
    newElement.querySelector('*[field="trackNum"]').innerHTML = Number(songList.children[songList.children.length - 2].querySelector('*[field="trackNum"]').innerHTML) + 1;
    newElement.querySelector('*[role="rmAlbumSong"]').onclick = removeEvent;
    newElement.querySelector('*[fakeUpload="songFile"]').setAttribute('fakeUpload', 'songFile' + numberOfSongs);
    newElement.querySelector('*[realUpload="songFile"]').setAttribute('realUpload', 'songFile' + numberOfSongs);
    newElement.querySelector('*[fileName="songFile"]').setAttribute('fileName', 'songFile' + numberOfSongs);
    numberOfSongs++;
    
    document.querySelector('*[role="addAlbumSong"]').insertAdjacentElement('beforebegin', newElement);
    FakeUpload.bindElements();
});


document.querySelector('*[action="submitAlbum"]').onclick = e => {
    e.preventDefault();

    Req.APIRequest('auth/isLoggedIn', 'GET')
    .then(res => res.json())
    .then(artist => {
        const bodyAlbum = new FormData();
        bodyAlbum.append("albumName",document.querySelector("input[name='albumTitle']").value);
        bodyAlbum.append("albumImg",document.querySelector('*[field="albumImg"]').files[0]);
        
        Req.APIRequest(`artists/${artist.id}/albums`, 'POST', bodyAlbum, false)//FIXME: forse problema con il body
        .then(res => {
            if(res.status > 399)
                throw new Error(res.status);
            const json = res.json();
            json.artist = artist;
            return json;
        }) 
        .then(async newAlbumId => {
            const albumSongs = document.querySelectorAll('.album__song-list > li:not(:first-child)');
            const promises = [];
            for(const ele of albumSongs) 
            {
                let bodySong = new FormData();
                bodySong.append("song",ele.querySelector('*[field="songFile"]').files[0]);
                bodySong.append("songName",ele.querySelector("input[name='songTitle']").value);
                bodySong.append("albumId", newAlbumId.albumId);
                console.log(document.querySelector('*[field="songFile"]'));
                bodySong.append("songDuration",Math.floor( await getDuration(ele.querySelector('*[field="songFile"]'))));
                promises.push(Req.APIRequest(`artists/${artist.id}/songs`, 'POST', bodySong, false));
            };

            await Promise.all(promises);
            location.href = "/mia_musica/" + artist.id; 
        })
        
    })
}