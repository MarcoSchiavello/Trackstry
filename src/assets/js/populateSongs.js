let artId = location.href.split("/");
artId = artId[artId.length-1].split("?")[0];

if(location.href.search("mia_musica") !== -1)
{
    document.querySelector("#addAlbum").addEventListener("click",e => location.href = "/uploadAlbum/"+artId);
    document.querySelector("#addSong").addEventListener("click",e => location.href = "/uploadSong/"+artId);
}

fetch("http://localhost:4000/v1/artists/"+artId,{method: 'GET',credentials: 'include'})
.then(res => res.json())
.then(artist => { //load profile data
        document.querySelector(".img_cover").src = "http://localhost:4000"+artist.banner;
        document.querySelector("#name_artista").innerHTML = artist.name;
        document.querySelector("#img_artista").src = "http://localhost:4000"+artist.img;
        return artist;
})
.then(artist => {
    fetch("http://localhost:4000/v1/artists/"+artist.id+"/songs",{method: 'GET',credentials: 'include'})
    .then(res => res.json())
    .then(songs => { // load single song
        const sigleSong = document.querySelector(".single_song");
        songs = songs.filter(song => song.album.id === null);
        
        songs.forEach(song => {
            const tmpSigleSong = sigleSong.cloneNode(true);

            fillfields(tmpSigleSong,{song: song, artist: artist});

            tmpSigleSong.removeAttribute("style");
            document.querySelector(".song_container").appendChild(tmpSigleSong);
        });
    })

    // load albums
    fetch("http://localhost:4000/v1/artists/"+artist.id+"/albums",{method: 'GET',credentials: 'include'})
    .then(res => res.json())
    .then(albums => {
        const albumEle = document.querySelector(".album");

        albums.forEach(album => {
            const tmpAlbumEle = albumEle.cloneNode(true);
            tmpAlbumEle.querySelector(".album_header h1").innerHTML = album.name;
            tmpAlbumEle.querySelector(".album_header img").src = "http://localhost:4000"+album.img;
            
            // load album's songs
            fetch("http://localhost:4000/v1/artists/"+artist.id+"/albums/"+album.id+"/songs",{method: 'GET',credentials: 'include'})
            .then(res => res.json())
            .then(albumSongs => {
                const albumSongEle = tmpAlbumEle.querySelector(".album_song");
                const albumList = tmpAlbumEle.querySelector(".album_list");
                let i = 1;
                
                albumSongs.forEach(albumSong =>{
                    const tmpAlbumSongEle = albumSongEle.cloneNode(true);

                    fillfields(tmpAlbumSongEle,{album: album, song: albumSong, artist: artist, trackIndex: i},true);
                    
                    tmpAlbumSongEle.removeAttribute("style");
                    albumList.appendChild(tmpAlbumSongEle);
                    i++;                                
                });
            })
            .then(() =>{
                tmpAlbumEle.removeAttribute("style");
                document.querySelector(".song_container").appendChild(tmpAlbumEle);
            })
             
            if(location.href.search("mia_musica") !== -1)
            {
                tmpAlbumEle.querySelector(".removeAlbum").addEventListener("click",e => {
                    fetch("http://localhost:4000/v1/artists/"+artist.id+"/albums/"+album.id,{method: 'DELETE',credentials: 'include'})
                    .then(succ => {
                        const ele = e.target.parentElement.parentElement;
                        document.querySelector(".song_container").removeChild(ele);
                    })
                });
                tmpAlbumEle.querySelector("#addSongToAlbum").addEventListener("click",e => location.href = "/uploadSong/"+artist.id+"?album="+album.id);
            }
        });
    })
})
.catch(err => {
    console.log(err);
})

function fillfields(element,data,isAlbumSong = false)
{
    let pathForPlayer;
    if(!isAlbumSong)
    {
        element.querySelector("h1").innerHTML = data.song.name;
        element.querySelector("h3").innerHTML = data.artist.name;
        element.querySelector("img").src = "http://localhost:4000"+data.song.img;
        element.querySelector(".duration").innerHTML = getTimeFormat(data.song.duration);
        pathForPlayer = "/player?artist="+data.artist.id+"&song="+data.song.id;
    }
    else
    {
        element.querySelector(".n_track").innerHTML += (" "+data.trackIndex);
        element.querySelector(".song_name").innerHTML = data.song.name;
        element.querySelector(".author").innerHTML = data.song.name;
        element.querySelector(".song_title").innerHTML = data.album.name;
        element.querySelector(".duration").innerHTML = getTimeFormat(data.song.duration);
        pathForPlayer = "/player?artist="+data.artist.id+"&album="+data.album.id+"&song="+data.song.id;
    }

    if(location.href.search("mia_musica") === -1)
    {
        fetch("http://localhost:4000/v1/auth/isLoggedIn",{method: 'GET',credentials: 'include'})
        .then(res => res.json())
        .then(artistLoggedIn => {
            setFavoriteButton(artistLoggedIn,element,data.song);
        })
        .catch(err =>{
            console.log(err);
        });
        element.onclick = e => {
            if(e.target.className.search("fav_star") === -1)
                location.href = pathForPlayer;
        };
    
    }
    else
    {
        element.querySelector(".removeSong").addEventListener("click",e => {
            fetch("http://localhost:4000/v1/artists/"+data.artist.id+"/songs/"+data.song.id,{method: 'DELETE',credentials: 'include'})
            .then(succ => {
                console.log(element.parentElement );
                if(element.parentElement.children.length <= 2 && element.parentElement.children.length !== undefined)
                {
                    fetch("http://localhost:4000/v1/artists/"+data.artist.id+"/albums/"+data.album.id,{method: 'DELETE',credentials: 'include'})
                    .then(succ => {
                        console.log(element.parentElement);
                        document.querySelector(".song_container").removeChild(element.parentElement.parentElement);
                    })
                }
                else
                    element.parentElement.removeChild(element);
            })
        });

        element.onclick = e => {
            if(e.target.className.search("removeSong") === -1)
                location.href = pathForPlayer;
        };
    }

}

function setFavoriteButton(artistLoggedIn,element,song)
{
    const star = element.querySelector(".fav_star");

    fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.id+"/favorites/"+song.id,{method: 'GET',credentials: 'include'})
    .then(res => res.json())
    .then(favorite => {
        if(favorite.error !== undefined)// if it find an error it means that the song is not in the favorite
            star.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
        else
            star.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
    })

    element.querySelector(".fav_star").addEventListener("click",e => {
        if(star.src.search("piena") !== -1)
        {
            fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.id+"/favorites/"+song.id,{
                method: 'DELETE',
                credentials: 'include',
            })
            .then(succ =>{
                star.setAttribute("src","../assets/Img/preferiti/stella_vuota.png");
            })
        }
        else
        {
            fetch("http://localhost:4000/v1/artists/"+artistLoggedIn.id+"/favorites",{
                method: 'POST',
                credentials: 'include',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({songId: song.id})
            })
            .then(succ =>{
                star.setAttribute("src","../assets/Img/preferiti/stella_piena.png");
            })
        }
    })   
}