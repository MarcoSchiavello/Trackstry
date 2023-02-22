"use strict";

import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

Req.APIRequest('auth/isLoggedIn', 'GET')
.then(res => res.json())
.then(artist => {
    document.querySelector('*[field="coverImg"]').src = `http://${Config.API}` + artist.banner;

    Req.APIRequest(`artists/${artist.id}/favorites`, 'GET')
    .then(res => res.json())
    .then(favorites => {
        const album = document.querySelector('.album');
        const albumSongEle = album.querySelector('.album__song');
        const albumList = album.querySelector('.album__song-list');
        favorites.forEach(ele => {
            const tmpAlbumSongEle = albumSongEle.cloneNode(true);
            
            tmpAlbumSongEle.querySelector('*[field="albumTrackTitle"]').innerHTML =  ele.song.name;
            tmpAlbumSongEle.querySelector('*[field="albumTrackAuthor"]').innerHTML = ele.artist.name;
            tmpAlbumSongEle.querySelector('*[field="albumTrackAlbum"]').innerHTML = ele.album.name;
            tmpAlbumSongEle.querySelector('*[field="albumTrackDuration"]').innerHTML = getTimeFormat(ele.song.duration);

            tmpAlbumSongEle.classList.remove('hidden');
            albumList.appendChild(tmpAlbumSongEle);
            
            const star = tmpAlbumSongEle.querySelector('*[action="favStar"]');
            star.setAttribute('src', '../assets/img/preferiti/stella_piena.png')
            star.onclick = e => {
                Req.APIRequest(`artists/${artist.id}/favorites/${ele.id}`, 'DELETE')
                .then(res => {
                    star.parentElement.parentElement.parentElement.parentElement.removeChild(star.parentElement.parentElement.parentElement);
                })
            };
            
            tmpAlbumSongEle.onclick = e => {
                if(!e.target.classList.contains('icon'))
                    location.href = '/player?artist=' + artist.id + '&favorite=' + ele.id;
            };
        });
    });
});