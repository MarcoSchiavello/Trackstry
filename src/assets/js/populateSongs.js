import Config from '/config.json' assert { type: 'json' };
import Req from '/assets/js/requests.js'; 

let artId = location.href.split('/');
artId = artId[artId.length-1].split('?')[0];

const editMode = location.href.search('mia_musica') !== -1;

if(editMode) {
    document.querySelector('*[action="addAlbum"]').addEventListener('click',e => location.href = '/uploadAlbum/' + artId);
    document.querySelector('*[action="addSong"]').addEventListener('click',e => location.href = '/uploadSong/' + artId);
}

Req.APIRequest(`artists/${artId}`, 'GET')
.then(res => res.json())
.then(artist => { 
    //load profile data
    document.querySelector('*[field="coverImg"]').src = `http://${Config.API}` + artist.banner;
    document.querySelector('*[field="coverArtistImg"]').innerHTML = artist.name;
    document.querySelector('*[field="coverArtistName"]').src = `http://${Config.API}`+artist.img;

    return artist;
})
.then(artist => {
    const songsList = document.querySelector('*[template="singleSong"]').parentElement;
    Req.APIRequest(`artists/${artist.id}/songs`, 'GET')
    .then(res => res.json())
    .then(songs => { 
        // load single song
        const template = document.querySelector('*[template="singleSong"]');
        songs = songs.filter(song => song.album.id === null);
        
        songs.forEach(song => {
            const sigleSong = template.cloneNode(true);

            fillfields(sigleSong, { artist, song }, false);

            sigleSong.classList.remove('hidden');
            songsList.appendChild(sigleSong);
        });
    })

    // load albums
    Req.APIRequest(`artists/${artist.id}/albums`, 'GET')
    .then(res => res.json())
    .then(albums => {
        const albumEle = document.querySelector('.album');

        albums.forEach(album => {
            const tmpAlbumEle = albumEle.cloneNode(true);
            tmpAlbumEle.classList.remove('hidden');
            tmpAlbumEle.querySelector('*[field="albumName"]').innerHTML = album.name;
            tmpAlbumEle.querySelector('*[field="albumImg"]').src = `http://${Config.API}` + album.img;
            
            // load album's songs
            Req.APIRequest(`artists/${artist.id}/albums/${album.id}/songs`, 'GET')
            .then(res => res.json())
            .then(albumSongs => {
                const albumSongEle = tmpAlbumEle.querySelector('.album__song');
                const albumList = tmpAlbumEle.querySelector('.album__song-list');
                let i = 1;
                
                albumSongs.forEach(albumSong =>{
                    const tmpAlbumSongEle = albumSongEle.cloneNode(true);

                    fillfields(tmpAlbumSongEle, {album: album, song: albumSong, artist: artist, trackIndex: i},true);
                    
                    tmpAlbumSongEle.classList.remove('hidden');
                    albumList.appendChild(tmpAlbumSongEle);
                    i++;                                
                });
            })
            .then(() => {
                tmpAlbumEle.removeAttribute('style');
                document.querySelector('*[field="mediaContainer"]').appendChild(tmpAlbumEle);
            })
            
            if(editMode) {
                tmpAlbumEle.querySelector('*[action="delteAlbum"]').addEventListener('click',e => {
                    Req.APIRequest(`artists/${artist.id}/albums/${album.id}`, 'DELETE')
                    .then(succ => {
                        const ele = e.target.parentElement.parentElement;
                        document.querySelector('*[field="mediaContainer"]').removeChild(ele);
                    })
                });
                tmpAlbumEle.querySelector('*[action="addTrack"]').addEventListener('click',e => location.href = '/uploadSong/'+artist.id+'?album='+album.id);
            }
        });
    })
})
.catch(err => {
    console.log(err);
})

function fillfields(element, data, isAlbumSong = false)
{
    let pathForPlayer;
    if(!isAlbumSong) {
        element.querySelector('*[field="songTitle"]').innerHTML = data.song.name;
        element.querySelector('*[field="songAuthor"]').innerHTML = data.artist.name;
        element.querySelector('*[field="songImg"]').src = `http://${Config.API}` + data.song.img;
        element.querySelector('*[field="songDuration"]').innerHTML = getTimeFormat(data.song.duration);
        pathForPlayer = '/player?artist='+data.artist.id+'&song='+data.song.id;
    } else {
        element.querySelector('*[field="albumTrackNumber"]').innerHTML = data.trackIndex;
        element.querySelector('*[field="albumTrackTitle"]').innerHTML = data.song.name;
        element.querySelector('*[field="albumTrackAuthor"]').innerHTML = data.artist.name;
        element.querySelector('*[field="albumTrackAlbum"]').innerHTML = data.album.name;
        element.querySelector('*[field="albumTrackDuration"]').innerHTML = getTimeFormat(data.song.duration);
        pathForPlayer = '/player?artist=' + data.artist.id + '&album=' + data.album.id + '&song=' + data.song.id;
    }

    if(location.href.search('mia_musica') === -1)
    {
        Req.APIRequest(`auth/isLoggedIn`, 'GET')
        .then(res => res.json())
        .then(artistLoggedIn => {
            setFavoriteButton(artistLoggedIn, element, data.song);
        })
        .catch(err =>{
            console.log(err);
        });
    }
    else
    {
        if(!isAlbumSong) {
            element.querySelector('*[action="removeSong"]').addEventListener('click',e => {
                Req.APIRequest(`artists/${data.artist.id}/songs/${data.song.id}`, 'DELETE')
                .then(succ => {
                    element.parentElement.removeChild(element);
                });
            });
        } else {
            element.querySelector('*[action="delteAlbumTrack"]').addEventListener('click',e => {
                Req.APIRequest(`artists/${data.artist.id}/songs/${data.song.id}`, 'DELETE')
                .then(succ => {
                    console.log(element.parentElement );
                    if(element.parentElement.children.length <= 2 && element.parentElement.children.length !== undefined)
                    {
                        Req.APIRequest(`artists/${data.artist.id}/albums/${data.album.id}`, 'DELETE')
                        .then(succ => {
                            console.log(element.parentElement);
                            document.querySelector('.album__song-list').removeChild(element.parentElement.parentElement);
                        })
                    }
                    else
                        element.parentElement.removeChild(element);
                })
            });
        }
    }

    element.onclick = e => {
        if(!e.target.classList.contains('icon'))
            location.href = pathForPlayer;
    };

}

function setFavoriteButton(artistLoggedIn, element, song) {
    const star = element.querySelector('*[action="favStar"]');

    
    Req.APIRequest(`artists/${artistLoggedIn.id}/favorites/${song.id}`, 'GET')
    .then(res => {
        if(!res.ok) 
            throw new Error('no favorites found');
        return res.json();
    })
    .then(favorite => star.setAttribute('src', '../assets/img/preferiti/stella_piena.png'))
    .catch(err => star.setAttribute('src', '../assets/img/preferiti/stella_vuota.png'));

    element.querySelector('*[action="favStar"]').addEventListener('click', e => {
        if(star.src.search('piena') !== -1) {
            Req.APIRequest(`artists/${artistLoggedIn.id}/favorites/${song.id}`, 'DELETE')
            .then(succ =>{
                star.setAttribute('src','../assets/img/preferiti/stella_vuota.png');
            })
        } else {
            Req.APIRequest(`artists/${artistLoggedIn.id}/favorites`, 'POST', {songId: song.id})
            .then(succ =>{
                star.setAttribute('src','../assets/img/preferiti/stella_piena.png');
            })
        }
    })   
}